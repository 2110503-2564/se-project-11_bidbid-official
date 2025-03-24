const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string,
  token: string
): Promise<void> => {
  const res = await fetch(
    `http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/reviews/${reviewId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    }
  )

  if (!res.ok) {
    throw new Error('Failed to update review')
  }
}

export default updateReview