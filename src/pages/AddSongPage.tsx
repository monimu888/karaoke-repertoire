import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SongForm } from '../components/song'
import { useSongs, useTags } from '../hooks'
import type { SongFormData } from '../utils/validation'
import type { CreateSongInput } from '../types'

export function AddSongPage() {
  const navigate = useNavigate()
  const { addSong } = useSongs()
  const { tags } = useTags()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: SongFormData) => {
    try {
      setError(null)
      const input: CreateSongInput = {
        ...data,
        proficiency: data.proficiency as 1 | 2 | 3 | 4 | 5,
      }
      await addSong(input)
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
      <SongForm
        tags={tags}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
        submitLabel="追加"
      />
    </div>
  )
}
