import * as React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getJob } from '@/actions/jobs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StageBadge } from '@/components/shared/stage-badge'
import { StarRating } from '@/components/shared/star-rating'
import { EditJobDialog } from '@/components/jobs/edit-job-dialog'
import { DeleteJobDialog } from '@/components/jobs/delete-job-dialog'
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Users,
  ChevronRight,
  UserPlus,
  ArrowRight,
  Clock,
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

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await getJob(id)

  if (!res.success || !res.data) {
    notFound()
  }

  const job = res.data
  const candidates = job.candidates || []
  const isOpen = job.status === 'Open'
  const typeStyle =
    typeBadgeStyles[job.type] ||
    'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-foreground transition-colors font-medium">
          Jobs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-semibold truncate max-w-md">
          {job.title}
        </span>
      </nav>

      {/* Main Header Card */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {job.title}
              </h1>

              {/* Status Badge */}
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
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

            {/* Department, Location, Type metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{job.department}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{job.location}</span>
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                  typeStyle
                )}
              >
                {job.type}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <EditJobDialog job={job} />
            <DeleteJobDialog
              jobId={job.id}
              jobTitle={job.title}
              candidateCount={candidates.length}
            />
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Created {format(new Date(job.createdAt), 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Last updated {format(new Date(job.updatedAt), 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1 font-medium text-foreground ml-auto">
            <Users className="h-3.5 w-3.5 text-primary" />
            {candidates.length} {candidates.length === 1 ? 'Candidate' : 'Candidates'}
          </span>
        </div>
      </div>

      {/* Description Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">About the Role</CardTitle>
          <CardDescription>Position overview and candidate expectations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line text-sm text-foreground/90 leading-relaxed">
            {job.description}
          </div>
        </CardContent>
      </Card>

      {/* Candidates for this Job Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Candidates ({candidates.length})
            </CardTitle>
            <CardDescription>
              Applicants currently associated with this position
            </CardDescription>
          </div>
          <Link href={`/candidates/new?jobId=${job.id}`}>
            <Button size="sm" className="gap-1.5">
              <UserPlus className="h-4 w-4" />
              <span>Add Candidate</span>
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-3">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No candidates have applied to this role yet
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                Add candidates directly or link existing applications to track their progress through your pipeline.
              </p>
              <Link href={`/candidates/new?jobId=${job.id}`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <UserPlus className="h-4 w-4" />
                  <span>Add First Candidate</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Candidate</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className="text-xs font-semibold">
                            {getInitials(c.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/candidates/${c.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors hover:underline block"
                          >
                            {c.fullName}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {c.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StageBadge stage={c.stage} size="sm" />
                    </TableCell>

                    <TableCell>
                      <StarRating value={c.rating || 0} readOnly size="sm" />
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(c.createdAt), 'MMM d, yyyy')}
                    </TableCell>

                    <TableCell className="text-right">
                      <Link href={`/candidates/${c.id}`}>
                        <Button variant="ghost" size="xs" className="gap-1 text-primary">
                          <span>View Profile</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
