'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  candidateSchema,
  STAGES,
  SOURCES,
  type CandidateFormData,
} from '@/lib/validations/candidates'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SkillsInput } from '@/components/candidates/skills-input'
import { StarRating } from '@/components/shared/star-rating'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CandidateFormProps {
  defaultValues?: Partial<CandidateFormData>
  jobs: { id: string; title: string; department: string }[]
  onSubmit: (data: CandidateFormData) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit'
  cancelHref?: string
}

export function CandidateForm({
  defaultValues,
  jobs,
  onSubmit,
  isLoading = false,
  mode,
  cancelHref = '/candidates',
}: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema) as any,
    defaultValues: {
      fullName: defaultValues?.fullName ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      currentRole: defaultValues?.currentRole ?? '',
      currentCompany: defaultValues?.currentCompany ?? '',
      experienceYears: defaultValues?.experienceYears ?? 0,
      skills: defaultValues?.skills ?? [],
      source: defaultValues?.source ?? 'LinkedIn',
      expectedSalary: defaultValues?.expectedSalary ?? undefined,
      location: defaultValues?.location ?? '',
      resumeUrl: defaultValues?.resumeUrl ?? '',
      notes: defaultValues?.notes ?? '',
      jobId: defaultValues?.jobId ?? '',
      stage: defaultValues?.stage ?? 'Applied',
      rating: defaultValues?.rating ?? 0,
    },
  })

  const loading = isLoading || isSubmitting

  const handleFormSubmit = async (data: CandidateFormData) => {
    // Clean up empty optional strings to null or undefined
    const cleaned: CandidateFormData = {
      ...data,
      phone: data.phone?.trim() || undefined,
      currentRole: data.currentRole?.trim() || undefined,
      currentCompany: data.currentCompany?.trim() || undefined,
      location: data.location?.trim() || undefined,
      resumeUrl: data.resumeUrl?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      jobId: data.jobId ? data.jobId : undefined,
      expectedSalary: data.expectedSalary ? Number(data.expectedSalary) : undefined,
    }
    await onSubmit(cleaned)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Contact Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Personal & Contact Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              placeholder="e.g. Alexandra Vance"
              disabled={loading}
              aria-invalid={!!errors.fullName}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. alexandra@example.com"
              disabled={loading}
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="e.g. +1 (555) 234-5678"
              disabled={loading}
              {...register('phone')}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              placeholder="e.g. San Francisco, CA"
              disabled={loading}
              {...register('location')}
            />
          </div>
        </div>
      </div>

      {/* Professional Background */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Professional Background
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Current Role */}
          <div className="space-y-2">
            <Label htmlFor="currentRole" className="text-sm font-medium">
              Current Role
            </Label>
            <Input
              id="currentRole"
              placeholder="e.g. Senior Software Engineer"
              disabled={loading}
              {...register('currentRole')}
            />
          </div>

          {/* Current Company */}
          <div className="space-y-2">
            <Label htmlFor="currentCompany" className="text-sm font-medium">
              Current Company
            </Label>
            <Input
              id="currentCompany"
              placeholder="e.g. Acme Corp"
              disabled={loading}
              {...register('currentCompany')}
            />
          </div>

          {/* Experience Years */}
          <div className="space-y-2">
            <Label htmlFor="experienceYears" className="text-sm font-medium">
              Years of Experience <span className="text-destructive">*</span>
            </Label>
            <Input
              id="experienceYears"
              type="number"
              min={0}
              max={50}
              disabled={loading}
              aria-invalid={!!errors.experienceYears}
              {...register('experienceYears')}
            />
            {errors.experienceYears && (
              <p className="text-xs text-destructive">
                {errors.experienceYears.message}
              </p>
            )}
          </div>
        </div>

        {/* Skills Tag Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Skills & Competencies
          </Label>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <SkillsInput
                value={field.value}
                onChange={field.onChange}
                disabled={loading}
                placeholder="Type skill (e.g. React, TypeScript, PostgreSQL) and press Enter..."
              />
            )}
          />
          <p className="text-xs text-muted-foreground">
            Type skill name and press Enter or comma to create a badge tag.
          </p>
        </div>
      </div>

      {/* Recruitment & Application Details */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Application & Pipeline Details
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Applied Job */}
          <div className="space-y-2">
            <Label htmlFor="jobId" className="text-sm font-medium">
              Applied Position
            </Label>
            <select
              id="jobId"
              disabled={loading}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
              {...register('jobId')}
            >
              <option value="" className="bg-popover text-popover-foreground">
                -- General Applicant (No Job) --
              </option>
              {jobs.map((job) => (
                <option
                  key={job.id}
                  value={job.id}
                  className="bg-popover text-popover-foreground"
                >
                  {job.title} ({job.department})
                </option>
              ))}
            </select>
          </div>

          {/* Candidate Source */}
          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-medium">
              Application Source <span className="text-destructive">*</span>
            </Label>
            <select
              id="source"
              disabled={loading}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
              {...register('source')}
            >
              {SOURCES.map((src) => (
                <option key={src} value={src} className="bg-popover text-popover-foreground">
                  {src}
                </option>
              ))}
            </select>
            {errors.source && (
              <p className="text-xs text-destructive">{errors.source.message}</p>
            )}
          </div>

          {/* Initial Stage */}
          <div className="space-y-2">
            <Label htmlFor="stage" className="text-sm font-medium">
              Pipeline Stage <span className="text-destructive">*</span>
            </Label>
            <select
              id="stage"
              disabled={loading}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
              {...register('stage')}
            >
              {STAGES.map((stg) => (
                <option key={stg} value={stg} className="bg-popover text-popover-foreground">
                  {stg}
                </option>
              ))}
            </select>
            {errors.stage && (
              <p className="text-xs text-destructive">{errors.stage.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Expected Salary */}
          <div className="space-y-2">
            <Label htmlFor="expectedSalary" className="text-sm font-medium">
              Expected Salary (USD / year)
            </Label>
            <Input
              id="expectedSalary"
              type="number"
              placeholder="e.g. 140000"
              disabled={loading}
              {...register('expectedSalary')}
            />
          </div>

          {/* Resume URL */}
          <div className="space-y-2">
            <Label htmlFor="resumeUrl" className="text-sm font-medium">
              Resume / Portfolio URL
            </Label>
            <Input
              id="resumeUrl"
              type="url"
              placeholder="https://drive.google.com/... or https://portfolio.dev"
              disabled={loading}
              aria-invalid={!!errors.resumeUrl}
              {...register('resumeUrl')}
            />
            {errors.resumeUrl && (
              <p className="text-xs text-destructive">{errors.resumeUrl.message}</p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Candidate Initial Rating
          </Label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <StarRating
                  value={field.value}
                  onChange={field.onChange}
                  size="lg"
                />
                <span className="text-xs text-muted-foreground">
                  {field.value > 0 ? `${field.value} of 5 stars` : 'Unrated'}
                </span>
              </div>
            )}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Recruiter Notes & Comments
          </Label>
          <Textarea
            id="notes"
            rows={4}
            placeholder="Add any interview impressions, screening highlights, referral context, or compensation notes..."
            disabled={loading}
            {...register('notes')}
          />
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Link href={cancelHref}>
          <Button type="button" variant="outline" disabled={loading}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'create' ? 'Adding Candidate...' : 'Saving Changes...'}
            </>
          ) : mode === 'create' ? (
            'Add Candidate'
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
}
