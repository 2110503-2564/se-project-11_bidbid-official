const updateReservation = async (
    reservationId: string,
    reservationDate: string,
    massageShopId: string,
    token: string
  ): Promise<void> => {
    const res = await fetch(
      `http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/reservations/${reservationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservationDate,
          massageShop: massageShopId,
        }),
      }
    )
  
    if (!res.ok) {
      throw new Error('Failed to update reservation')
    }
  }
  
  export default updateReservation
  