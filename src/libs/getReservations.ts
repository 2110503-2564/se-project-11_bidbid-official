const getReservations = async (token: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${baseUrl}/api/v1/reservations/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch reservations");
  }

  const data = await res.json();
  console.log(data);
  return data.data;
};

export default getReservations;
