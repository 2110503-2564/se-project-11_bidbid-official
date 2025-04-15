
  export default async function getVerifiedTherapists(token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${baseUrl}/api/v1/therapists/verified`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error('Failed to fetch verified therapists');
    const data = await res.json();
    return data.therapists;
  }
  