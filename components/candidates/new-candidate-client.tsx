'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createCandidate } from '@/actions/candidates'
import { CandidateForm } from '@/components/candidates/candidate-form'
import { type CandidateFormData } from '@/lib/validations/candidates'
import { toast } from 'sonner'

export function NewCandidateClient({
  jobs,
  initialJobId,
}: {
  jobs: { id: string; title: string; department: string }[]
  initialJobId?: string
}) {
  const router = useRouter()

  const handleSubmit = async (data: CandidateFormData) => {
    try {
      const res = await createCandidate(data)
      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('Candidate profile created successfully!')
      router.push(`/candidates/${res.data.id}`)
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create candidate')
    }
  }

  return (
    <CandidateForm
      mode="create"
      jobs={jobs}
      defaultValues={{
        jobId: initialJobId || '',
        stage: 'Applied',
      }}
      onSubmit={handleSubmit}
      cancelHref={initialJobId ? `/jobs/${initialJobId}` : '/candidates'}
    />
  )
}
