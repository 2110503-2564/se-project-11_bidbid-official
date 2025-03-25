const removeReservation = async (id: string, token: string) => {
    const res = await fetch(`https://backend-may-i-scan.vercel.app/api/v1/reservations/${id}`, {
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
  