import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  status: z.enum(['Open', 'Closed']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

export type JobFormData = z.infer<typeof jobSchema>
