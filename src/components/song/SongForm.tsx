import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, StarRating, TagBadge } from '../common'
import { songSchema, type SongFormData, defaultSongValues } from '../../utils/validation'
import type { Tag } from '../../types'

interface SongFormProps {
  defaultValues?: Partial<SongFormData>
  tags: Tag[]
  onSubmit: (data: SongFormData) => void | Promise<void>
  onCancel: () => void
  submitLabel?: string
}

const keyOptions = [
  { value: -6, label: '-6' },
  { value: -5, label: '-5' },
  { value: -4, label: '-4' },
  { value: -3, label: '-3' },
  { value: -2, label: '-2' },
  { value: -1, label: '-1' },
  { value: 0, label: '±0' },
  { value: 1, label: '+1' },
  { value: 2, label: '+2' },
  { value: 3, label: '+3' },
  { value: 4, label: '+4' },
  { value: 5, label: '+5' },
  { value: 6, label: '+6' },
]

export function SongForm({
  defaultValues,
  tags,
  onSubmit,
  onCancel,
  submitLabel = '保存',
}: SongFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: { ...defaultSongValues, ...defaultValues },
  })

  const selectedTags = watch('tags')

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setValue('tags', selectedTags.filter((id) => id !== tagId))
    } else {
      setValue('tags', [...selectedTags, tagId])
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="曲名"
        placeholder="例: 残酷な天使のテーゼ"
        error={errors.title?.message}
        {...register('title')}
      />

      <Input
        label="アーティスト"
        placeholder="例: 高橋洋子"
        error={errors.artist?.message}
        {...register('artist')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タグ
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              color={tag.color}
              selected={selectedTags.includes(tag.id)}
              onClick={() => toggleTag(tag.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          得意度
        </label>
        <Controller
          name="proficiency"
          control={control}
          render={({ field }) => (
            <StarRating
              value={field.value as 1 | 2 | 3 | 4 | 5}
              onChange={field.onChange}
              size="lg"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          キー調整
        </label>
        <Controller
          name="key.adjustment"
          control={control}
          render={({ field }) => (
            <select
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {keyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          最高得点
        </label>
        <Controller
          name="highScore"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              min="0"
              max="100"
              step="0.001"
              placeholder="例: 85.5"
              value={field.value ?? ''}
              onChange={(e) => {
                const val = e.target.value
                field.onChange(val === '' ? null : Number(val))
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メモ
        </label>
        <textarea
          rows={3}
          placeholder="サビの高音に注意、など"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          {...register('memo')}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? '保存中...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
