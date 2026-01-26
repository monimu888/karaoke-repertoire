export interface KeySetting {
  original: string
  adjustment: number
}

export interface Song {
  id: string
  title: string
  artist: string
  tags: string[]
  proficiency: 1 | 2 | 3 | 4 | 5
  key: KeySetting
  highScore: number | null
  scorePhotoId: string | null
  memo: string
  createdAt: Date
  updatedAt: Date
}

export type CreateSongInput = Omit<Song, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateSongInput = Partial<CreateSongInput>
