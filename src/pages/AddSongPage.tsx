import { useNavigate } from 'react-router-dom'
import { SongForm } from '../components/song'
import { useSongs, useTags } from '../hooks'
import type { SongFormData } from '../utils/validation'
import type { CreateSongInput } from '../types'

export function AddSongPage() {
  const navigate = useNavigate()
  const { addSong } = useSongs()
  const { tags } = useTags()

  const handleSubmit = async (data: SongFormData) => {
    const input: CreateSongInput = {
      ...data,
      proficiency: data.proficiency as 1 | 2 | 3 | 4 | 5,
    }
    await addSong(input)
    navigate('/')
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">曲を追加</h2>
      <SongForm
        tags={tags}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
        submitLabel="追加"
      />
    </div>
  )
}
