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
    const res = await fetch('http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/auth/register', {
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
  