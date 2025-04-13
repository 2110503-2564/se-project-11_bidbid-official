export default async function registerUser({
    name,
    email,
    password,
    phoneNumber,
  }: {
    name: string
    email: string
    password: string
    phoneNumber: string
  }) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber,
          role: 'user', // Always force user role
        }),
      }
    )
  
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to register user.')
    }
  
    return await res.json()
  }
  