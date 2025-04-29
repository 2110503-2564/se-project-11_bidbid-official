export default async function updateUnavailableTimeSlot(
    therapistId: string,
    token: string,
    date: string,
    day: string,
    startTime: string,
    endTime: string,
    updates: {
      newDate?: string;
      newDay?: string;
      newStartTime?: string;
      newEndTime?: string;
    }
  ) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
    console.log("Updating unavailable time slot with:", {
      therapistId,
      date,
      day,
      startTime,
      endTime,
      updates,
    });
  
    const response = await fetch(
      `${baseUrl}/api/v1/therapists/${therapistId}/unavailable-times`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          day,
          startTime,
          endTime,
          ...updates, // Include the new values for the time slot
        }),
      }
    );
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update unavailable time slot:", errorText);
      throw new Error(`Failed to update unavailable time slot: ${response.statusText}`);
    }
  
    const data = await response.json();
    console.log("Unavailable time slot updated successfully:", data);
    return data;
  }