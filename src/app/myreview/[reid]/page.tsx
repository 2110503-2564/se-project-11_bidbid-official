'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Select, MenuItem, Button, TextField } from '@mui/material'
import { useSession } from 'next-auth/react'
import getReview from "@/libs/getReview"
import updateReview from '@/libs/updateReview'

export default function UpdateReviewPage() {
  const { reid } = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState<string>('')
  const [previousRating, setPreviousRating] = useState<number | null>(null)
  const [previousComment, setPreviousComment] = useState<string>('')

  useEffect(() => {
    const fetchReview = async () => {
      try {
        if (!reid || !session?.accessToken) return

        const { review } = await getReview(reid as string, session.accessToken)

        setPreviousRating(review.rating)
        setPreviousComment(review.comment)
        setRating(review.rating)
        setComment(review.comment)
      } catch (err) {
        console.error('Error fetching review:', err)
      }
    }

    if (session?.accessToken) {
      fetchReview()
    }

    console.log('reid:', reid)
  console.log('session:', session)

  }, [session, reid])

  const handleUpdate = async () => {
    if (!rating || !comment || !session?.accessToken) return

    try {
      await updateReview(
        String(reid),
        rating,
        comment,
        session.accessToken
      )
      alert('Review updated successfully')
      router.push('/myreview')
    } catch (err) {
      console.error('Update error:', err)
      alert('Failed to update review')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Review</h1>

      <div className="mt-5 text-md text-gray-700">
        <p>Previous Rating: <span className="font-semibold">{previousRating}</span></p>
      </div>

      <div className="mb-5 mt-2 text-md text-gray-700">
        <p>Previous Comment: <span className="font-semibold">{previousComment}</span></p>
      </div>

      <div className="mb-5 mt-7">
        <TextField
          label="New Rating (1-5)"
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          inputProps={{ min: 1, max: 5 }}
          fullWidth
        />
      </div>

      <div className="mb-5">
        <TextField
          label="New Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={4}
          fullWidth
        />
      </div>

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded 
        hover:bg-green-700 active:bg-green-700 active:scale-95"
      >
        Confirm Update
      </button>
    </div>
  )
}