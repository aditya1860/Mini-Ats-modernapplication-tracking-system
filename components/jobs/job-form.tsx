'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jobSchema, type JobFormData } from '@/lib/validations/jobs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface JobFormProps {
  defaultValues?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => Promise<void>
  isLoading?: boolean
  mode: 'create' | 'edit'
  onCancel?: () => void
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const
const JOB_STATUSES = ['Open', 'Closed'] as const

export function JobForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  mode,
  onCancel,
}: JobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: {
      title: defaultValues?.title ?? '',
      department: defaultValues?.department ?? '',
      location: defaultValues?.location ?? '',
      type: defaultValues?.type ?? 'Full-time',
      status: defaultValues?.status ?? 'Open',
      description: defaultValues?.description ?? '',
    },
  })

  const loading = isLoading || isSubmitting

  const handleFormSubmit = async (data: JobFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Job Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Senior Frontend Engineer"
          disabled={loading}
          aria-invalid={!!errors.title}
          {...register('title')}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Department & Location */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="department" className="text-sm font-medium">
            Department <span className="text-destructive">*</span>
          </Label>
          <Input
            id="department"
            placeholder="e.g. Engineering, Marketing"
            disabled={loading}
            aria-invalid={!!errors.department}
            {...register('department')}
          />
          {errors.department && (
            <p className="text-xs text-destructive">{errors.department.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            placeholder="e.g. San Francisco, CA / Remote"
            disabled={loading}
            aria-invalid={!!errors.location}
            {...register('location')}
          />
          {errors.location && (
            <p className="text-xs text-destructive">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Employment Type & Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Employment Type <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <select
              id="type"
              disabled={loading}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
              {...register('type')}
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t} className="bg-popover text-popover-foreground">
                  {t}
                </option>
              ))}
            </select>
          </div>
          {errors.type && (
            <p className="text-xs text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Status <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <select
              id="status"
              disabled={loading}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
              {...register('status')}
            >
              {JOB_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-popover text-popover-foreground">
                  {s}
                </option>
              ))}
            </select>
          </div>
          {errors.status && (
            <p className="text-xs text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Job Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          rows={6}
          placeholder="Describe role responsibilities, key requirements, qualifications, and benefits..."
          disabled={loading}
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        ) : (
          <Link href="/jobs">
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : mode === 'create' ? (
            'Create Job'
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
}
