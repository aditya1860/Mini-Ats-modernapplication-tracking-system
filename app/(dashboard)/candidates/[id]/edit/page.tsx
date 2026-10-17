import * as React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCandidate } from '@/actions/candidates'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { EditCandidateClient } from '@/components/candidates/edit-candidate-client'

export const dynamic = 'force-dynamic'

export default async function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [candidateRes, jobs] = await Promise.all([
    getCandidate(id),
    prisma.job.findMany({
      select: {
        id: true,
        title: true,
        department: true,
      },
      orderBy: { title: 'asc' },
    }),
  ])

  if (!candidateRes.success || !candidateRes.data) {
    notFound()
  }

  const candidate = candidateRes.data

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Link href={`/candidates/${candidate.id}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </Button>
        </Link>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Edit Candidate Profile</CardTitle>
          <CardDescription>
            Update application data, contact details, skills, and current compensation for {candidate.fullName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditCandidateClient candidate={candidate} jobs={jobs} />
        </CardContent>
      </Card>
    </div>
  )
}
