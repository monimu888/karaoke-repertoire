import { useState } from 'react'
import { SearchBar, TagFilter, SortSelect } from '../components/filter'
import { SongList } from '../components/song'
import { useFirestoreSongs, useFirestoreTags, useSearch } from '../hooks'
import { useAuthContext } from '../contexts/AuthContext'

type SortKey = 'updatedAt' | 'title' | 'artist' | 'proficiency' | 'highScore'
type SortOrder = 'asc' | 'desc'

export function HomePage() {
  const { user } = useAuthContext()
  const { songs, loading: songsLoading } = useFirestoreSongs(user?.uid)
  const { tags, loading: tagsLoading } = useFirestoreTags(user?.uid)

  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const { filteredSongs } = useSearch({
    songs,
    query,
    selectedTags,
    sortKey,
    sortOrder,
  })

  const loading = songsLoading || tagsLoading

  return (
    <div className="p-4 space-y-4">
      <SearchBar value={query} onChange={setQuery} />

      {tags.length > 0 && (
        <TagFilter
          tags={tags}
          selectedIds={selectedTags}
          onChange={setSelectedTags}
        />
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {filteredSongs.length}曲
        </span>
        <SortSelect
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortKeyChange={setSortKey}
          onSortOrderChange={setSortOrder}
        />
      </div>

      <SongList songs={filteredSongs} tags={tags} loading={loading} />
    </div>
  )
}
