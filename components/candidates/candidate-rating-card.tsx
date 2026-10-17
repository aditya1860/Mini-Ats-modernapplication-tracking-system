'use client'

import * as React from 'react'
import { useState } from 'react'
import { StarRating } from '@/components/shared/star-rating'
import { updateCandidateRating } from '@/actions/candidates'
import { toast } from 'sonner'

export function CandidateRatingCard({
  candidateId,
  initialRating,
}: {
  candidateId: string
  initialRating: number
}) {
  const [rating, setRating] = useState(initialRating)

  const handleChange = async (newRating: number) => {
    const previous = rating
    setRating(newRating)
    try {
      const res = await updateCandidateRating(candidateId, newRating)
      if (!res.success) {
        toast.error(res.error)
        setRating(previous)
        return
      }
      toast.success(
        newRating > 0
          ? `Candidate rating updated to ${newRating} star${newRating === 1 ? '' : 's'}`
          : 'Candidate rating cleared'
      )
    } catch {
      toast.error('Failed to update rating')
      setRating(previous)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <StarRating
        value={rating}
        onChange={handleChange}
        size="default"
      />
      <span className="text-xs font-medium text-muted-foreground">
        {rating > 0 ? `${rating} of 5` : 'Not rated'}
      </span>
    </div>
  )
}
