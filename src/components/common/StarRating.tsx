import { Star } from 'lucide-react'

interface StarRatingProps {
  value: 1 | 2 | 3 | 4 | 5
  onChange?: (value: 1 | 2 | 3 | 4 | 5) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const starSize = sizeMap[size]

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating as 1 | 2 | 3 | 4 | 5)
    }
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={`
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            transition-transform
          `}
        >
          <Star
            size={starSize}
            className={
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }
          />
        </button>
      ))}
    </div>
  )
}
