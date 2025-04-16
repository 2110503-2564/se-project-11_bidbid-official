export default async function addReservation(
  userID: string,
  user_name: string,
  date: string,
  time: string,
  duration: number,
  therapistID: string,
  massageShopID: string,
  massageProgram: string,
  token: string
) {
  console.log(userID);
  console.log(user_name);
  console.log(date);
  console.log(time);
  console.log(duration);
  console.log(therapistID);
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
        userID,
        user_name,
        date,
        time,
        duration,
        massageProgram,
        therapistID,
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
