'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { updateCandidate } from '@/actions/candidates'
import { CandidateForm } from '@/components/candidates/candidate-form'
import { type CandidateFormData } from '@/lib/validations/candidates'
import { toast } from 'sonner'

export function EditCandidateClient({
  candidate,
  jobs,
}: {
  candidate: any
  jobs: { id: string; title: string; department: string }[]
}) {
  const router = useRouter()

  const handleSubmit = async (data: CandidateFormData) => {
    try {
      const res = await updateCandidate(candidate.id, data)
      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('Candidate profile updated successfully!')
      router.push(`/candidates/${candidate.id}`)
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update candidate')
    }
  }

  return (
    <CandidateForm
      mode="edit"
      jobs={jobs}
      defaultValues={{
        fullName: candidate.fullName,
        email: candidate.email,
        phone: candidate.phone || '',
        currentRole: candidate.currentRole || '',
        currentCompany: candidate.currentCompany || '',
        experienceYears: candidate.experienceYears ?? 0,
        skills: candidate.skills || [],
        source: candidate.source || 'Other',
        expectedSalary: candidate.expectedSalary || undefined,
        location: candidate.location || '',
        resumeUrl: candidate.resumeUrl || '',
        notes: candidate.notes || '',
        jobId: candidate.jobId || '',
        stage: candidate.stage || 'Applied',
        rating: candidate.rating || 0,
      }}
      onSubmit={handleSubmit}
      cancelHref={`/candidates/${candidate.id}`}
    />
  )
}
