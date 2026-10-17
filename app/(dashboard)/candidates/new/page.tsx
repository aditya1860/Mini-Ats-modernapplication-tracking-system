import * as React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { NewCandidateClient } from '@/components/candidates/new-candidate-client'

export const dynamic = 'force-dynamic'

export default async function NewCandidatePage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>
}) {
  const { jobId } = await searchParams

  // Fetch open jobs for the selector
  const jobs = await prisma.job.findMany({
    where: { status: 'Open' },
    select: {
      id: true,
      title: true,
      department: true,
    },
    orderBy: { title: 'asc' },
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link href={jobId ? `/jobs/${jobId}` : '/candidates'}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>{jobId ? 'Back to Job' : 'Back to Candidates'}</span>
          </Button>
        </Link>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add New Candidate</CardTitle>
          <CardDescription>
            Enter applicant details, skills, pipeline stage, and relevant compensation expectations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewCandidateClient jobs={jobs} initialJobId={jobId} />
        </CardContent>
      </Card>
    </div>
  )
}
