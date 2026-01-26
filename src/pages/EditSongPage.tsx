import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SongForm, ScorePhotoUpload } from '../components/song'
import { useFirestoreSongs, useFirestoreSong, useFirestoreTags } from '../hooks'
import { useAuthContext } from '../contexts/AuthContext'
import { resizeImage, createObjectURL, revokeObjectURL } from '../utils/imageUtils'
import type { SongFormData } from '../utils/validation'
import type { UpdateSongInput } from '../types'

export function EditSongPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { song, loading } = useFirestoreSong(user?.uid, id)
  const { updateSong, savePhoto, deletePhoto } = useFirestoreSongs(user?.uid)
  const { tags } = useFirestoreTags(user?.uid)

  const [previewUrl, setPreviewUrl] = useState<string | null>(song?.scorePhotoId || null)
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoError, setPhotoError] = useState<string | null>(null)

  const selectImage = async (file: File) => {
    try {
      setPhotoLoading(true)
      setPhotoError(null)
      const resizedBlob = await resizeImage(file)
      setPendingBlob(resizedBlob)
      if (previewUrl && !previewUrl.startsWith('http')) {
        revokeObjectURL(previewUrl)
      }
      setPreviewUrl(createObjectURL(resizedBlob))
    } catch {
      setPhotoError('画像の処理に失敗しました')
    } finally {
      setPhotoLoading(false)
    }
  }

  const clearPreview = () => {
    if (previewUrl && !previewUrl.startsWith('http')) {
      revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setPendingBlob(null)
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">曲が見つかりません</p>
      </div>
    )
  }

  const handleSubmit = async (data: SongFormData) => {
    const input: UpdateSongInput = {
      ...data,
      proficiency: data.proficiency as 1 | 2 | 3 | 4 | 5,
    }
    await updateSong(song.id, input)
    if (pendingBlob) {
      await savePhoto(song.id, pendingBlob)
    }
    navigate(`/song/${song.id}`)
  }

  const handleClearPhoto = async () => {
    if (song.scorePhotoId && !pendingBlob) {
      await deletePhoto(song.id, song.scorePhotoId)
      setPreviewUrl(null)
    } else {
      clearPreview()
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">曲を編集</h2>

      <div className="mb-6">
        <ScorePhotoUpload
          previewUrl={previewUrl}
          loading={photoLoading}
          error={photoError}
          onSelectImage={selectImage}
          onClear={handleClearPhoto}
        />
      </div>

      <SongForm
        defaultValues={{
          title: song.title,
          artist: song.artist,
          tags: song.tags,
          proficiency: song.proficiency,
          key: song.key,
          highScore: song.highScore,
          scorePhotoId: song.scorePhotoId,
          memo: song.memo,
        }}
        tags={tags}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/song/${song.id}`)}
        submitLabel="保存"
      />
    </div>
  )
}
