import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Song, Tag, CreateSongInput, UpdateSongInput } from '../types'

// Songs Collection
export const songsCollection = (userId: string) =>
  collection(db, 'users', userId, 'songs')

export const tagsCollection = (userId: string) =>
  collection(db, 'users', userId, 'tags')

// Subscribe to songs with real-time updates
export function subscribeSongs(
  userId: string,
  callback: (songs: Song[]) => void
): Unsubscribe {
  const q = query(
    songsCollection(userId),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const songs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Song[]
    callback(songs)
  })
}

// Subscribe to tags with real-time updates
export function subscribeTags(
  userId: string,
  callback: (tags: Tag[]) => void
): Unsubscribe {
  const q = query(tagsCollection(userId), orderBy('name'))

  return onSnapshot(q, (snapshot) => {
    const tags = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Tag[]
    callback(tags)
  })
}

// Song CRUD operations
export async function createSong(
  userId: string,
  input: CreateSongInput
): Promise<Song> {
  const docRef = await addDoc(songsCollection(userId), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    ...input,
    id: docRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function updateSong(
  userId: string,
  songId: string,
  input: UpdateSongInput
): Promise<void> {
  const docRef = doc(songsCollection(userId), songId)
  await updateDoc(docRef, {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteSong(
  userId: string,
  songId: string,
  _scorePhotoId?: string | null
): Promise<void> {
  // Base64形式なのでStorage削除は不要
  const docRef = doc(songsCollection(userId), songId)
  await deleteDoc(docRef)
}

// Tag CRUD operations
export async function createTag(
  userId: string,
  tag: { name: string; color: string }
): Promise<Tag> {
  const docRef = await addDoc(tagsCollection(userId), tag)
  return { ...tag, id: docRef.id, createdAt: new Date() }
}

export async function updateTag(
  userId: string,
  tagId: string,
  data: Partial<Tag>
): Promise<void> {
  const docRef = doc(tagsCollection(userId), tagId)
  await updateDoc(docRef, data)
}

export async function deleteTag(userId: string, tagId: string): Promise<void> {
  const docRef = doc(tagsCollection(userId), tagId)
  await deleteDoc(docRef)
}

// Photo operations - Base64保存（Firebase Storage不使用）
export async function uploadPhoto(
  userId: string,
  songId: string,
  blob: Blob
): Promise<string> {
  // BlobをBase64に変換
  const base64 = await blobToBase64(blob)

  // Update song with base64 photo
  await updateSong(userId, songId, { scorePhotoId: base64 })

  return base64
}

export async function deletePhoto(
  userId: string,
  songId: string,
  _photoData: string
): Promise<void> {
  await updateSong(userId, songId, { scorePhotoId: null })
}

// Helper: Blob to Base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Initialize default tags for new user
export async function initializeDefaultTags(userId: string): Promise<void> {
  const defaultTags = [
    { name: '盛り上がる', color: '#EF4444' },
    { name: 'バラード', color: '#3B82F6' },
    { name: 'デュエット', color: '#EC4899' },
    { name: 'アニソン', color: '#8B5CF6' },
    { name: '定番', color: '#F59E0B' },
    { name: '練習中', color: '#10B981' },
  ]

  for (const tag of defaultTags) {
    await addDoc(tagsCollection(userId), tag)
  }
}
