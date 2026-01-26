import { useState, useEffect, useCallback } from 'react'
import { songRepository } from '../db/songRepository'
import type { Song, CreateSongInput, UpdateSongInput } from '../types'

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const data = await songRepository.findAll()
      setSongs(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch songs'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addSong = useCallback(async (input: CreateSongInput) => {
    const newSong = await songRepository.create(input)
    setSongs((prev) => [newSong, ...prev])
    return newSong
  }, [])

  const updateSong = useCallback(async (id: string, input: UpdateSongInput) => {
    const updated = await songRepository.update(id, input)
    if (updated) {
      setSongs((prev) => prev.map((s) => (s.id === id ? updated : s)))
    }
    return updated
  }, [])

  const deleteSong = useCallback(async (id: string) => {
    await songRepository.delete(id)
    setSongs((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return {
    songs,
    loading,
    error,
    refresh,
    addSong,
    updateSong,
    deleteSong,
  }
}

export function useSong(id: string | undefined) {
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) {
      setSong(null)
      setLoading(false)
      return
    }

    const fetch = async () => {
      try {
        setLoading(true)
        const data = await songRepository.findById(id)
        setSong(data || null)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch song'))
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [id])

  return { song, loading, error }
}
