import { TagBadge } from '../common'
import type { Tag } from '../../types'

interface TagFilterProps {
  tags: Tag[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function TagFilter({ tags, selectedIds, onChange }: TagFilterProps) {
  const toggleTag = (tagId: string) => {
    if (selectedIds.includes(tagId)) {
      onChange(selectedIds.filter((id) => id !== tagId))
    } else {
      onChange([...selectedIds, tagId])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagBadge
          key={tag.id}
          name={tag.name}
          color={tag.color}
          selected={selectedIds.includes(tag.id)}
          onClick={() => toggleTag(tag.id)}
        />
      ))}
    </div>
  )
}
