export default async function deleteUnavailableTimeSlot(
    therapistId: string,
    token: string,
    date: string,
    startTime: string,
    endTime: string
  ) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
    console.log("Deleting unavailable time slot with the following details:", {
      therapistId,
      date,
      startTime,
      endTime,
    });
  
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/therapists/${therapistId}/unavailable-times`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date,
            startTime,
            endTime,
          }),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete unavailable time slot:", errorText);
        throw new Error(`Failed to delete unavailable time slot: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Unavailable time slot deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error in deleteUnavailableTimeSlot:", error);
      throw error;
    }
  }