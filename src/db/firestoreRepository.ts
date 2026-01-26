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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from '../lib/firebase'
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
  scorePhotoId?: string | null
): Promise<void> {
  // Delete photo if exists
  if (scorePhotoId) {
    try {
      const photoRef = ref(storage, `users/${userId}/photos/${scorePhotoId}`)
      await deleteObject(photoRef)
    } catch {
      // Photo might not exist, continue
    }
  }

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

// Photo operations
export async function uploadPhoto(
  userId: string,
  songId: string,
  blob: Blob
): Promise<string> {
  const photoId = `${songId}_${Date.now()}`
  const photoRef = ref(storage, `users/${userId}/photos/${photoId}`)

  await uploadBytes(photoRef, blob)
  const downloadUrl = await getDownloadURL(photoRef)

  // Update song with photo URL
  await updateSong(userId, songId, { scorePhotoId: downloadUrl })

  return downloadUrl
}

export async function deletePhoto(
  userId: string,
  songId: string,
  photoUrl: string
): Promise<void> {
  try {
    // Extract path from URL and delete
    const photoRef = ref(storage, photoUrl)
    await deleteObject(photoRef)
  } catch {
    // Photo might not exist
  }

  await updateSong(userId, songId, { scorePhotoId: null })
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
