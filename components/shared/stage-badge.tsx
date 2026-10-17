import * as React from 'react'
import { cn } from 'cn'

export type StageName =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical Round'
  | 'Offer'
  | 'Hired'
  | 'Rejected'

export const stageStyles: Record<string, string> = {
  Applied:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  Screening:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  Interview:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  'Technical Round':
    'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
  Offer:
    'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
  Hired:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  Rejected:
    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
}

export function StageBadge({
  stage,
  className,
  size = 'default',
}: {
  stage: string
  className?: string
  size?: 'sm' | 'default' | 'lg'
}) {
  const style = stageStyles[stage] || 'bg-muted text-muted-foreground border-border'
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    default: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3.5 py-1 font-semibold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap transition-colors',
        style,
        sizeClasses[size],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      <span>{stage}</span>
    </span>
  )
}
