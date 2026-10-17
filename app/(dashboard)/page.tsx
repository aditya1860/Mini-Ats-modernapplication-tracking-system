import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, Sparkles, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Overview
        </h2>
        <p className="text-muted-foreground">
          Welcome to Mini ATS. Track candidates, manage job requisitions, and organize your hiring pipeline.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground">
              Dashboard coming in Phase 7
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              The full analytical dashboard with hiring funnel metrics, time-to-hire statistics, recent activity feeds, and recruitment velocity will be assembled in Phase 7.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Candidates Pipeline</CardTitle>
                <CardDescription>View, filter, and track applicants</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage candidate stages across Applied, Screening, Interview, Technical Round, Offer, Hired, and Rejected.
            </p>
            <Link href="/candidates" className="inline-block">
              <Button variant="outline" size="sm" className="gap-2">
                Go to Candidates
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Job Postings</CardTitle>
                <CardDescription>Manage open roles and requirements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create and maintain job listings across Engineering, Product, Design, Marketing, and Sales.
            </p>
            <Link href="/jobs" className="inline-block">
              <Button variant="outline" size="sm" className="gap-2">
                Go to Jobs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
