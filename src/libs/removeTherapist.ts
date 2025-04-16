const removeTherapist = async (id: string, token: string): Promise<boolean> => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${baseUrl}/api/v1/therapists/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!res.ok) {
      throw new Error('Failed to delete therapist');
    }
  
    return true;
  };
  
  export default removeTherapist;
  