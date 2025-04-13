const removeReservation = async (id: string, token: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;  
  const res = await fetch(`${baseUrl}/api/v1/reservations/${id}`, {
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
  