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

/**
 * Get all candidates with filtering, searching, sorting, and pagination
 */
export async function getCandidates(
  filters?: CandidateFilters
): Promise<ActionResult<{ candidates: any[]; total: number; page: number; pageSize: number }>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 50
    const sortBy = filters?.sortBy || 'createdAt'
    const sortOrder = filters?.sortOrder || 'desc'

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

    return {
      success: true,
      data: {
        candidates,
        total,
        page,
        pageSize,
      },
    }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to fetch candidates' }
  }
}

/**
 * Fetch a single candidate with job, stage history, and interview notes
 */
export async function getCandidate(id: string): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

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

    if (!candidate) {
      return { success: false, error: 'Candidate profile not found' }
    }

    return { success: true, data: candidate }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to fetch candidate' }
  }
}

/**
 * Create a new candidate profile and log initial stage history
 */
export async function createCandidate(data: CandidateFormData): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validated = candidateSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid candidate data',
      }
    }

    // Check duplicate email
    const duplicate = await prisma.candidate.findUnique({
      where: { email: validated.data.email },
    })
    if (duplicate) {
      return {
        success: false,
        error: `A candidate with email ${validated.data.email} already exists in the system.`,
      }
    }

    const candidate = await prisma.$transaction(async (tx) => {
      const created = await tx.candidate.create({
        data: {
          fullName: validated.data.fullName,
          email: validated.data.email,
          phone: validated.data.phone || null,
          currentRole: validated.data.currentRole || null,
          currentCompany: validated.data.currentCompany || null,
          experienceYears: validated.data.experienceYears,
          skills: validated.data.skills,
          source: validated.data.source,
          expectedSalary: validated.data.expectedSalary || null,
          location: validated.data.location || null,
          resumeUrl: validated.data.resumeUrl || null,
          notes: validated.data.notes || null,
          jobId: validated.data.jobId || null,
          stage: validated.data.stage || 'Applied',
          rating: validated.data.rating || 0,
        },
      })

      // Initial stage history entry
      await tx.stageHistory.create({
        data: {
          candidateId: created.id,
          fromStage: 'None',
          toStage: created.stage,
          changedById: session.user?.id || null,
          note: 'Candidate application submitted',
        },
      })

      return created
    })

    revalidatePath('/candidates')
    if (candidate.jobId) {
      revalidatePath(`/jobs/${candidate.jobId}`)
    }
    return { success: true, data: candidate }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to create candidate' }
  }
}

/**
 * Update candidate information
 */
export async function updateCandidate(
  id: string,
  data: Partial<CandidateFormData>
): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const existing = await prisma.candidate.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: 'Candidate profile not found' }
    }

    // If email is changing, verify no conflict
    if (data.email && data.email !== existing.email) {
      const emailConflict = await prisma.candidate.findUnique({
        where: { email: data.email },
      })
      if (emailConflict) {
        return {
          success: false,
          error: `Another candidate with email ${data.email} already exists.`,
        }
      }
    }

    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
        ...(data.currentRole !== undefined ? { currentRole: data.currentRole || null } : {}),
        ...(data.currentCompany !== undefined ? { currentCompany: data.currentCompany || null } : {}),
        ...(data.experienceYears !== undefined ? { experienceYears: data.experienceYears } : {}),
        ...(data.skills !== undefined ? { skills: data.skills } : {}),
        ...(data.source !== undefined ? { source: data.source } : {}),
        ...(data.expectedSalary !== undefined ? { expectedSalary: data.expectedSalary || null } : {}),
        ...(data.location !== undefined ? { location: data.location || null } : {}),
        ...(data.resumeUrl !== undefined ? { resumeUrl: data.resumeUrl || null } : {}),
        ...(data.notes !== undefined ? { notes: data.notes || null } : {}),
        ...(data.jobId !== undefined ? { jobId: data.jobId || null } : {}),
        ...(data.stage !== undefined ? { stage: data.stage } : {}),
        ...(data.rating !== undefined ? { rating: data.rating } : {}),
      },
    })

    revalidatePath('/candidates')
    revalidatePath(`/candidates/${id}`)
    if (updated.jobId) {
      revalidatePath(`/jobs/${updated.jobId}`)
    }
    return { success: true, data: updated }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to update candidate' }
  }
}

/**
 * Delete a candidate (cascades to StageHistory and InterviewNotes)
 */
export async function deleteCandidate(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const existing = await prisma.candidate.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: 'Candidate profile not found' }
    }

    await prisma.candidate.delete({
      where: { id },
    })

    revalidatePath('/candidates')
    if (existing.jobId) {
      revalidatePath(`/jobs/${existing.jobId}`)
    }
    return { success: true, data: { id } }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to delete candidate' }
  }
}

/**
 * Change candidate stage with transition validation and history logging
 */
export async function changeStage(data: StageChangeData): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validated = stageChangeSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid stage transition request',
      }
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: validated.data.candidateId },
    })
    if (!candidate) {
      return { success: false, error: 'Candidate profile not found' }
    }

    const check = canTransition(candidate.stage, validated.data.toStage)
    if (!check.allowed) {
      return {
        success: false,
        error: check.message || 'This stage transition is not allowed.',
      }
    }

    if (validated.data.toStage === 'Rejected' && !validated.data.rejectionReason) {
      return {
        success: false,
        error: 'A rejection reason is required when moving a candidate to Rejected.',
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create StageHistory record
      await tx.stageHistory.create({
        data: {
          candidateId: candidate.id,
          fromStage: candidate.stage,
          toStage: validated.data.toStage,
          changedById: session.user?.id || null,
          note: validated.data.note || null,
          rejectionReason:
            validated.data.toStage === 'Rejected' ? validated.data.rejectionReason : null,
        },
      })

      // 2. Update Candidate stage and rejectionReason
      const updated = await tx.candidate.update({
        where: { id: candidate.id },
        data: {
          stage: validated.data.toStage,
          rejectionReason:
            validated.data.toStage === 'Rejected'
              ? validated.data.rejectionReason
              : null,
        },
      })

      return updated
    })

    revalidatePath('/candidates')
    revalidatePath(`/candidates/${candidate.id}`)
    if (candidate.jobId) {
      revalidatePath(`/jobs/${candidate.jobId}`)
    }

    return { success: true, data: result }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to update candidate stage' }
  }
}

/**
 * Add an interview note to candidate profile
 */
export async function addInterviewNote(
  candidateId: string,
  data: {
    interviewer?: string
    note: string
    scheduledAt?: Date | string | null
  }
): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    if (!data.note || !data.note.trim()) {
      return { success: false, error: 'Interview note cannot be blank' }
    }

    const note = await prisma.interviewNote.create({
      data: {
        candidateId,
        interviewer: data.interviewer?.trim() || session.user.name || 'Recruiter',
        note: data.note.trim(),
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
    })

    revalidatePath(`/candidates/${candidateId}`)
    return { success: true, data: note }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to add interview note' }
  }
}

/**
 * Quick update candidate star rating
 */
export async function updateCandidateRating(
  id: string,
  rating: number
): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validRating = Math.max(0, Math.min(5, Math.round(rating)))

    const updated = await prisma.candidate.update({
      where: { id },
      data: { rating: validRating },
    })

    revalidatePath('/candidates')
    revalidatePath(`/candidates/${id}`)
    return { success: true, data: updated }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to update candidate rating' }
  }
}
