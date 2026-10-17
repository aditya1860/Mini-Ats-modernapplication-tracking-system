import * as React from 'react'
import Link from 'next/link'
import { getCandidates } from '@/actions/candidates'
import { Card, CardContent } from '@/components/ui/card'
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
import { DeleteCandidateDialog } from '@/components/candidates/delete-candidate-dialog'
import {
  Users,
  UserPlus,
  ArrowRight,
  Edit,
  Briefcase,
  ExternalLink,
} from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default async function CandidatesPage() {
  const result = await getCandidates()
  const data = result.success ? result.data : { candidates: [], total: 0 }
  const candidates = data.candidates || []

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Candidates
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {data.total}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Browse, manage, and advance applicants through your hiring pipeline stages.
          </p>
        </div>

        <Link href="/candidates/new">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Add Candidate</span>
          </Button>
        </Link>
      </div>

      {/* Candidates Table or Empty State */}
      {candidates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No candidates found</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            There are no candidates in your database yet. Add your first applicant to begin tracking them through your pipeline.
          </p>
          <Link href="/candidates/new">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Add Candidate</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-border">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[280px]">Candidate</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Applied Position</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((c: any) => (
                <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                  {/* Candidate Name & Email */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="text-xs font-semibold">
                          {getInitials(c.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link
                          href={`/candidates/${c.id}`}
                          className="font-medium text-foreground hover:text-primary transition-colors hover:underline block truncate"
                        >
                          {c.fullName}
                        </Link>
                        <span className="text-xs text-muted-foreground truncate block">
                          {c.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Current Role @ Company */}
                  <TableCell>
                    <div className="text-xs">
                      {c.currentRole ? (
                        <div>
                          <span className="font-medium text-foreground block truncate">
                            {c.currentRole}
                          </span>
                          {c.currentCompany && (
                            <span className="text-muted-foreground truncate block">
                              at {c.currentCompany}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Not specified</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Stage */}
                  <TableCell>
                    <StageBadge stage={c.stage} size="sm" />
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <StarRating value={c.rating || 0} readOnly size="sm" />
                  </TableCell>

                  {/* Job Requisition */}
                  <TableCell>
                    {c.job ? (
                      <Link
                        href={`/jobs/${c.job.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors max-w-[180px] truncate"
                      >
                        <Briefcase className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="truncate">{c.job.title}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        General Pool
                      </span>
                    )}
                  </TableCell>

                  {/* Applied Date */}
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(c.createdAt), 'MMM d, yyyy')}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Link href={`/candidates/${c.id}`}>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          title="View Profile"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>

                      <Link href={`/candidates/${c.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          title="Edit Candidate"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>

                      <DeleteCandidateDialog
                        candidateId={c.id}
                        candidateName={c.fullName}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
