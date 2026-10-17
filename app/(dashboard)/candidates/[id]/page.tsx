import * as React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCandidate } from '@/actions/candidates'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StageBadge } from '@/components/shared/stage-badge'
import { SourceBadge } from '@/components/shared/source-badge'
import { StageChangeDialog } from '@/components/candidates/stage-change-dialog'
import { DeleteCandidateDialog } from '@/components/candidates/delete-candidate-dialog'
import { AddInterviewNoteDialog } from '@/components/candidates/add-interview-note-dialog'
import { CandidateRatingCard } from '@/components/candidates/candidate-rating-card'
import { StageTimeline } from '@/components/candidates/stage-timeline'
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  FileText,
  Calendar,
  Clock,
  Edit,
  DollarSign,
  Award,
  ExternalLink,
  MessageSquare,
  History,
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

function formatSalary(amount?: number | null) {
  if (!amount) return 'Not disclosed'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await getCandidate(id)

  if (!res.success || !res.data) {
    notFound()
  }

  const candidate = res.data
  const stageHistory = candidate.stageHistory || []
  const interviewNotes = candidate.interviewNotes || []

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/candidates" className="hover:text-foreground transition-colors font-medium">
          Candidates
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-semibold truncate max-w-md">
          {candidate.fullName}
        </span>
      </nav>

      {/* Main 2-Column Layout: Left (2/3) and Right (1/3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2/3): Profile, Details, Interview Notes, Stage Timeline */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header Profile Card */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                {/* Large Avatar */}
                <Avatar size="lg" className="h-20 w-20 text-xl font-bold ring-2 ring-primary/20 shrink-0">
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {getInitials(candidate.fullName)}
                  </AvatarFallback>
                </Avatar>

                {/* Candidate Overview */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      {candidate.fullName}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      {candidate.currentRole ? (
                        <span>
                          <strong className="font-medium text-foreground">
                            {candidate.currentRole}
                          </strong>
                          {candidate.currentCompany && ` at ${candidate.currentCompany}`}
                        </span>
                      ) : (
                        <span className="italic">Role not specified</span>
                      )}
                    </div>
                  </div>

                  {/* Contact info list with icons */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted-foreground pt-1">
                    <a
                      href={`mailto:${candidate.email}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{candidate.email}</span>
                    </a>

                    {candidate.phone && (
                      <a
                        href={`tel:${candidate.phone}`}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{candidate.phone}</span>
                      </a>
                    )}

                    {candidate.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{candidate.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Resume link button */}
                  {candidate.resumeUrl && (
                    <div className="pt-2">
                      <a
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/30 hover:bg-primary/5">
                          <FileText className="h-4 w-4" />
                          <span>View Resume / Portfolio</span>
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Tags Section */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Skills & Expertise</CardTitle>
              <CardDescription>Core competencies highlighted by the applicant</CardDescription>
            </CardHeader>
            <CardContent>
              {candidate.skills && candidate.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill: string, index: number) => (
                    <span
                      key={`${skill}-${index}`}
                      className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No skills tagged for this candidate yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recruiter Notes Section */}
          {candidate.notes && (
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recruiter Notes</CardTitle>
                <CardDescription>Internal comments and candidate background</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-foreground/90 whitespace-pre-line leading-relaxed rounded-lg bg-muted/30 p-3.5 border border-border/60">
                  {candidate.notes}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interview Notes Section */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Interview Notes ({interviewNotes.length})</span>
                </CardTitle>
                <CardDescription>
                  Evaluations and scorecard feedback from hiring team members
                </CardDescription>
              </div>
              <AddInterviewNoteDialog
                candidateId={candidate.id}
                candidateName={candidate.fullName}
              />
            </CardHeader>

            <CardContent className="space-y-4">
              {interviewNotes.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                  <p>No interview debriefs or notes recorded yet.</p>
                  <p className="mt-1">
                    Click &ldquo;Add Interview Note&rdquo; above to log candidate evaluation notes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interviewNotes.map((note: any) => (
                    <div
                      key={note.id}
                      className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-border/50 pb-2">
                        <span className="font-semibold text-foreground">
                          {note.interviewer || 'Interviewer'}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          {note.scheduledAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Interview: {format(new Date(note.scheduledAt), 'MMM d, yyyy')}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Logged: {format(new Date(note.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <p className="whitespace-pre-line text-foreground/90 leading-relaxed pt-1">
                        {note.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stage History Timeline */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <span>Stage History Timeline</span>
              </CardTitle>
              <CardDescription>
                Audit log of all stage progressions and candidate transitions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <StageTimeline history={stageHistory} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3): Pipeline Status, Metadata & Quick Actions */}
        <div className="space-y-6">
          {/* Current Stage Card */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Current Pipeline Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Active Stage</span>
                  <StageBadge stage={candidate.stage} size="lg" />
                </div>

                {candidate.rejectionReason && (
                  <div className="rounded-md border border-destructive/20 bg-destructive/5 p-2.5 text-xs text-destructive">
                    <span className="font-semibold block">Rejection Reason:</span>
                    <span>{candidate.rejectionReason}</span>
                  </div>
                )}

                <div className="pt-1">
                  <StageChangeDialog
                    candidateId={candidate.id}
                    candidateName={candidate.fullName}
                    currentStage={candidate.stage}
                    triggerButton={
                      <Button className="w-full gap-2 font-medium">
                        <span>Advance / Change Stage</span>
                      </Button>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Metadata Summary */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs divide-y divide-border">
              {/* Applied Job */}
              <div className="pt-3 first:pt-0 flex items-start justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  Position
                </span>
                <span className="font-medium text-right">
                  {candidate.job ? (
                    <Link
                      href={`/jobs/${candidate.job.id}`}
                      className="text-primary hover:underline font-semibold block"
                    >
                      {candidate.job.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">General Pool</span>
                  )}
                </span>
              </div>

              {/* Source */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-muted-foreground">Source</span>
                <SourceBadge source={candidate.source} size="sm" />
              </div>

              {/* Experience */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium text-foreground">
                  {candidate.experienceYears}{' '}
                  {candidate.experienceYears === 1 ? 'year' : 'years'}
                </span>
              </div>

              {/* Expected Salary */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-muted-foreground">Expected Salary</span>
                <span className="font-medium text-foreground">
                  {formatSalary(candidate.expectedSalary)}
                </span>
              </div>

              {/* Rating */}
              <div className="pt-3 space-y-1.5">
                <span className="text-muted-foreground block">Rating</span>
                <CandidateRatingCard
                  candidateId={candidate.id}
                  initialRating={candidate.rating || 0}
                />
              </div>

              {/* Applied Date */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-muted-foreground">Applied On</span>
                <span className="font-medium text-foreground">
                  {format(new Date(candidate.createdAt), 'MMM d, yyyy')}
                </span>
              </div>

              {/* Last Updated */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-foreground">
                  {format(new Date(candidate.updatedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Actions */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <Link href={`/candidates/${candidate.id}/edit`} className="block">
                <Button variant="outline" className="w-full gap-2 justify-center">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </Link>

              <DeleteCandidateDialog
                candidateId={candidate.id}
                candidateName={candidate.fullName}
                redirectTo="/candidates"
                triggerButton={
                  <Button variant="destructive" className="w-full gap-2 justify-center">
                    <span>Delete Candidate</span>
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
