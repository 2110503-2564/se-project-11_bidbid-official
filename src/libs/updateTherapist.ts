const updateTherapist = async (id: string, body: any, token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
    const res = await fetch(`${baseUrl}/api/v1/therapists/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    console.log('Response:', res.status);

    if (!res.ok) {
      throw new Error('Failed to update therapist');
    }
  
    return await res.json();

  };
  
  export default updateTherapist;
  