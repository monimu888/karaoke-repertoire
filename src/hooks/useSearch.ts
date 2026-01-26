import { useState, useEffect, useMemo } from 'react'
import type { Song } from '../types'

type SortKey = 'updatedAt' | 'title' | 'artist' | 'proficiency' | 'highScore'
type SortOrder = 'asc' | 'desc'

interface UseSearchOptions {
  songs: Song[]
  query: string
  selectedTags: string[]
  sortKey: SortKey
  sortOrder: SortOrder
}

export function useSearch({
  songs,
  query,
  selectedTags,
  sortKey,
  sortOrder,
}: UseSearchOptions) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const filteredSongs = useMemo(() => {
    let result = [...songs]

    if (debouncedQuery) {
      const lowerQuery = debouncedQuery.toLowerCase()
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(lowerQuery) ||
          song.artist.toLowerCase().includes(lowerQuery)
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter((song) =>
        selectedTags.some((tagId) => song.tags.includes(tagId))
      )
    }

    result.sort((a, b) => {
      let comparison = 0

      switch (sortKey) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ja')
          break
        case 'artist':
          comparison = a.artist.localeCompare(b.artist, 'ja')
          break
        case 'proficiency':
          comparison = a.proficiency - b.proficiency
          break
        case 'highScore':
          comparison = (a.highScore ?? 0) - (b.highScore ?? 0)
          break
        case 'updatedAt':
        default:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [songs, debouncedQuery, selectedTags, sortKey, sortOrder])

  return {
    filteredSongs,
    isSearching: query !== debouncedQuery,
  }
}
