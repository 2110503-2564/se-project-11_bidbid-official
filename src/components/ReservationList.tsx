'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ReservationItem, MassageItem } from '../../interface'
import { useRouter } from 'next/navigation'
import getReservations from '@/libs/getReservations'
import removeReservation from '@/libs/removeReservation'

export default function ReservationList() {
  const { data: session } = useSession()
  const [reservations, setReservations] = useState<ReservationItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter() // route to update page

  const fetchReservations = async () => {
    if (!session?.accessToken) return

    try {
      const reservationsData = await getReservations(session.accessToken)
      setReservations(reservationsData || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    if (!session?.accessToken) return

    try {
      await removeReservation(id, session.accessToken)
      setReservations(prev => prev.filter(item => item._id !== id))
      alert('Reservation removed successfully')
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to remove reservation')
    }
  }

  const handleUpdate = (id: string) => {
    router.push(`/myreservation/${id}`)
  }

  useEffect(() => {
    if (!session?.accessToken) return
    fetchReservations()
  }, [session])

  return (
    <div>
      {loading ? (
        <p className="text-gray-500 text-center py-5">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500 text-center py-5">No Massage Reservations</p>
      ) : (
        reservations.map((item) => (
          <div
            className="bg-slate-200 rounded-md px-5 mx-auto py-5 my-5 flex justify-between items-center w-[50%]"
            key={item._id}
          >
            {item.massageShop ? (
              <>
                <div>
                  <div className="text-xl font-semibold">{item.massageShop.name}</div>
                  {/* <div className="text-md">Booker's Name: {session?.user?.name}</div> */}
                  <div className="text-md">Booker's Name: {item.user?.name}</div>
                  <div className="text-md">Booker's Contact: {item.user?.phoneNumber}</div>

                  <div className="text-md">
                    Reserve Date: {new Date(item.reservationDate).toLocaleDateString()}
                  </div>
                  <div className="text-md">Address: {item.massageShop.address}</div>
                  <div className="text-md">Contact: {item.massageShop.phoneNumber}</div>
                  
                  <button
                      onClick={() => handleUpdate(item._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md mr-3 
                      hover:bg-green-700 active:bg-green-700 active:scale-95"
                    >
                      Update Reservation
                  </button>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="mt-3 bg-red-600 text-white px-3 py-1 rounded-md 
                    hover:bg-red-700 active:bg-red-700 active:scale-95"
                  >
                    Remove Reservation
                  </button>
                </div>
              </>
            ) : (
              <div className="text-red-500">Massage shop data not available</div>
            )}
          </div>
        ))
      )}
    </div>
  )
}