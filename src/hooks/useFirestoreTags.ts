import { useState, useEffect, useCallback } from 'react'
import {
  subscribeTags,
  createTag,
  updateTag,
  deleteTag,
  initializeDefaultTags,
} from '../db/firestoreRepository'
import type { Tag } from '../types'

export function useFirestoreTags(userId: string | undefined) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!userId) {
      setTags([])
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = subscribeTags(userId, async (tags) => {
      // Initialize default tags if empty (first time user)
      if (tags.length === 0 && !initialized) {
        setInitialized(true)
        await initializeDefaultTags(userId)
        return // Will be called again with new tags
      }

      setTags(tags)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId, initialized])

  const addTag = useCallback(
    async (tag: { name: string; color: string }) => {
      if (!userId) throw new Error('ログインが必要です')
      return await createTag(userId, tag)
    },
    [userId]
  )

  const editTag = useCallback(
    async (tagId: string, data: Partial<Tag>) => {
      if (!userId) throw new Error('ログインが必要です')
      await updateTag(userId, tagId, data)
    },
    [userId]
  )

  const removeTag = useCallback(
    async (tagId: string) => {
      if (!userId) throw new Error('ログインが必要です')
      await deleteTag(userId, tagId)
    },
    [userId]
  )

  return {
    tags,
    loading,
    addTag,
    updateTag: editTag,
    deleteTag: removeTag,
  }
}
