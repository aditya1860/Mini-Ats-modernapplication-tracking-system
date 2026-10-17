'use client'

import * as React from 'react'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from 'cn'

interface StarRatingProps {
  value?: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 'default',
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const activeRating = hoverValue !== null ? hoverValue : value

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      onMouseLeave={() => {
        if (!readOnly) setHoverValue(null)
      }}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? `Rating: ${value} of 5 stars` : 'Rate 1 to 5 stars'}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= activeRating

        if (readOnly) {
          return (
            <Star
              key={star}
              className={cn(
                iconSizes[size],
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-muted/30 text-muted-foreground/30'
              )}
            />
          )
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => {
              // Click the current value to reset to 0, or set to star value
              const newValue = star === value ? 0 : star
              onChange?.(newValue)
            }}
            onMouseEnter={() => setHoverValue(star)}
            className="rounded-xs p-0.5 text-muted-foreground/40 transition-colors hover:text-amber-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                iconSizes[size],
                'transition-transform duration-100 hover:scale-110',
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-muted/20 text-muted-foreground/40'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
