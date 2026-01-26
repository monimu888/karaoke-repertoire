import { v4 as uuidv4 } from 'uuid'
import { db } from './database'
import type { Song, CreateSongInput, UpdateSongInput } from '../types/song'

export const songRepository = {
  async findAll(): Promise<Song[]> {
    return db.songs.orderBy('updatedAt').reverse().toArray()
  },

  async findById(id: string): Promise<Song | undefined> {
    return db.songs.get(id)
  },

  async findByTags(tagIds: string[]): Promise<Song[]> {
    if (tagIds.length === 0) {
      return this.findAll()
    }
    return db.songs
      .filter((song) => tagIds.some((tagId) => song.tags.includes(tagId)))
      .toArray()
  },

  async search(query: string): Promise<Song[]> {
    const lowerQuery = query.toLowerCase()
    return db.songs
      .filter(
        (song) =>
          song.title.toLowerCase().includes(lowerQuery) ||
          song.artist.toLowerCase().includes(lowerQuery)
      )
      .toArray()
  },

  async create(input: CreateSongInput): Promise<Song> {
    const now = new Date()
    const song: Song = {
      ...input,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    }
    await db.songs.add(song)
    return song
  },

  async update(id: string, input: UpdateSongInput): Promise<Song | undefined> {
    const existing = await this.findById(id)
    if (!existing) {
      return undefined
    }
    const updated: Song = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    }
    await db.songs.put(updated)
    return updated
  },

  async delete(id: string): Promise<void> {
    const song = await this.findById(id)
    if (song?.scorePhotoId) {
      await db.photos.delete(song.scorePhotoId)
    }
    await db.songs.delete(id)
  },

  async savePhoto(songId: string, blob: Blob): Promise<string> {
    const photoId = uuidv4()
    await db.photos.add({ id: photoId, blob, createdAt: new Date() })
    await this.update(songId, { scorePhotoId: photoId })
    return photoId
  },

  async getPhoto(photoId: string): Promise<Blob | undefined> {
    const photo = await db.photos.get(photoId)
    return photo?.blob
  },

  async deletePhoto(songId: string): Promise<void> {
    const song = await this.findById(songId)
    if (song?.scorePhotoId) {
      await db.photos.delete(song.scorePhotoId)
      await this.update(songId, { scorePhotoId: null })
    }
  },
}
