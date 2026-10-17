'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { JobForm } from '@/components/jobs/job-form'
import { createJob } from '@/actions/jobs'
import { type JobFormData } from '@/lib/validations/jobs'
import { toast } from 'sonner'

export default function NewJobPage() {
  const router = useRouter()

  const handleSubmit = async (data: JobFormData) => {
    try {
      const res = await createJob(data)
      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('Job requisition created successfully!')
      router.push('/jobs')
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create job requisition')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top back button */}
      <div className="flex items-center gap-2">
        <Link href="/jobs">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Jobs</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">New Job Requisition</CardTitle>
          <CardDescription>
            Enter the details of the job opening to begin tracking applicants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm mode="create" onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}
