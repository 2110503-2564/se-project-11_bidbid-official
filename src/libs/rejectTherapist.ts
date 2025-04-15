export default async function rejectTherapist(id: string, token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
    const res = await fetch(`${baseUrl}/api/v1/therapists/reject/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to reject therapist');
    }
  
    const data = await res.json();
    return data;
  }
  