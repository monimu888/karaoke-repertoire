import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { StarRating } from '../common/StarRating'
import { TagBadge } from '../common/TagBadge'
import type { Song, Tag } from '../../types'

interface SongCardProps {
  song: Song
  tags: Tag[]
}

export function SongCard({ song, tags }: SongCardProps) {
  const navigate = useNavigate()

  const songTags = useMemo(() => {
    const tagIdSet = new Set(song.tags)
    return tags.filter((tag) => tagIdSet.has(tag.id))
  }, [song.tags, tags])

  return (
    <div
      onClick={() => navigate(`/song/${song.id}`)}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{song.title}</h3>
          <p className="text-sm text-gray-500 truncate">{song.artist}</p>
        </div>
        <ChevronRight size={20} className="text-gray-400 flex-shrink-0 ml-2" />
      </div>

      <div className="mt-2 flex items-center gap-4">
        <StarRating value={song.proficiency} readonly size="sm" />
        {song.highScore !== null && (
          <span className="text-sm text-indigo-600 font-medium">
            {song.highScore}点
          </span>
        )}
      </div>

      {songTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {songTags.slice(0, 3).map((tag) => (
            <TagBadge key={tag.id} name={tag.name} color={tag.color} />
          ))}
          {songTags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{songTags.length - 3}
            </span>
          )}
        </div>
      )}

      {song.key.adjustment !== 0 && (
        <div className="mt-2 text-xs text-gray-500">
          キー: {song.key.adjustment > 0 ? '+' : ''}{song.key.adjustment}
        </div>
      )}
    </div>
  )
}
