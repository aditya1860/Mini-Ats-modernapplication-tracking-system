import { NextResponse } from "next/server"
import { INITIAL_CANDIDATES, Candidate } from "@/lib/data"

// In-memory runtime cache for seamless operation
let runtimeCandidates: Candidate[] = [...INITIAL_CANDIDATES]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")?.toLowerCase() || ""
  const stage = searchParams.get("stage") || ""
  const jobId = searchParams.get("jobId") || ""

  let filtered = [...runtimeCandidates]

  if (stage && stage !== "All") {
    filtered = filtered.filter((c) => c.stage.toLowerCase() === stage.toLowerCase())
  }

  if (jobId && jobId !== "All") {
    filtered = filtered.filter((c) => c.jobId === jobId)
  }

  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.fullName.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.currentRole?.toLowerCase().includes(search) ||
        c.currentCompany?.toLowerCase().includes(search) ||
        c.skills.some((s) => s.toLowerCase().includes(search))
    )
  }

  return NextResponse.json({
    candidates: filtered,
    total: filtered.length,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      fullName: body.fullName || "Unnamed Candidate",
      email: body.email,
      phone: body.phone || "",
      currentRole: body.currentRole || "Applicant",
      currentCompany: body.currentCompany || "Independent",
      experienceYears: Number(body.experienceYears) || 0,
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(",").map((s: string) => s.trim()) : []),
      source: body.source || "Other",
      expectedSalary: body.expectedSalary ? Number(body.expectedSalary) : undefined,
      location: body.location || "Remote",
      notes: body.notes || "",
      stage: "Applied",
      rating: Number(body.rating) || 3,
      jobId: body.jobId,
      jobTitle: body.jobTitle || "Open Role",
      jobDepartment: body.jobDepartment || "General",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stageHistory: [
        {
          id: `sh-${Date.now()}`,
          candidateId: `cand-${Date.now()}`,
          fromStage: "Application",
          toStage: "Applied",
          changedAt: new Date().toISOString(),
          note: "Candidate created",
        },
      ],
      interviewNotes: [],
    }

    runtimeCandidates.unshift(newCandidate)
    return NextResponse.json({ success: true, candidate: newCandidate })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create candidate" }, { status: 400 })
  }
}
