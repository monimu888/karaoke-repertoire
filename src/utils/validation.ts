import { z } from 'zod'

export const songSchema = z.object({
  title: z.string().min(1, '曲名を入力してください'),
  artist: z.string().min(1, 'アーティスト名を入力してください'),
  tags: z.array(z.string()),
  proficiency: z.number().min(1).max(5),
  key: z.object({
    original: z.string(),
    adjustment: z.number().min(-6).max(6),
  }),
  highScore: z.number().min(0).max(100).nullable(),
  scorePhotoId: z.string().nullable(),
  memo: z.string(),
})

export type SongFormData = z.infer<typeof songSchema>

export const defaultSongValues: SongFormData = {
  title: '',
  artist: '',
  tags: [],
  proficiency: 3,
  key: {
    original: '',
    adjustment: 0,
  },
  highScore: null,
  scorePhotoId: null,
  memo: '',
}
