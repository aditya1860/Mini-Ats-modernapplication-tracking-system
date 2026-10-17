import * as React from 'react'
import { cn } from 'cn'

export type SourceName = 'LinkedIn' | 'Referral' | 'Job Board' | 'Website' | 'Other'

export const sourceStyles: Record<string, string> = {
  LinkedIn:
    'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
  Referral:
    'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800',
  'Job Board':
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  Website:
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
  Other:
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
}

export function SourceBadge({
  source,
  className,
  size = 'default',
}: {
  source: string
  className?: string
  size?: 'sm' | 'default'
}) {
  const style = sourceStyles[source] || sourceStyles.Other
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    default: 'text-xs px-2.5 py-0.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-medium whitespace-nowrap transition-colors',
        style,
        sizeClasses[size],
        className
      )}
    >
      {source}
    </span>
  )
}
