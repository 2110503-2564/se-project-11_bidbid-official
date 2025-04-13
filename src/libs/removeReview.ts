const removeReview = async (id: string, token: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${baseUrl}/api/v1/reviews/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to delete review')
  }

  return true
}

export default removeReview