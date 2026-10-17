'use client'

import * as React from 'react'
import { useState, useRef, KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from 'cn'

interface SkillsInputProps {
  value?: string[]
  onChange?: (skills: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SkillsInput({
  value = [],
  onChange,
  placeholder = 'Add a skill and press Enter or comma...',
  disabled = false,
  className,
}: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (text: string) => {
    const trimmed = text.trim().replace(/^,+|,+$/g, '')
    if (!trimmed) return

    // Prevent duplicate entries
    const exists = value.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
    )

    if (!exists) {
      onChange?.([...value, trimmed])
    }
    setInputValue('')
  }

  const removeTag = (indexToRemove: number) => {
    onChange?.(value.filter((_, idx) => idx !== indexToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      e.preventDefault()
      removeTag(value.length - 1)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent p-1.5 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30',
        disabled && 'cursor-not-allowed opacity-50 bg-input/50',
        className
      )}
    >
      {value.map((skill, index) => (
        <span
          key={`${skill}-${index}`}
          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          <span>{skill}</span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(index)
              }}
              className="text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={`Remove skill ${skill}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        disabled={disabled}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) {
            addTag(inputValue)
          }
        }}
        placeholder={value.length === 0 ? placeholder : 'Add more...'}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  )
}
