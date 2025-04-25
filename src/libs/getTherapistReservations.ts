// src/libs/getTherapistReservations.ts
import dayjs from 'dayjs';

export default async function getTherapistReservations(
  tid: string,
  token: string
): Promise<{
  _id: string;
  customerName: string;
  massageShopName: string;
  program: string;
  duration: number;
  reservationDate: string;
}[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(
    `${baseUrl}/api/v1/therapists/${tid}/reservations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch therapist reservations');
  }

  const data = await res.json();
  // Assuming data.data is an array of reservation objects
  return data.data.map((item: any) => ({
    ...item,
    reservationDate: item.reservationDate,
  }));
}