 export default async function getPendingTherapists(token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${baseUrl}/api/v1/therapists/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Failed to fetch pending therapists');
    const data = await res.json();
    return data.therapists;
  }
  