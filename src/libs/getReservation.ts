import dayjs from 'dayjs'

export default async function getReservation(id: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${baseUrl}/api/v1/reservations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch reservation')
  }

  const data = await res.json()
  return {
    reservation: data.data,
    formattedDate: dayjs(data.data.reservationDate),
    readableDate: dayjs(data.data.reservationDate).format('YYYY-MM-DD'),
  }
}
