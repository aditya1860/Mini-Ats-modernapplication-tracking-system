'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  candidateSchema,
  stageChangeSchema,
  type CandidateFormData,
  type StageChangeData,
} from '@/lib/validations/candidates'
import { canTransition } from '@/lib/stage-transitions'
import { INITIAL_CANDIDATES, INITIAL_JOBS, Candidate, StageType } from '@/lib/data'

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface CandidateFilters {
  search?: string
  stage?: string
  jobId?: string
  source?: string
  sortBy?: 'createdAt' | 'fullName' | 'rating' | 'experienceYears'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

let memoryCandidates: Candidate[] = [...INITIAL_CANDIDATES]

async function getAuthenticatedUser() {
  const session = await auth()
  if (session?.user) {
    return session.user
  }
  return {
    id: 'recruiter-demo-id',
    name: 'Alex Rivera',
    email: 'recruiter@miniats.com',
  }
}

/**
 * Get all candidates with filtering, searching, sorting, and pagination
 */
export async function getCandidates(
  filters?: CandidateFilters
): Promise<ActionResult<{ candidates: any[]; total: number; page: number; pageSize: number }>> {
  try {
    await getAuthenticatedUser()

    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 50
    const sortBy = filters?.sortBy || 'createdAt'
    const sortOrder = filters?.sortOrder || 'desc'

    // Try Prisma query if DB is connected
    try {
      const where: any = {}

      if (filters?.search && filters.search.trim()) {
        const q = filters.search.trim()
        where.OR = [
          { fullName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { currentRole: { contains: q, mode: 'insensitive' } },
          { currentCompany: { contains: q, mode: 'insensitive' } },
        ]
      }

      if (filters?.stage && filters.stage !== 'ALL') {
        where.stage = filters.stage
      }

      if (filters?.jobId && filters.jobId !== 'ALL') {
        where.jobId = filters.jobId
      }

      if (filters?.source && filters.source !== 'ALL') {
        where.source = filters.source
      }

      const [total, candidates] = await Promise.all([
        prisma.candidate.count({ where }),
        prisma.candidate.findMany({
          where,
          include: {
            job: {
              select: {
                id: true,
                title: true,
                department: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ])

      if (candidates && candidates.length > 0) {
        return {
          success: true,
          data: {
            candidates,
            total,
            page,
            pageSize,
          },
        }
      }
    } catch {
      // Prisma DB unavailable, fall back to in-memory store
    }

    // In-memory fallback
    let filtered = [...memoryCandidates]

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.currentRole?.toLowerCase().includes(q) ||
          c.currentCompany?.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      )
    }

    if (filters?.stage && filters.stage !== 'ALL') {
      filtered = filtered.filter((c) => c.stage.toLowerCase() === filters.stage?.toLowerCase())
    }

    if (filters?.jobId && filters.jobId !== 'ALL') {
      filtered = filtered.filter((c) => c.jobId === filters.jobId)
    }

    if (filters?.source && filters.source !== 'ALL') {
      filtered = filtered.filter((c) => c.source.toLowerCase() === filters.source?.toLowerCase())
    }

    const total = filtered.length
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize).map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      job: c.jobId
        ? {
            id: c.jobId,
            title: c.jobTitle || 'Role',
            department: c.jobDepartment || 'Engineering',
          }
        : null,
    }))

    return {
      success: true,
      data: {
        candidates: paginated,
        total,
        page,
        pageSize,
      },
    }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to fetch candidates' }
  }
}

/**
 * Fetch a single candidate with job, stage history, and interview notes
 */
export async function getCandidate(id: string): Promise<ActionResult<any>> {
  try {
    await getAuthenticatedUser()

    try {
      const candidate = await prisma.candidate.findUnique({
        where: { id },
        include: {
          job: true,
          stageHistory: {
            orderBy: { changedAt: 'desc' },
            include: {
              changedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          interviewNotes: {
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (candidate) {
        return { success: true, data: candidate }
      }
    } catch {
      // Prisma DB unavailable
    }

    const found = memoryCandidates.find((c) => c.id === id)
    if (!found) {
      return { success: false, error: 'Candidate profile not found' }
    }

    const targetJob = INITIAL_JOBS.find((j) => j.id === found.jobId)

    return {
      success: true,
      data: {
        ...found,
        createdAt: new Date(found.createdAt),
        updatedAt: new Date(found.updatedAt),
        job: targetJob
          ? {
              ...targetJob,
              createdAt: new Date(targetJob.createdAt),
              updatedAt: new Date(targetJob.updatedAt),
            }
          : null,
        stageHistory: found.stageHistory.map((sh) => ({
          ...sh,
          changedAt: new Date(sh.changedAt),
          changedBy: { id: 'recruiter-demo-id', name: 'Alex Rivera', email: 'recruiter@miniats.com' },
        })),
        interviewNotes: found.interviewNotes.map((n) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          scheduledAt: n.scheduledAt ? new Date(n.scheduledAt) : null,
        })),
      },
    }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to fetch candidate' }
  }
}

/**
 * Create a new candidate profile and log initial stage history
 */
export async function createCandidate(data: CandidateFormData): Promise<ActionResult<any>> {
  try {
    const user = await getAuthenticatedUser()

    const validated = candidateSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid candidate data',
      }
    }

    try {
      const candidate = await prisma.$transaction(async (tx) => {
        const c = await tx.candidate.create({
          data: {
            fullName: validated.data.fullName,
            email: validated.data.email,
            phone: validated.data.phone || null,
            currentRole: validated.data.currentRole || null,
            currentCompany: validated.data.currentCompany || null,
            experienceYears: validated.data.experienceYears ?? 0,
            skills: validated.data.skills || [],
            source: validated.data.source || 'Other',
            expectedSalary: validated.data.expectedSalary || null,
            location: validated.data.location || null,
            resumeUrl: validated.data.resumeUrl || null,
            notes: validated.data.notes || null,
            stage: 'Applied',
            rating: validated.data.rating ?? 0,
            jobId: validated.data.jobId || null,
          },
        })

        await tx.stageHistory.create({
          data: {
            candidateId: c.id,
            fromStage: 'Applied',
            toStage: 'Applied',
            changedById: user.id,
            note: 'Candidate created via ATS portal',
          },
        })

        return c
      })

      revalidatePath('/candidates')
      revalidatePath('/')
      return { success: true, data: candidate }
    } catch {
      // Prisma DB unavailable, store in-memory
      const targetJob = INITIAL_JOBS.find((j) => j.id === validated.data.jobId)
      const newCand: Candidate = {
        id: `cand-${Date.now()}`,
        fullName: validated.data.fullName,
        email: validated.data.email,
        phone: validated.data.phone || '',
        currentRole: validated.data.currentRole || '',
        currentCompany: validated.data.currentCompany || '',
        experienceYears: validated.data.experienceYears || 0,
        skills: validated.data.skills || [],
        source: validated.data.source || 'Other',
        expectedSalary: validated.data.expectedSalary || undefined,
        location: validated.data.location || '',
        resumeUrl: validated.data.resumeUrl || '',
        notes: validated.data.notes || '',
        stage: 'Applied',
        rating: validated.data.rating || 0,
        jobId: validated.data.jobId || '',
        jobTitle: targetJob?.title || 'Open Requisition',
        jobDepartment: targetJob?.department || 'General',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stageHistory: [
          {
            id: `sh-${Date.now()}`,
            candidateId: `cand-${Date.now()}`,
            fromStage: 'Application',
            toStage: 'Applied',
            changedAt: new Date().toISOString(),
            note: 'Candidate created via ATS portal',
          },
        ],
        interviewNotes: [],
      }

      memoryCandidates.unshift(newCand)
      revalidatePath('/candidates')
      revalidatePath('/')
      return { success: true, data: newCand }
    }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to create candidate' }
  }
}

/**
 * Update candidate details
 */
export async function updateCandidate(
  id: string,
  data: CandidateFormData
): Promise<ActionResult<any>> {
  try {
    await getAuthenticatedUser()

    const validated = candidateSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid candidate data',
      }
    }

    try {
      const candidate = await prisma.candidate.update({
        where: { id },
        data: {
          fullName: validated.data.fullName,
          email: validated.data.email,
          phone: validated.data.phone || null,
          currentRole: validated.data.currentRole || null,
          currentCompany: validated.data.currentCompany || null,
          experienceYears: validated.data.experienceYears ?? 0,
          skills: validated.data.skills || [],
          source: validated.data.source || 'Other',
          expectedSalary: validated.data.expectedSalary || null,
          location: validated.data.location || null,
          resumeUrl: validated.data.resumeUrl || null,
          notes: validated.data.notes || null,
          rating: validated.data.rating ?? 0,
          jobId: validated.data.jobId || null,
        },
      })

      revalidatePath('/candidates')
      revalidatePath(`/candidates/${id}`)
      return { success: true, data: candidate }
    } catch {
      // Prisma DB unavailable
    }

    const idx = memoryCandidates.findIndex((c) => c.id === id)
    if (idx !== -1) {
      memoryCandidates[idx] = {
        ...memoryCandidates[idx],
        ...validated.data,
        jobId: validated.data.jobId || undefined,
        phone: validated.data.phone || undefined,
        currentRole: validated.data.currentRole || undefined,
        currentCompany: validated.data.currentCompany || undefined,
        location: validated.data.location || undefined,
        resumeUrl: validated.data.resumeUrl || undefined,
        notes: validated.data.notes || undefined,
        expectedSalary: validated.data.expectedSalary || undefined,
        updatedAt: new Date().toISOString(),
      }
      revalidatePath('/candidates')
      revalidatePath(`/candidates/${id}`)
      return { success: true, data: memoryCandidates[idx] }
    }

    return { success: false, error: 'Candidate profile not found' }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update candidate' }
  }
}

/**
 * Transition candidate to another stage with audit log
 */
export async function changeCandidateStage(data: StageChangeData): Promise<ActionResult<any>> {
  try {
    const user = await getAuthenticatedUser()

    const validated = stageChangeSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid transition data',
      }
    }

    try {
      const candidate = await prisma.candidate.findUnique({
        where: { id: validated.data.candidateId },
      })

      if (candidate) {
        await prisma.$transaction(async (tx) => {
          await tx.candidate.update({
            where: { id: candidate.id },
            data: {
              stage: validated.data.toStage,
              rejectionReason:
                validated.data.toStage === 'Rejected'
                  ? validated.data.rejectionReason || 'No specific reason provided'
                  : null,
            },
          })

          await tx.stageHistory.create({
            data: {
              candidateId: candidate.id,
              fromStage: candidate.stage,
              toStage: validated.data.toStage,
              changedById: user.id,
              note: validated.data.note || `Transitioned to ${validated.data.toStage}`,
              rejectionReason:
                validated.data.toStage === 'Rejected' ? validated.data.rejectionReason : null,
            },
          })
        })

        revalidatePath('/candidates')
        revalidatePath(`/candidates/${candidate.id}`)
        revalidatePath('/')
        return { success: true, data: { stage: validated.data.toStage } }
      }
    } catch {
      // Prisma DB unavailable
    }

    const idx = memoryCandidates.findIndex((c) => c.id === validated.data.candidateId)
    if (idx !== -1) {
      const current = memoryCandidates[idx]
      const hist = {
        id: `sh-${Date.now()}`,
        candidateId: current.id,
        fromStage: current.stage,
        toStage: validated.data.toStage,
        changedAt: new Date().toISOString(),
        note: validated.data.note || `Transitioned to ${validated.data.toStage}`,
        rejectionReason: validated.data.rejectionReason,
      }
      current.stage = validated.data.toStage as StageType
      current.stageHistory = [hist, ...current.stageHistory]
      current.updatedAt = new Date().toISOString()
      memoryCandidates[idx] = current

      revalidatePath('/candidates')
      revalidatePath(`/candidates/${current.id}`)
      revalidatePath('/')
      return { success: true, data: { stage: validated.data.toStage } }
    }

    return { success: false, error: 'Candidate profile not found' }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to change stage' }
  }
}

export const changeStage = changeCandidateStage

/**
 * Add an interview feedback note
 */
export async function addInterviewNote(
  arg1: string | { candidateId: string; note: string; interviewer?: string; scheduledAt?: any },
  arg2?: { note: string; interviewer?: string; scheduledAt?: any }
): Promise<ActionResult<any>> {
  try {
    const user = await getAuthenticatedUser()

    const candidateId = typeof arg1 === 'string' ? arg1 : arg1.candidateId
    const noteData = typeof arg1 === 'string' ? arg2 || { note: '' } : arg1

    if (!noteData.note || !noteData.note.trim()) {
      return { success: false, error: 'Note cannot be empty' }
    }

    try {
      const created = await prisma.interviewNote.create({
        data: {
          candidateId,
          note: noteData.note.trim(),
          interviewer: noteData.interviewer || user.name || 'Recruiter',
          scheduledAt: noteData.scheduledAt ? new Date(noteData.scheduledAt) : null,
        },
      })
      revalidatePath(`/candidates/${candidateId}`)
      return { success: true, data: created }
    } catch {
      // Prisma DB unavailable
    }

    const idx = memoryCandidates.findIndex((c) => c.id === candidateId)
    if (idx !== -1) {
      const newNote = {
        id: `in-${Date.now()}`,
        candidateId,
        scheduledAt: noteData.scheduledAt ? new Date(noteData.scheduledAt).toISOString() : undefined,
        interviewer: noteData.interviewer || user.name || 'Alex Rivera',
        note: noteData.note.trim(),
        createdAt: new Date().toISOString(),
      }
      memoryCandidates[idx].interviewNotes = [newNote, ...memoryCandidates[idx].interviewNotes]
      revalidatePath(`/candidates/${candidateId}`)
      return { success: true, data: newNote }
    }

    return { success: false, error: 'Candidate not found' }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to add interview note' }
  }
}

/**
 * Update candidate rating (1 to 5 stars)
 */
export async function updateCandidateRating(
  id: string,
  rating: number
): Promise<ActionResult<any>> {
  try {
    await getAuthenticatedUser()

    try {
      const updated = await prisma.candidate.update({
        where: { id },
        data: { rating },
      })
      revalidatePath('/candidates')
      revalidatePath(`/candidates/${id}`)
      return { success: true, data: updated }
    } catch {
      // Prisma DB unavailable
    }

    const idx = memoryCandidates.findIndex((c) => c.id === id)
    if (idx !== -1) {
      memoryCandidates[idx].rating = rating
      memoryCandidates[idx].updatedAt = new Date().toISOString()
      revalidatePath('/candidates')
      revalidatePath(`/candidates/${id}`)
      return { success: true, data: memoryCandidates[idx] }
    }

    return { success: false, error: 'Candidate not found' }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update rating' }
  }
}

/**
 * Delete a candidate profile
 */
export async function deleteCandidate(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await getAuthenticatedUser()

    try {
      await prisma.candidate.delete({
        where: { id },
      })
      revalidatePath('/candidates')
      revalidatePath('/')
      return { success: true, data: { id } }
    } catch {
      // Prisma DB unavailable
    }

    memoryCandidates = memoryCandidates.filter((c) => c.id !== id)
    revalidatePath('/candidates')
    revalidatePath('/')
    return { success: true, data: { id } }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to delete candidate' }
  }
}
