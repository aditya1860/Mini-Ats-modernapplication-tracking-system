'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquarePlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { addInterviewNote } from '@/actions/candidates'
import { toast } from 'sonner'

interface AddInterviewNoteDialogProps {
  candidateId: string
  candidateName: string
  defaultInterviewer?: string
  triggerButton?: React.ReactNode
}

export function AddInterviewNoteDialog({
  candidateId,
  candidateName,
  defaultInterviewer = '',
  triggerButton,
}: AddInterviewNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [interviewer, setInterviewer] = useState(defaultInterviewer)
  const [scheduledAt, setScheduledAt] = useState('')
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) {
      toast.error('Please enter interview feedback notes')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await addInterviewNote(candidateId, {
        interviewer: interviewer.trim() || undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        note: note.trim(),
      })

      if (!res.success) {
        toast.error(res.error)
        setIsSubmitting(false)
        return
      }

      toast.success('Interview note recorded successfully')
      setOpen(false)
      setNote('')
      setScheduledAt('')
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save interview note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton ? (
        <DialogTrigger render={triggerButton as any} />
      ) : (
        <DialogTrigger render={<Button size="sm" variant="outline" className="gap-1.5" />}>
          <MessageSquarePlus className="h-4 w-4" />
          <span>Add Interview Note</span>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Interview Feedback</DialogTitle>
            <DialogDescription>
              Record impressions, scorecards, or debrief notes for <strong className="text-foreground">{candidateName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="interviewer" className="text-sm font-medium">
                Interviewer Name
              </Label>
              <Input
                id="interviewer"
                placeholder="e.g. Sarah Jenkins (Tech Lead)"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledAt" className="text-sm font-medium">
                Interview Date/Time <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedbackNote" className="text-sm font-medium">
              Interview Notes & Evaluation <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="feedbackNote"
              rows={5}
              placeholder="Detail candidate technical strengths, system design approach, communication skills, red flags, or recommendation..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isSubmitting}
              required
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Note'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
