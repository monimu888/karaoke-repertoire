import { ArrowUpDown } from 'lucide-react'

type SortKey = 'updatedAt' | 'title' | 'artist' | 'proficiency' | 'highScore'
type SortOrder = 'asc' | 'desc'

interface SortSelectProps {
  sortKey: SortKey
  sortOrder: SortOrder
  onSortKeyChange: (key: SortKey) => void
  onSortOrderChange: (order: SortOrder) => void
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'updatedAt', label: '更新日' },
  { value: 'title', label: '曲名' },
  { value: 'artist', label: 'アーティスト' },
  { value: 'proficiency', label: '得意度' },
  { value: 'highScore', label: '最高得点' },
]

export function SortSelect({
  sortKey,
  sortOrder,
  onSortKeyChange,
  onSortOrderChange,
}: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={sortKey}
        onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100"
        title={sortOrder === 'asc' ? '昇順' : '降順'}
      >
        <ArrowUpDown
          size={18}
          className={sortOrder === 'desc' ? 'rotate-180' : ''}
        />
      </button>
    </div>
  )
}
