import Dexie, { type Table } from 'dexie'
import type { Song } from '../types/song'
import type { Tag } from '../types/tag'

export interface Photo {
  id: string
  blob: Blob
  createdAt: Date
}

export class KaraokeDatabase extends Dexie {
  songs!: Table<Song>
  tags!: Table<Tag>
  photos!: Table<Photo>

  constructor() {
    super('karaoke-repertoire')

    this.version(1).stores({
      songs: 'id, title, artist, *tags, proficiency, highScore, createdAt',
      tags: 'id, name',
      photos: 'id'
    })
  }
}

export const db = new KaraokeDatabase()
