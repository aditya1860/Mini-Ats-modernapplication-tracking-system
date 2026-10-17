import { z } from 'zod'

export const STAGES = [
  'Applied',
  'Screening',
  'Interview',
  'Technical Round',
  'Offer',
  'Hired',
  'Rejected',
] as const

export const SOURCES = [
  'LinkedIn',
  'Referral',
  'Job Board',
  'Website',
  'Other',
] as const

export const REJECTION_REASONS = [
  'Insufficient experience',
  'Skills mismatch',
  'Not a culture fit',
  'Offer declined by candidate',
  'Position filled',
  'Other',
] as const

export const candidateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  currentRole: z.string().optional(),
  currentCompany: z.string().optional(),
  experienceYears: z.coerce.number().min(0, 'Experience must be at least 0').max(50, 'Max 50 years'),
  skills: z.array(z.string()).default([]),
  source: z.enum(SOURCES),
  expectedSalary: z.coerce.number().optional().nullable(),
  location: z.string().optional(),
  resumeUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
  jobId: z.string().optional().nullable(),
  stage: z.enum(STAGES).default('Applied'),
  rating: z.coerce.number().min(0).max(5).default(0),
})

export const stageChangeSchema = z.object({
  candidateId: z.string().min(1, 'Candidate ID is required'),
  toStage: z.enum(STAGES),
  note: z.string().optional(),
  rejectionReason: z.string().optional(),
})

export type CandidateFormData = z.infer<typeof candidateSchema>
export type StageChangeData = z.infer<typeof stageChangeSchema>
