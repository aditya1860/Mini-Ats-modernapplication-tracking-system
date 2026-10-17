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
import { deleteCandidate } from '@/actions/candidates'
import { toast } from 'sonner'

export function DeleteCandidateDialog({
  candidateId,
  candidateName,
  triggerButton,
  redirectTo = '/candidates',
}: {
  candidateId: string
  candidateName: string
  triggerButton?: React.ReactNode
  redirectTo?: string
}) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await deleteCandidate(candidateId)

      if (!res.success) {
        toast.error(res.error)
        setIsDeleting(false)
        return
      }

      toast.success('Candidate deleted successfully')
      setOpen(false)
      if (redirectTo) {
        router.push(redirectTo)
      }
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete candidate')
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton ? (
        <DialogTrigger render={triggerButton as any} />
      ) : (
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="xs"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            />
          }
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>Delete Candidate Profile?</DialogTitle>
          <DialogDescription className="space-y-2 text-sm text-muted-foreground">
            <span>
              Are you sure you want to permanently remove <strong className="text-foreground">{candidateName}</strong>?
            </span>
            <span className="block">
              This will remove all associated interview notes and stage transition logs. This action cannot be reversed.
            </span>
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
