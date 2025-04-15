export default async function verifyTherapist(id: string, token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    const res = await fetch(`${baseUrl}/api/v1/therapists/verify/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to verify therapist');
    }
  
    return await res.json();
  }
  