'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
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
import { deleteJob } from '@/actions/jobs'
import { toast } from 'sonner'

export function DeleteJobDialog({
  jobId,
  jobTitle,
  candidateCount = 0,
}: {
  jobId: string
  jobTitle: string
  candidateCount?: number
}) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await deleteJob(jobId)

      if (!res.success) {
        toast.error(res.error)
        setIsDeleting(false)
        return
      }

      toast.success('Job requisition deleted successfully')
      setOpen(false)
      router.push('/jobs')
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete job')
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" className="gap-1.5" />}>
        <Trash2 className="h-4 w-4" />
        <span>Delete Job</span>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>Delete Job Requisition?</DialogTitle>
          <DialogDescription className="space-y-2 text-sm">
            <span>
              Are you sure you want to delete <strong className="text-foreground">{jobTitle}</strong>?
            </span>
            <span className="block text-muted-foreground">
              This action cannot be undone. Jobs with active candidates in Applied, Screening, Interview, Technical Round, or Offer stages cannot be deleted until those candidates are resolved.
            </span>
            {candidateCount > 0 && (
              <span className="block font-medium text-amber-600 dark:text-amber-400">
                Notice: There are currently {candidateCount} candidate(s) attached to this requisition.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
