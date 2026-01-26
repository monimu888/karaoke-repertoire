import { useState, useEffect, useCallback } from 'react'
import { resizeImage, createObjectURL, revokeObjectURL } from '../utils/imageUtils'
import { songRepository } from '../db/songRepository'

interface UseImageUploadOptions {
  songId?: string
  existingPhotoId?: string | null
}

export function useImageUpload({ songId, existingPhotoId }: UseImageUploadOptions = {}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existingPhotoId) {
      loadExistingPhoto(existingPhotoId)
    }
    return () => {
      if (previewUrl) {
        revokeObjectURL(previewUrl)
      }
    }
  }, [existingPhotoId])

  const loadExistingPhoto = async (photoId: string) => {
    try {
      setLoading(true)
      const blob = await songRepository.getPhoto(photoId)
      if (blob) {
        setPreviewUrl(createObjectURL(blob))
      }
    } catch (err) {
      setError('写真の読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const selectImage = useCallback(async (file: File) => {
    try {
      setLoading(true)
      setError(null)

      if (!file.type.startsWith('image/')) {
        throw new Error('画像ファイルを選択してください')
      }

      const resizedBlob = await resizeImage(file)
      setPendingBlob(resizedBlob)

      if (previewUrl) {
        revokeObjectURL(previewUrl)
      }
      setPreviewUrl(createObjectURL(resizedBlob))
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の処理に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [previewUrl])

  const savePhoto = useCallback(async () => {
    if (!songId || !pendingBlob) return null

    try {
      setLoading(true)
      const photoId = await songRepository.savePhoto(songId, pendingBlob)
      setPendingBlob(null)
      return photoId
    } catch (err) {
      setError('写真の保存に失敗しました')
      return null
    } finally {
      setLoading(false)
    }
  }, [songId, pendingBlob])

  const deletePhoto = useCallback(async () => {
    if (!songId) return

    try {
      setLoading(true)
      await songRepository.deletePhoto(songId)
      if (previewUrl) {
        revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      setPendingBlob(null)
    } catch (err) {
      setError('写真の削除に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [songId, previewUrl])

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setPendingBlob(null)
  }, [previewUrl])

  return {
    previewUrl,
    pendingBlob,
    loading,
    error,
    selectImage,
    savePhoto,
    deletePhoto,
    clearPreview,
    hasPendingChanges: pendingBlob !== null,
  }
}
