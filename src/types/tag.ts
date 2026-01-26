export interface Tag {
  id: string
  name: string
  color: string
  createdAt: Date
}

export type CreateTagInput = Omit<Tag, 'id' | 'createdAt'>

export const PRESET_TAGS: CreateTagInput[] = [
  { name: '盛り上がる', color: '#EF4444' },
  { name: 'バラード', color: '#3B82F6' },
  { name: 'アニソン', color: '#8B5CF6' },
  { name: 'J-POP', color: '#10B981' },
  { name: '洋楽', color: '#F59E0B' },
  { name: 'デュエット', color: '#EC4899' },
  { name: '懐メロ', color: '#6366F1' },
  { name: 'ボカロ', color: '#06B6D4' },
]
