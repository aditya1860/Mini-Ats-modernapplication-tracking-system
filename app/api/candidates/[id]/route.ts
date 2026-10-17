import { NextResponse } from "next/server"
import { INITIAL_CANDIDATES, Candidate, StageType } from "@/lib/data"

let runtimeCandidates: Candidate[] = [...INITIAL_CANDIDATES]

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const candidate = runtimeCandidates.find((c) => c.id === id)

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
  }

  return NextResponse.json({ candidate })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const index = runtimeCandidates.findIndex((c) => c.id === id)
  if (index === -1) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
  }

  const existing = runtimeCandidates[index]

  // Handle stage transition
  if (body.stage && body.stage !== existing.stage) {
    const historyItem = {
      id: `sh-${Date.now()}`,
      candidateId: id,
      fromStage: existing.stage,
      toStage: body.stage as StageType,
      changedAt: new Date().toISOString(),
      note: body.stageNote || `Stage transitioned from ${existing.stage} to ${body.stage}`,
      rejectionReason: body.rejectionReason,
    }
    existing.stageHistory = [historyItem, ...existing.stageHistory]
    existing.stage = body.stage as StageType
    if (body.rejectionReason) {
      existing.rejectionReason = body.rejectionReason
    }
  }

  // Handle adding an interview note
  if (body.newInterviewNote) {
    const newNote = {
      id: `in-${Date.now()}`,
      candidateId: id,
      scheduledAt: body.newInterviewNote.scheduledAt || new Date().toISOString(),
      interviewer: body.newInterviewNote.interviewer || "Alex Rivera",
      note: body.newInterviewNote.note,
      createdAt: new Date().toISOString(),
    }
    existing.interviewNotes = [newNote, ...existing.interviewNotes]
  }

  if (body.rating !== undefined) {
    existing.rating = Number(body.rating)
  }

  if (body.notes !== undefined) {
    existing.notes = body.notes
  }

  existing.updatedAt = new Date().toISOString()
  runtimeCandidates[index] = existing

  return NextResponse.json({ success: true, candidate: existing })
}
