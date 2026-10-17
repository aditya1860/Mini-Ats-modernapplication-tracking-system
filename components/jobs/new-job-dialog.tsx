'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { JobForm } from '@/components/jobs/job-form'
import { createJob } from '@/actions/jobs'
import { type JobFormData } from '@/lib/validations/jobs'
import { toast } from 'sonner'

export function NewJobDialog({
  triggerButton,
}: {
  triggerButton?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleCreate = async (data: JobFormData) => {
    try {
      const res = await createJob(data)
      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('Job requisition created successfully')
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create job')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton ? (
        <DialogTrigger render={triggerButton as any} />
      ) : (
        <DialogTrigger render={<Button className="gap-2" />}>
          <Plus className="h-4 w-4" />
          <span>New Job</span>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Requisition</DialogTitle>
          <DialogDescription>
            Fill in the details below to open a new position for your recruitment pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <JobForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
