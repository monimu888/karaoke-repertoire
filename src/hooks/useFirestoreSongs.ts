import { useState, useEffect, useCallback } from 'react'
import {
  subscribeSongs,
  subscribeSong,
  createSong,
  updateSong,
  deleteSong,
  uploadPhoto,
  deletePhoto,
} from '../db/firestoreRepository'
import type { Song, CreateSongInput, UpdateSongInput } from '../types'

export function useFirestoreSongs(userId: string | undefined) {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setSongs([])
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = subscribeSongs(userId, (songs) => {
      setSongs(songs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  const addSong = useCallback(
    async (input: CreateSongInput) => {
      if (!userId) throw new Error('ログインが必要です')
      const newSong = await createSong(userId, input)
      return newSong
    },
    [userId]
  )

  const editSong = useCallback(
    async (songId: string, input: UpdateSongInput) => {
      if (!userId) throw new Error('ログインが必要です')
      await updateSong(userId, songId, input)
    },
    [userId]
  )

  const removeSong = useCallback(
    async (songId: string, scorePhotoId?: string | null) => {
      if (!userId) throw new Error('ログインが必要です')
      await deleteSong(userId, songId, scorePhotoId)
    },
    [userId]
  )

  const savePhoto = useCallback(
    async (songId: string, blob: Blob) => {
      if (!userId) throw new Error('ログインが必要です')
      return await uploadPhoto(userId, songId, blob)
    },
    [userId]
  )

  const removePhoto = useCallback(
    async (songId: string, photoUrl: string) => {
      if (!userId) throw new Error('ログインが必要です')
      await deletePhoto(userId, songId, photoUrl)
    },
    [userId]
  )

  return {
    songs,
    loading,
    error,
    addSong,
    updateSong: editSong,
    deleteSong: removeSong,
    savePhoto,
    deletePhoto: removePhoto,
  }
}

export function useFirestoreSong(userId: string | undefined, songId: string | undefined) {
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId || !songId) {
      setSong(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = subscribeSong(
      userId,
      songId,
      (song) => {
        setSong(song)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId, songId])

  return { song, loading, error }
}

export function useFirestoreSongMutations(userId: string | undefined) {
  const editSong = useCallback(
    async (songId: string, input: UpdateSongInput) => {
      if (!userId) throw new Error('ログインが必要です')
      await updateSong(userId, songId, input)
    },
    [userId]
  )

  const removeSong = useCallback(
    async (songId: string, scorePhotoId?: string | null) => {
      if (!userId) throw new Error('ログインが必要です')
      await deleteSong(userId, songId, scorePhotoId)
    },
    [userId]
  )

  const savePhotoFn = useCallback(
    async (songId: string, blob: Blob) => {
      if (!userId) throw new Error('ログインが必要です')
      return await uploadPhoto(userId, songId, blob)
    },
    [userId]
  )

  const removePhoto = useCallback(
    async (songId: string, photoUrl: string) => {
      if (!userId) throw new Error('ログインが必要です')
      await deletePhoto(userId, songId, photoUrl)
    },
    [userId]
  )

  return {
    updateSong: editSong,
    deleteSong: removeSong,
    savePhoto: savePhotoFn,
    deletePhoto: removePhoto,
  }
}
