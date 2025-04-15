export default async function getMe(token: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (res.ok && data.success && data.user && data.therapist) {
        return {
          user: data.user,
          therapist: data.therapist,
        };
      } else {
        throw new Error('Unauthorized or invalid role.');
      }
    } catch (err: any) {
      console.error('getMe error:', err);
      throw new Error('Failed to fetch profile');
    }
  }
  