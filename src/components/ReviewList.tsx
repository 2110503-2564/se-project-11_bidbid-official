'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import getReviews from '@/libs/getReviews'
import removeReview from '@/libs/removeReview'

export default function ReviewList() {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchReviews = async () => {
    if (!session?.accessToken) return

    try {
      const reviewsData = await getReviews(session.accessToken)
      setReviews(reviewsData || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    if (!session?.accessToken) return

    try {
      await removeReview(id, session.accessToken)
      setReviews((prev) => prev.filter((item) => item._id !== id))
      alert('Review removed successfully')
    } catch (err) {
      console.error('Error removing review:', err)
      alert('Failed to remove review')
    }
  }

  const handleUpdate = (id: string) => {
    router.push(`/myreview/${id}`)
  }

  useEffect(() => {
    if (!session?.accessToken) return
    fetchReviews()
  }, [session])

  return (
    <div>
      {loading ? (
        <p className="text-gray-500 text-center py-5">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-5">No Reviews Found</p>
      ) : (
        reviews.map((item) => (
          <div
            className="bg-slate-200 rounded px-5 mx-auto py-5 my-5 flex justify-between items-center w-[50%]"
            key={item._id}
          >
            {item.massageShop ? (
              <div>
                <div className="text-xl font-semibold">{item.massageShop.name}</div>
                <div className="text-md">Reviewer: {item.user?.name || 'Anonymous'}</div>
                <div className="text-md">Rating: {'⭐'.repeat(item.rating)}</div>
                <div className="text-md">Comment: {item.comment}</div>
                <div className="text-md">
                  Reviewed On: {new Date(item.createdAt).toLocaleDateString()}
                </div>

                <button
                  onClick={() => handleUpdate(item._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-3 
                  hover:bg-green-700 active:bg-green-700 active:scale-95"
                >
                  Update Review
                </button>

                <button
                  onClick={() => handleRemove(item._id)}
                  className="mt-3 bg-red-600 text-white px-3 py-1 rounded 
                  hover:bg-red-700 active:bg-red-700 active:scale-95"
                >
                  Remove Review
                </button>
              </div>
            ) : (
              <div className="text-red-500">Massage shop data not available</div>
            )}
          </div>
        ))
      )}
    </div>
  )
}