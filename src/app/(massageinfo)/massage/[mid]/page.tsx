'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import getMassageShop from '@/libs/getMassageShop'
import addReview from '@/libs/addReview'
import getMassageShopReview from '@/libs/getMassageShopReview'

export default function MassageDetailPage({ params }: { params: { mid: string } }) {
  const router = useRouter()
  const { data: session } = useSession() // Get session data
  const [massage, setMassage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [review, setReview] = useState({ rating: 0, comment: '' })
  const [hasReviewed, setHasReviewed] = useState(false) // Track if the user has already reviewed

  useEffect(() => {
    const fetchMassageAndReviews = async () => {
      try {
        const shopRes = await getMassageShop(params.mid)
        const reviewsRes = await getMassageShopReview(params.mid)
  
        const combined = {
          ...shopRes.data,
          reviews: reviewsRes.data || [],
        }
  
        setMassage(combined)
  
        // Check if the logged-in user has already reviewed the shop
        if (session?.user) {
          const userReview = reviewsRes.data.find(
            (r: any) => r.user?._id === session.user.id
          )
          setHasReviewed(!!userReview)
        }
  
        console.log("Reviews:", reviewsRes.data)
      } catch (error) {
        console.error('Failed to fetch massage shop or reviews:', error)
      } finally {
        setLoading(false)
      }
    }
  
    if (params.mid) {
      fetchMassageAndReviews()
    }
  }, [params.mid, session])
  

  const handleReviewSubmit = async () => {
    if (!session?.accessToken) {
      alert('You must be logged in to submit a review.')
      return
    }

    try {
      const newReview = await addReview(params.mid, review, session.accessToken) // Submit the review
      alert('Review submitted successfully!')
      setIsModalOpen(false)
      setReview({ rating: 0, comment: '' })
      setHasReviewed(true) // Mark as reviewed

      // Update the reviews state to include the new review
      setMassage((prevMassage: any) => ({
        ...prevMassage,
        reviews: [newReview.data, ...(prevMassage.reviews || [])], // Add the new review to the beginning of the reviews array
      }))
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('Failed to submit review.')
    }
  }

  if (loading) {
    return <div className="text-center p-5">Loading...</div>
  }

  if (!massage) {
    return <div className="text-center p-5 text-red-500">Massage shop not found.</div>
  }

  {console.log("Reviews:", massage.reviews)}


  return (
    <main className="text-center p-5">
      <h1 className="text-2xl font-medium">{massage.name}</h1>
      <div className="flex flex-row my-5">
        <Image
          src={massage.picture}
          alt="Massage Image"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg w-[30%]"
        />
        <div className="text-lg mx-5 text-left bg-slate-200 rounded p-5 mr-0 w-full space-y-1">
          <div className="text-medium">Name: {massage.name}</div>
          <div className="text-medium">Address: {massage.address}</div>
          <div className="text-medium">Price Range: {massage.priceRange}</div>
          <div className="text-medium">Tel: {massage.phoneNumber}</div>
          <div className="text-medium">Open Time: {massage.openTime}</div>
          <div className="text-medium">Close Time: {massage.closeTime}</div>
          <div className="flex space-x-3 my-3">
            {/* Reserve Button */}
            <button
              onClick={() => router.push('/reservation')}
              className="bg-blue-800 text-white px-3 py-1 rounded 
                border border-transparent
                hover:bg-white hover:border-blue-800 hover:text-blue-800 
                active:bg-white active:border-blue-800 active:text-blue-800 active:scale-95"
            >
              Reserve NOW!
            </button>

            {/* Review Button */}
            <button
              onClick={() => {
                if (!session) {
                  alert('You must be logged in to write a review.')
                  router.push('/auth/signin') // Redirect to login page
                  return
                }
                if (hasReviewed) {
                  alert('You have already reviewed this massage shop.')
                  return
                }
                setIsModalOpen(true)
              }}
              className={`px-3 py-1 rounded border ${
                hasReviewed
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white border border-transparent hover:bg-white hover:border-green-600 hover:text-green-600 active:bg-white active:border-green-600 active:text-green-600 active:scale-95'
              }`}
              disabled={hasReviewed} // Disable the button if the user has already reviewed
            >
              {hasReviewed ? 'Reviewed' : 'Review'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
    <div className="mt-5 bg-slate-200 rounded p-5 flex flex-col items-center">
      <h2 className="text-2xl font-medium">{massage.name}'s Reviews</h2>
      {massage.reviews && massage.reviews.length > 0 ? (
        <ul className="mt-3 bg-white w-[50%] mx-auto rounded">
          {massage.reviews.map((review: any) => (
            <li key={review._id} className="border-b py-2 text-center">
              <p className="font-medium">Rating: {'⭐'.repeat(review.rating)}</p>
              <p>Review: {review.comment}</p>
              <p className="text-sm text-gray-500">
                By {review.user?.name || 'Anonymous'} on{' '}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-center">No reviews available for this massage shop.</p>
      )}
    </div>


      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-medium mb-3">Write a Review</h2>
            <div className="mb-3">
              <label className="block text-left mb-1">Rating:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={review.rating}
                onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="mb-3">
              <label className="block text-left mb-1">Comment:</label>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}