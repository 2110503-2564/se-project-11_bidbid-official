import dayjs from 'dayjs'

export default async function getReview(id: string, token: string) {
  const res = await fetch(`https://backend-may-i-scan.vercel.app/api/v1/reviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch review')
  }

  const data = await res.json()
  return {
    review: data.data, // Return the review object
    createdAt: dayjs(data.data.createdAt), // Parse the created date
    readableDate: dayjs(data.data.createdAt).format('YYYY-MM-DD'), // Format the date
  }
}