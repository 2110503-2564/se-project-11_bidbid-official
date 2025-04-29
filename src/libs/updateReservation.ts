const updateReservation = async (
  reservationId: string,
  reservationDate: string,
  reservationTime: string,
  reservationDuration: number,
  reservationtherapistId: string,
  massageShopId: string,
  token: string
): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  console.log("Updating reservation with the following details:");
  console.log("Reservation ID:", reservationId);
  console.log("Reservation Date:", reservationDate);
  console.log("Reservation Time:", reservationTime);
  console.log("Reservation Duration:", reservationDuration);
  console.log("Therapist ID:", reservationtherapistId);
  console.log("Massage Shop ID:", massageShopId);

  try {
    const res = await fetch(
      `${baseUrl}/api/v1/reservations/${reservationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservationDate,
          reservationTime,
          reservationDuration,
          reservationtherapistId,
          massageShop: massageShopId,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to update reservation. Response:", errorText);
      throw new Error("Failed to update reservation");
    }

    const responseData = await res.json();
    console.log("Reservation updated successfully. Response:", responseData);
  } catch (error) {
    console.error("Error during reservation update:", error);
    throw error;
  }
};

export default updateReservation;