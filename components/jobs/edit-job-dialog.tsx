'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit } from 'lucide-react'
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
import { updateJob } from '@/actions/jobs'
import { type JobFormData } from '@/lib/validations/jobs'
import { toast } from 'sonner'

export function EditJobDialog({
  job,
}: {
  job: {
    id: string
    title: string
    department: string
    location: string
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | string
    status: 'Open' | 'Closed' | string
    description: string
  }
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleUpdate = async (data: JobFormData) => {
    try {
      const res = await updateJob(job.id, data)
      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('Job requisition updated successfully')
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update job')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <Edit className="h-4 w-4" />
        <span>Edit Job</span>
      </DialogTrigger>
      <DialogContent className="max-w-2xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Requisition</DialogTitle>
          <DialogDescription>
            Modify details for {job.title}. Changes will be saved across the platform immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <JobForm
            mode="edit"
            defaultValues={{
              title: job.title,
              department: job.department,
              location: job.location,
              type: job.type as any,
              status: job.status as any,
              description: job.description,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
