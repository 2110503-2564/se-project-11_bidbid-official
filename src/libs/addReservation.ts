export default async function addReservation(
  // user: string,
  date: string,
  time: string,
  duration: number,
  therapist: string,
  massageShopID: string,
  massageProgram: string,
  token: string
) {
  // console.log(user);
  // console.log(user_name);
  console.log(date);
  console.log(time);
  console.log(duration);
  console.log(therapist);
  console.log(massageShopID);
  console.log(token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(
    `${baseUrl}/api/v1/massageShops/${massageShopID}/reservations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        // user,
        date,
        time,
        duration,
        massageProgram,
        therapist,
        massageShop: massageShopID,
      }),
    }
  );
  console.log(response.status);
  if (!response.ok) {
    console.log(response.status);
    throw new Error("Cannot add Reservation");
  }
  return await response.json();
}
