'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  STAGES,
  REJECTION_REASONS,
  type StageChangeData,
} from '@/lib/validations/candidates'
import { canTransition } from '@/lib/stage-transitions'
import { changeStage } from '@/actions/candidates'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { StageBadge } from '@/components/shared/stage-badge'

interface StageChangeDialogProps {
  candidateId: string
  candidateName: string
  currentStage: string
  triggerButton?: React.ReactNode
}

export function StageChangeDialog({
  candidateId,
  candidateName,
  currentStage,
  triggerButton,
}: StageChangeDialogProps) {
  const [open, setOpen] = useState(false)
  const [toStage, setToStage] = useState<string>(
    STAGES.find((s) => s !== currentStage && canTransition(currentStage, s).allowed) || ''
  )
  const [rejectionReason, setRejectionReason] = useState<string>(REJECTION_REASONS[0])
  const [note, setNote] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const transitionCheck = toStage ? canTransition(currentStage, toStage) : null

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      // Pick first allowed target stage
      const firstAllowed = STAGES.find(
        (s) => s !== currentStage && canTransition(currentStage, s).allowed
      )
      setToStage(firstAllowed || '')
      setRejectionReason(REJECTION_REASONS[0])
      setNote('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!toStage) {
      toast.error('Please select a target stage.')
      return
    }

    if (!transitionCheck?.allowed) {
      toast.error(transitionCheck?.message || 'Transition not allowed')
      return
    }

    if (toStage === 'Rejected' && !rejectionReason) {
      toast.error('Please select a rejection reason.')
      return
    }

    try {
      setIsSubmitting(true)
      const payload: StageChangeData = {
        candidateId,
        toStage: toStage as any,
        note: note.trim() || undefined,
        rejectionReason: toStage === 'Rejected' ? rejectionReason : undefined,
      }

      const res = await changeStage(payload)
      if (!res.success) {
        toast.error(res.error)
        setIsSubmitting(false)
        return
      }

      toast.success(`Candidate moved to ${toStage}`)
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update candidate stage')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {triggerButton ? (
        <DialogTrigger render={triggerButton as any} />
      ) : (
        <DialogTrigger render={<Button size="sm" className="gap-1.5" />}>
          <ArrowRight className="h-4 w-4" />
          <span>Change Stage</span>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Pipeline Stage</DialogTitle>
            <DialogDescription>
              Transition <strong className="text-foreground">{candidateName}</strong> to a new stage in the recruitment process.
            </DialogDescription>
          </DialogHeader>

          {/* Current Stage Indicator */}
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs">
            <span className="text-muted-foreground font-medium">Current Stage:</span>
            <StageBadge stage={currentStage} size="sm" />
          </div>

          {/* Select New Stage */}
          <div className="space-y-2">
            <Label htmlFor="toStage" className="text-sm font-medium">
              Target Stage <span className="text-destructive">*</span>
            </Label>
            <select
              id="toStage"
              value={toStage}
              onChange={(e) => setToStage(e.target.value)}
              disabled={isSubmitting}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
            >
              {STAGES.map((stg) => {
                const check = canTransition(currentStage, stg)
                return (
                  <option
                    key={stg}
                    value={stg}
                    disabled={!check.allowed}
                    className="bg-popover text-popover-foreground"
                  >
                    {stg} {stg === currentStage ? '(Current)' : !check.allowed ? '(Not Allowed)' : ''}
                  </option>
                )
              })}
            </select>
          </div>

          {/* Warning banner if confirmation required */}
          {transitionCheck?.requiresConfirmation && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <span>{transitionCheck.message}</span>
            </div>
          )}

          {/* Rejection Reason (Required if Rejected) */}
          {toStage === 'Rejected' && (
            <div className="space-y-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3.5">
              <Label htmlFor="rejectionReason" className="text-xs font-semibold text-destructive">
                Rejection Reason <span className="text-destructive">*</span>
              </Label>
              <select
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                disabled={isSubmitting}
                className="h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                {REJECTION_REASONS.map((reason) => (
                  <option key={reason} value={reason} className="bg-popover text-popover-foreground">
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Stage Change Note */}
          <div className="space-y-2">
            <Label htmlFor="stageNote" className="text-sm font-medium">
              Transition Note <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="stageNote"
              rows={3}
              placeholder="e.g. Passed initial technical screening with high scores..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !transitionCheck?.allowed}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Confirm Transition'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
