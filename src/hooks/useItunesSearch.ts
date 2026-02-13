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

      const url = `https://itunes.apple.com/search?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const text = await response.text()

      // JSONパースを試行
      let data: ItunesSearchResult
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error('レスポンス解析エラー')
      }

      setResults(data.results || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : '不明なエラー'
      setError(message)
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
