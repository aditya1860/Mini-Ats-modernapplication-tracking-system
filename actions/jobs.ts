'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { jobSchema, type JobFormData } from '@/lib/validations/jobs'
import { INITIAL_JOBS, INITIAL_CANDIDATES, Job } from '@/lib/data'

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

let memoryJobs: Job[] = [...INITIAL_JOBS]

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
 * List all jobs along with candidate counts
 */
export async function getJobs(): Promise<ActionResult<any>> {
  try {
    await getAuthenticatedUser()

    try {
      const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { candidates: true },
          },
        },
      })
      if (jobs && jobs.length > 0) {
        return { success: true, data: jobs }
      }
    } catch {
      // Prisma DB connection unavailable, fall back to in-memory store
    }

    const jobsWithCounts = memoryJobs.map((j) => {
      const count = INITIAL_CANDIDATES.filter((c) => c.jobId === j.id).length
      return {
        ...j,
        createdAt: new Date(j.createdAt),
        updatedAt: new Date(j.updatedAt),
        _count: { candidates: count },
      }
    })

    return { success: true, data: jobsWithCounts }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to fetch jobs' }
  }
}

/**
 * Fetch a single job by id with its associated candidates
 */
export async function getJob(id: string): Promise<ActionResult<any>> {
  try {
    await getAuthenticatedUser()

    try {
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

      if (job) {
        return { success: true, data: job }
      }
    } catch {
      // Prisma DB connection unavailable
    }

    const found = memoryJobs.find((j) => j.id === id)
    if (!found) {
      return { success: false, error: 'Job requisition not found' }
    }

    const associatedCandidates = INITIAL_CANDIDATES.filter((c) => c.jobId === id).map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    }))

    return {
      success: true,
      data: {
        ...found,
        createdAt: new Date(found.createdAt),
        updatedAt: new Date(found.updatedAt),
        candidates: associatedCandidates,
        _count: { candidates: associatedCandidates.length },
      },
    }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to fetch job' }
  }
}

/**
 * Create a new job requisition
 */
export async function createJob(data: JobFormData): Promise<ActionResult<any>> {
  try {
    await getAuthenticatedUser()

    const validated = jobSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid job data',
      }
    }

    try {
      const job = await prisma.job.create({
        data: validated.data,
      })
      revalidatePath('/jobs')
      return { success: true, data: job }
    } catch {
      // Prisma DB connection unavailable, persist in-memory
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: validated.data.title,
        department: validated.data.department,
        location: validated.data.location,
        type: validated.data.type,
        status: validated.data.status,
        description: validated.data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      memoryJobs.unshift(newJob)
      revalidatePath('/jobs')
      return {
        success: true,
        data: {
          ...newJob,
          createdAt: new Date(newJob.createdAt),
          updatedAt: new Date(newJob.updatedAt),
          _count: { candidates: 0 },
        },
      }
    }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to create job' }
  }
}

/**
 * Update an existing job requisition
 */
export async function updateJob(id: string, data: JobFormData): Promise<ActionResult<any>> {
  try {
    await getAuthenticatedUser()

    const validated = jobSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid job data',
      }
    }

    try {
      const existing = await prisma.job.findUnique({ where: { id } })
      if (existing) {
        const job = await prisma.job.update({
          where: { id },
          data: validated.data,
        })
        revalidatePath('/jobs')
        revalidatePath(`/jobs/${id}`)
        return { success: true, data: job }
      }
    } catch {
      // Prisma DB connection unavailable
    }

    const idx = memoryJobs.findIndex((j) => j.id === id)
    if (idx !== -1) {
      memoryJobs[idx] = {
        ...memoryJobs[idx],
        ...validated.data,
        updatedAt: new Date().toISOString(),
      }
      revalidatePath('/jobs')
      revalidatePath(`/jobs/${id}`)
      return {
        success: true,
        data: {
          ...memoryJobs[idx],
          createdAt: new Date(memoryJobs[idx].createdAt),
          updatedAt: new Date(memoryJobs[idx].updatedAt),
        },
      }
    }

    return { success: false, error: 'Job requisition not found' }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update job' }
  }
}

/**
 * Delete a job requisition (checks for active candidates in pipeline)
 */
export async function deleteJob(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await getAuthenticatedUser()

    try {
      const existing = await prisma.job.findUnique({ where: { id } })
      if (existing) {
        const openCandidatesCount = await prisma.candidate.count({
          where: {
            jobId: id,
            stage: { notIn: ['Hired', 'Rejected'] },
          },
        })

        if (openCandidatesCount > 0) {
          return {
            success: false,
            error: `Cannot delete job: There are ${openCandidatesCount} active candidate(s) still in the hiring pipeline for this position. Please advance, reject, or reassign them first.`,
          }
        }

        await prisma.candidate.updateMany({
          where: { jobId: id },
          data: { jobId: null },
        })

        await prisma.job.delete({ where: { id } })
        revalidatePath('/jobs')
        return { success: true, data: { id } }
      }
    } catch {
      // Prisma DB unavailable
    }

    memoryJobs = memoryJobs.filter((j) => j.id !== id)
    revalidatePath('/jobs')
    return { success: true, data: { id } }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to delete job' }
  }
}
