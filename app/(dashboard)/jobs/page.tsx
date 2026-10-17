import * as React from 'react'
import Link from 'next/link'
import { getJobs } from '@/actions/jobs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NewJobDialog } from '@/components/jobs/new-job-dialog'
import {
  Briefcase,
  MapPin,
  Building2,
  Users,
  Calendar,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from 'cn'

export const dynamic = 'force-dynamic'

const typeBadgeStyles: Record<string, string> = {
  'Full-time':
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  'Part-time':
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  Contract:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
  Internship:
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
}

export default async function JobsPage() {
  const result = await getJobs()
  const jobs = result.success ? result.data : []

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Job Requisitions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage open positions, requisitions, and their active candidate pipelines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/jobs/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Full Page</span>
            </Button>
          </Link>
          <NewJobDialog />
        </div>
      </div>

      {/* Jobs Grid or Empty State */}
      {jobs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <CardTitle className="text-xl font-semibold mb-2">
            No job requisitions yet
          </CardTitle>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Get started by creating your first job opening to track candidates and organize your hiring workflows.
          </p>
          <NewJobDialog
            triggerButton={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Your First Job</span>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job: any) => {
            const candidateCount = job._count?.candidates ?? 0
            const isOpen = job.status === 'Open'
            const typeStyle =
              typeBadgeStyles[job.type] ||
              'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group focus:outline-none"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/40 flex flex-col justify-between">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {job.title}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-1">{job.department}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium shrink-0',
                          isOpen
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-muted text-muted-foreground border-border'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            isOpen ? 'bg-emerald-500' : 'bg-muted-foreground'
                          )}
                        />
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {/* Type Badge */}
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium',
                          typeStyle
                        )}
                      >
                        {job.type}
                      </span>

                      {/* Location Badge */}
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{job.location}</span>
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <span>
                          {candidateCount}{' '}
                          {candidateCount === 1 ? 'candidate' : 'candidates'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(job.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
