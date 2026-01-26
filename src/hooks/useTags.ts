import { useState, useEffect, useCallback } from 'react'
import { tagRepository } from '../db/tagRepository'
import type { Tag, CreateTagInput } from '../types'

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      await tagRepository.initializePresets()
      const data = await tagRepository.findAll()
      setTags(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tags'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTag = useCallback(async (input: CreateTagInput) => {
    const newTag = await tagRepository.create(input)
    setTags((prev) => [...prev, newTag])
    return newTag
  }, [])

  const updateTag = useCallback(async (id: string, input: Partial<CreateTagInput>) => {
    const updated = await tagRepository.update(id, input)
    if (updated) {
      setTags((prev) => prev.map((t) => (t.id === id ? updated : t)))
    }
    return updated
  }, [])

  const deleteTag = useCallback(async (id: string) => {
    await tagRepository.delete(id)
    setTags((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const isTagUsed = useCallback(async (id: string) => {
    return tagRepository.isUsed(id)
  }, [])

  return {
    tags,
    loading,
    error,
    refresh,
    addTag,
    updateTag,
    deleteTag,
    isTagUsed,
  }
}
