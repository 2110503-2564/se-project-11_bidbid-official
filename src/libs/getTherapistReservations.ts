// src/libs/getTherapistReservations.ts

const getTherapistReservations = async (token: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${baseUrl}/api/v1/therapists/me/reservations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch therapist reservations');
  }

  const json = await res.json();
  return json.data as Array<{
    _id: string;
    user: { name: string };
    massageShop: { name: string };
    massageProgram: string;
    duration: number;
    date: string;
    time: string;
  }>;
};

export default getTherapistReservations;
