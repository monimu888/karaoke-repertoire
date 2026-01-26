import { Music } from 'lucide-react'
import { SongCard } from './SongCard'
import type { Song, Tag } from '../../types'

interface SongListProps {
  songs: Song[]
  tags: Tag[]
  loading?: boolean
}

export function SongList({ songs, tags, loading }: SongListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 animate-pulse"
          >
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (songs.length === 0) {
    return (
      <div className="text-center py-12">
        <Music size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">曲がありません</p>
        <p className="text-sm text-gray-400 mt-1">
          「曲追加」から曲を登録してください
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} tags={tags} />
      ))}
    </div>
  )
}
