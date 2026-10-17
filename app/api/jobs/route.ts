import { NextResponse } from "next/server"
import { INITIAL_JOBS, INITIAL_CANDIDATES, Job } from "@/lib/data"

let runtimeJobs: Job[] = [...INITIAL_JOBS]

export async function GET() {
  // Compute applicant counts per job
  const jobsWithCount = runtimeJobs.map((job) => {
    const candidateCount = INITIAL_CANDIDATES.filter((c) => c.jobId === job.id).length
    return {
      ...job,
      _count: {
        candidates: candidateCount,
      },
    }
  })

  return NextResponse.json({ jobs: jobsWithCount })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: body.title,
      department: body.department || "Engineering",
      location: body.location || "Remote",
      type: body.type || "Full-time",
      status: body.status || "Open",
      description: body.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { candidates: 0 },
    }

    runtimeJobs.unshift(newJob)
    return NextResponse.json({ success: true, job: newJob })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create job" }, { status: 400 })
  }
}
