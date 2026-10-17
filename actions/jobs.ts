'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { jobSchema, type JobFormData } from '@/lib/validations/jobs'

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * List all jobs along with candidate counts
 */
export async function getJobs(): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { candidates: true },
        },
      },
    })

    return { success: true, data: jobs }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to fetch jobs' }
  }
}

/**
 * Fetch a single job by id with its associated candidates
 */
export async function getJob(id: string): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        candidates: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { candidates: true },
        },
      },
    })

    if (!job) {
      return { success: false, error: 'Job requisition not found' }
    }

    return { success: true, data: job }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to fetch job' }
  }
}

/**
 * Create a new job requisition
 */
export async function createJob(data: JobFormData): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validated = jobSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid job data',
      }
    }

    const job = await prisma.job.create({
      data: validated.data,
    })

    revalidatePath('/jobs')
    return { success: true, data: job }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to create job' }
  }
}

/**
 * Update an existing job requisition
 */
export async function updateJob(id: string, data: JobFormData): Promise<ActionResult<any>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validated = jobSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid job data',
      }
    }

    const existing = await prisma.job.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: 'Job requisition not found' }
    }

    const job = await prisma.job.update({
      where: { id },
      data: validated.data,
    })

    revalidatePath('/jobs')
    revalidatePath(`/jobs/${id}`)
    return { success: true, data: job }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to update job' }
  }
}

/**
 * Delete a job requisition (checks for active candidates in pipeline)
 */
export async function deleteJob(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const existing = await prisma.job.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: 'Job requisition not found' }
    }

    // Check no active/open candidates
    const openCandidatesCount = await prisma.candidate.count({
      where: {
        jobId: id,
        stage: {
          notIn: ['Hired', 'Rejected'],
        },
      },
    })

    if (openCandidatesCount > 0) {
      return {
        success: false,
        error: `Cannot delete job: There are ${openCandidatesCount} active candidate(s) still in the hiring pipeline for this position. Please advance, reject, or reassign them first.`,
      }
    }

    // Safely unassign any historical hired/rejected candidates before deleting
    await prisma.candidate.updateMany({
      where: { jobId: id },
      data: { jobId: null },
    })

    await prisma.job.delete({
      where: { id },
    })

    revalidatePath('/jobs')
    return { success: true, data: { id } }
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      throw error
    }
    return { success: false, error: error?.message || 'Failed to delete job' }
  }
}
