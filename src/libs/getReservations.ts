const getReservations = async (token: string) => {
    const res = await fetch('http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/reservations', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  
    if (!res.ok) {
      throw new Error('Failed to fetch reservations')
    }
  
    const data = await res.json()
    return data.data
  }
  
  export default getReservations
  