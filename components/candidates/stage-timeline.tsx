import * as React from 'react'
import { StageBadge } from '@/components/shared/stage-badge'
import { ArrowRight, Clock, User, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface StageHistoryItem {
  id: string
  fromStage: string
  toStage: string
  changedAt: Date | string
  note?: string | null
  rejectionReason?: string | null
  changedBy?: {
    id: string
    name: string
    email: string
  } | null
}

export function StageTimeline({
  history,
}: {
  history: StageHistoryItem[]
}) {
  if (history.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        No stage history recorded yet.
      </div>
    )
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-[2px] before:bg-border">
      {history.map((item, index) => {
        const isLatest = index === 0

        return (
          <div key={item.id} className="relative flex flex-col gap-1.5 text-xs">
            {/* Timeline bullet */}
            <div
              className={`absolute -left-[19px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-background ${
                isLatest
                  ? 'border-primary ring-4 ring-primary/10'
                  : 'border-muted-foreground/40'
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  isLatest ? 'bg-primary' : 'bg-muted-foreground/60'
                }`}
              />
            </div>

            {/* Stages Row */}
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              {item.fromStage !== 'None' ? (
                <>
                  <StageBadge stage={item.fromStage} size="sm" />
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <StageBadge stage={item.toStage} size="sm" />
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">Initial Stage:</span>
                  <StageBadge stage={item.toStage} size="sm" />
                </div>
              )}

              {/* Timestamp */}
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground ml-auto">
                <Clock className="h-3 w-3" />
                {format(new Date(item.changedAt), 'MMM d, yyyy · h:mm a')}
              </span>
            </div>

            {/* Who changed */}
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <User className="h-3 w-3" />
              <span>
                Updated by{' '}
                <strong className="font-medium text-foreground">
                  {item.changedBy?.name || 'Recruiter'}
                </strong>
              </span>
            </div>

            {/* Rejection Reason if present */}
            {item.rejectionReason && (
              <div className="flex items-center gap-1.5 rounded-md border border-destructive/20 bg-destructive/5 px-2.5 py-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  <strong>Reason:</strong> {item.rejectionReason}
                </span>
              </div>
            )}

            {/* Note text if present */}
            {item.note && (
              <div className="rounded-md border border-border/60 bg-muted/30 p-2.5 text-xs text-foreground/90 whitespace-pre-line leading-relaxed">
                {item.note}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
