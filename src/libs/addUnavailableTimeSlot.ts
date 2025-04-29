export default async function addUnavailableTimeSlot(
    date: string,
    day: string,
    startTime: string,
    endTime: string,
    id: string,
    token: string // Add token as a parameter
  ) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
    const response = await fetch(`${baseUrl}/api/v1/therapists/${id}/unavailable-times`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add Authorization header
      },
      body: JSON.stringify({
        date, // Format date as YYYY-MM-DD
        day,
        startTime,
        endTime,
      }),
    });
    console.log("Response from addUnavailableTimeSlot:", response); // Debugging line
    if (!response.ok) {
      throw new Error("Failed to add unavailable time slot");
    }
  
    return await response.json();
  }