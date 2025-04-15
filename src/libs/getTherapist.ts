export default async function getTherapist(id: string, token: string) {
    if (!token) throw new Error('Access token is required');
  
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${baseUrl}/api/v1/therapists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    const data = await res.json();
  
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch therapist');
    }
  
    return data.data;
  }
  