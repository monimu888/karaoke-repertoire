import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SongForm, ScorePhotoUpload } from '../components/song'
import { useSongs, useTags, useImageUpload } from '../hooks'
import { songRepository } from '../db/songRepository'
import type { SongFormData } from '../utils/validation'
import type { CreateSongInput } from '../types'

export function AddSongPage() {
  const navigate = useNavigate()
  const { addSong } = useSongs()
  const { tags } = useTags()
  const [error, setError] = useState<string | null>(null)

  const {
    previewUrl,
    pendingBlob,
    loading: photoLoading,
    error: photoError,
    selectImage,
    clearPreview,
  } = useImageUpload()

  const handleSubmit = async (data: SongFormData) => {
    try {
      setError(null)
      const input: CreateSongInput = {
        ...data,
        proficiency: data.proficiency as 1 | 2 | 3 | 4 | 5,
      }
      const newSong = await addSong(input)

      // 写真がある場合は保存
      if (pendingBlob && newSong) {
        await songRepository.savePhoto(newSong.id, pendingBlob)
      }

      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '曲の追加に失敗しました')
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">曲を追加</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <ScorePhotoUpload
          previewUrl={previewUrl}
          loading={photoLoading}
          error={photoError}
          onSelectImage={selectImage}
          onClear={clearPreview}
        />
      </div>

      <SongForm
        tags={tags}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
        submitLabel="追加"
      />
    </div>
  )
}
