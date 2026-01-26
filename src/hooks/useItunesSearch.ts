import { useState, useEffect, useCallback } from 'react'

export interface ItunesTrack {
  trackId: number
  trackName: string
  artistName: string
  artworkUrl100?: string
}

interface ItunesSearchResult {
  resultCount: number
  results: ItunesTrack[]
}

export function useItunesSearch(query: string, delay = 500) {
  const [results, setResults] = useState<ItunesTrack[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        term,
        country: 'JP',
        media: 'music',
        entity: 'song',
        limit: '10',
      })

      const response = await fetch(
        `https://itunes.apple.com/search?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error('検索に失敗しました')
      }

      const data: ItunesSearchResult = await response.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : '検索エラー')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      search(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay, search])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  return {
    results,
    loading,
    error,
    clearResults,
  }
}
