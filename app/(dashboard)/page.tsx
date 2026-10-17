"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight, 
  Activity, 
  Plus, 
  Filter,
  BarChart3,
  Layers,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { INITIAL_CANDIDATES, INITIAL_JOBS, STAGE_CONFIG, StageType } from "@/lib/data"

export default function DashboardPage() {
  const candidates = INITIAL_CANDIDATES
  const jobs = INITIAL_JOBS

  // Compute metrics
  const totalCandidates = candidates.length
  const openJobs = jobs.filter((j) => j.status === "Open").length
  const hiredCount = candidates.filter((c) => c.stage === "Hired").length
  const offerCount = candidates.filter((c) => c.stage === "Offer").length

  // Stages count
  const stageCounts: Record<StageType, number> = {
    Applied: candidates.filter((c) => c.stage === "Applied").length,
    Screening: candidates.filter((c) => c.stage === "Screening").length,
    Interview: candidates.filter((c) => c.stage === "Interview").length,
    "Technical Round": candidates.filter((c) => c.stage === "Technical Round").length,
    Offer: offerCount,
    Hired: hiredCount,
    Rejected: candidates.filter((c) => c.stage === "Rejected").length,
  }

  // Department distribution
  const departmentBreakdown = [
    { name: "Engineering", count: candidates.filter((c) => c.jobDepartment === "Engineering").length, jobs: 3, percent: 45 },
    { name: "Product", count: candidates.filter((c) => c.jobDepartment === "Product").length, jobs: 1, percent: 20 },
    { name: "Design", count: candidates.filter((c) => c.jobDepartment === "Design").length, jobs: 1, percent: 15 },
    { name: "Marketing", count: candidates.filter((c) => c.jobDepartment === "Marketing").length, jobs: 1, percent: 12 },
  ]

  // Recent stage transition events
  const recentActivities = [
    { id: "act-1", name: "Aiden King", stage: "Offer", role: "Principal Engineer", time: "10 mins ago", note: "Offer extended: $195k base + equity" },
    { id: "act-2", name: "Emily Robinson", stage: "Technical Round", role: "Staff Engineer", time: "1 hour ago", note: "System design deep dive passed" },
    { id: "act-3", name: "Scarlett Nelson", stage: "Hired", role: "Senior Software Engineer", time: "3 hours ago", note: "Contract signed, start date confirmed" },
    { id: "act-4", name: "James Taylor", stage: "Screening", role: "Backend Engineer", time: "5 hours ago", note: "Phone screening completed by recruiter" },
    { id: "act-5", name: "Grace White", stage: "Interview", role: "Principal Designer", time: "Yesterday", note: "Portfolio evaluation 5/5 score" },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Futuristic Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-r from-card via-card/90 to-background p-6 shadow-sm sm:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-cyan-500 dark:text-cyan-400">
                OPERATIONAL TELEMETRY // ATS-CORE-01
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Recruitment Command Center
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm max-w-2xl">
              Real-time pipeline orchestration, stage conversion telemetry, and active talent tracking for high-velocity hiring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/candidates">
              <Button size="sm" className="font-medium gap-1.5 shadow-sm bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white border-0">
                <Plus className="h-4 w-4" />
                <span>Candidate Matrix</span>
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="sm" variant="outline" className="font-medium gap-1.5 border-border/70 hover:bg-muted/50">
                <Briefcase className="h-4 w-4 text-purple-400" />
                <span>Job Openings ({openJobs})</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Telemetry KPI HUD */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="relative overflow-hidden border-border/80 bg-card/60 backdrop-blur-xs hover:border-cyan-500/40 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="font-mono text-xs font-medium uppercase text-muted-foreground">
              Talent In Pipeline
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{totalCandidates}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3.5 w-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">+14.2%</span>
              <span className="ml-1">from last cycle</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="relative overflow-hidden border-border/80 bg-card/60 backdrop-blur-xs hover:border-purple-500/40 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="font-mono text-xs font-medium uppercase text-muted-foreground">
              Active Requisitions
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Briefcase className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{openJobs} <span className="text-sm font-normal text-muted-foreground">/ {jobs.length} total</span></div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span className="font-mono text-cyan-400 font-semibold">5 Open</span>
              <span className="mx-1">•</span>
              <span>Across 4 Depts</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="relative overflow-hidden border-border/80 bg-card/60 backdrop-blur-xs hover:border-emerald-500/40 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="font-mono text-xs font-medium uppercase text-muted-foreground">
              Hired & Offers
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">{hiredCount + offerCount}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-400">{hiredCount} Hired</span>
              <span className="mx-1">•</span>
              <span className="font-semibold text-amber-400">{offerCount} In Offer</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="relative overflow-hidden border-border/80 bg-card/60 backdrop-blur-xs hover:border-indigo-500/40 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="font-mono text-xs font-medium uppercase text-muted-foreground">
              Time to Hire
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-foreground">18.2 <span className="text-sm font-normal text-muted-foreground">Days</span></div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-400">-24%</span>
              <span className="ml-1">faster than target (24d)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Pipeline Stage Funnel Radar */}
      <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Pipeline Stage Conversion Funnel</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Live candidate count distribution and funnel health across all active stages
            </CardDescription>
          </div>
          <Link href="/candidates">
            <Button variant="ghost" size="xs" className="h-7 text-xs gap-1 text-cyan-400 hover:text-cyan-300">
              <span>Open Pipeline Board</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(Object.keys(stageCounts) as StageType[]).map((stage) => {
              const count = stageCounts[stage]
              const config = STAGE_CONFIG[stage]
              const percent = Math.round((count / totalCandidates) * 100)

              return (
                <Link
                  key={stage}
                  href={`/candidates?stage=${encodeURIComponent(stage)}`}
                  className={`group relative flex flex-col justify-between rounded-xl border ${config.border} ${config.bg} p-3.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono font-semibold tracking-wide uppercase ${config.color}`}>
                      {stage}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {percent}%
                    </span>
                  </div>

                  <div className="my-2 text-2xl font-black tracking-tight text-foreground">
                    {count}
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stage === 'Hired' ? 'bg-emerald-400' :
                        stage === 'Offer' ? 'bg-amber-400' :
                        stage === 'Rejected' ? 'bg-rose-400' :
                        'bg-cyan-400'
                      }`}
                      style={{ width: `${Math.max(percent * 2, 8)}%` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dual Column: Department Allocation & Live Activity Stream */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Talent Allocation */}
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span>Department Allocation Radar</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Applicant volume and open requisition density by department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentBreakdown.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{dept.name}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {dept.jobs} {dept.jobs === 1 ? 'Job' : 'Jobs'}
                    </span>
                  </div>
                  <div className="font-mono text-muted-foreground">
                    <span className="font-bold text-foreground">{dept.count}</span> applicants ({dept.percent}%)
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${dept.percent * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Activity Stream */}
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>Live Recruitment Event Stream</span>
              </CardTitle>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                STREAMING
              </span>
            </div>
            <CardDescription className="text-xs">
              Real-time audit log of candidate stage shifts and evaluations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((act) => {
              const config = STAGE_CONFIG[act.stage as StageType] || STAGE_CONFIG.Applied
              return (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {act.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">{act.name}</span>
                        <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono border ${config.border} ${config.bg} ${config.color}`}>
                          {act.stage}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{act.note}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-muted-foreground/70">
                    {act.time}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
