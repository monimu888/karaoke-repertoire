import { useParams, useNavigate } from 'react-router-dom'
import { SongForm, ScorePhotoUpload } from '../components/song'
import { useSong, useSongs, useTags, useImageUpload } from '../hooks'
import type { SongFormData } from '../utils/validation'
import type { UpdateSongInput } from '../types'

export function EditSongPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { song, loading } = useSong(id)
  const { updateSong } = useSongs()
  const { tags } = useTags()

  const {
    previewUrl,
    loading: photoLoading,
    error: photoError,
    selectImage,
    savePhoto,
    deletePhoto,
    clearPreview,
    hasPendingChanges,
  } = useImageUpload({
    songId: song?.id,
    existingPhotoId: song?.scorePhotoId,
  })

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
    if (hasPendingChanges) {
      await savePhoto()
    }
    navigate(`/song/${song.id}`)
  }

  const handleClearPhoto = async () => {
    if (song.scorePhotoId && !hasPendingChanges) {
      await deletePhoto()
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
