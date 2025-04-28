// src/libs/getReservation.ts
import dayjs from "dayjs";

export default async function getReservation(
  id: string,
  token: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${baseUrl}/api/v1/reservations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch reservation");
  }
  const json = await res.json();
  // backend returns { data: { _id, date, time, duration, massageShop, massageProgram, therapist } }
  const reservation = json.data;
  return {
    reservation,
    formattedDate: dayjs(reservation.date),
    readableDate: dayjs(reservation.date).format("YYYY-MM-DD"),
  };
}
