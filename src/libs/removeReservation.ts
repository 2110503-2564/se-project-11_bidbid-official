const removeReservation = async (id: string, token: string) => {
    const res = await fetch(`http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  
    if (!res.ok) {
      throw new Error('Failed to delete reservation')
    }
  
    return true
  }
  
  export default removeReservation
  