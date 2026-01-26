import { X } from 'lucide-react'

interface TagBadgeProps {
  name: string
  color: string
  onRemove?: () => void
  onClick?: () => void
  selected?: boolean
}

export function TagBadge({
  name,
  color,
  onRemove,
  onClick,
  selected = false,
}: TagBadgeProps) {
  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${selected ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
        borderWidth: 1,
      }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="hover:bg-black/10 rounded-full p-0.5"
        >
          <X size={14} />
        </button>
      )}
    </span>
  )
}
