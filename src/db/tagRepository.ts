import { v4 as uuidv4 } from 'uuid'
import { db } from './database'
import type { Tag, CreateTagInput } from '../types/tag'
import { PRESET_TAGS } from '../types/tag'

export const tagRepository = {
  async findAll(): Promise<Tag[]> {
    return db.tags.orderBy('createdAt').toArray()
  },

  async findById(id: string): Promise<Tag | undefined> {
    return db.tags.get(id)
  },

  async create(input: CreateTagInput): Promise<Tag> {
    const tag: Tag = {
      ...input,
      id: uuidv4(),
      createdAt: new Date(),
    }
    await db.tags.add(tag)
    return tag
  },

  async update(id: string, input: Partial<CreateTagInput>): Promise<Tag | undefined> {
    const existing = await this.findById(id)
    if (!existing) {
      return undefined
    }
    const updated: Tag = {
      ...existing,
      ...input,
    }
    await db.tags.put(updated)
    return updated
  },

  async delete(id: string): Promise<void> {
    await db.tags.delete(id)
    const songsWithTag = await db.songs.filter((song) => song.tags.includes(id)).toArray()
    for (const song of songsWithTag) {
      await db.songs.update(song.id, {
        tags: song.tags.filter((tagId) => tagId !== id),
      })
    }
  },

  async isUsed(id: string): Promise<boolean> {
    const count = await db.songs.filter((song) => song.tags.includes(id)).count()
    return count > 0
  },

  async initializePresets(): Promise<void> {
    const existingTags = await this.findAll()
    if (existingTags.length === 0) {
      for (const preset of PRESET_TAGS) {
        await this.create(preset)
      }
    }
  },
}
