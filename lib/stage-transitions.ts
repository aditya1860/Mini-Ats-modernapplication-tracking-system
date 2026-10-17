export const STAGE_ORDER = [
  'Applied',
  'Screening',
  'Interview',
  'Technical Round',
  'Offer',
  'Hired',
] as const

export type Stage = typeof STAGE_ORDER[number] | 'Rejected'

export interface TransitionCheck {
  allowed: boolean
  requiresConfirmation: boolean
  message?: string
}

export function canTransition(from: string, to: string): TransitionCheck {
  if (from === to) {
    return {
      allowed: false,
      requiresConfirmation: false,
      message: 'Candidate is already in this stage',
    }
  }

  if (to === 'Rejected') {
    return {
      allowed: true,
      requiresConfirmation: false,
    }
  }

  const fromIdx = STAGE_ORDER.indexOf(from as any)
  const toIdx = STAGE_ORDER.indexOf(to as any)

  if (from === 'Rejected') {
    return {
      allowed: true,
      requiresConfirmation: true,
      message: 'Reopening a previously rejected candidate requires confirmation.',
    }
  }

  if (from === 'Hired' && toIdx < STAGE_ORDER.length - 1) {
    return {
      allowed: true,
      requiresConfirmation: true,
      message: 'Moving an already hired candidate back into previous pipeline stages requires confirmation.',
    }
  }

  return {
    allowed: true,
    requiresConfirmation: false,
  }
}
