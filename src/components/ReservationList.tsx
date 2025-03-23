// 'use client'
// import { useSession } from 'next-auth/react'
// import { useEffect, useState } from 'react'
// import { ReservationItem, MassageItem } from '../../interface'

// export default function ReservationList() {
//   const { data: session } = useSession()
//   const [reservations, setReservations] = useState<ReservationItem[]>([])
//   const [loading, setLoading] = useState(true)

//   const fetchReservations = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/v1/reservations', {
//         headers: {
//           Authorization: `Bearer ${session?.accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       })

//       if (!res.ok) {
//         throw new Error('Failed to fetch reservations')
//       }

//       const data = await res.json()
//       setReservations(data.data || [])
//     } catch (err) {
//       console.error('Error:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRemove = async (id: string) => {
//     if (!session?.accessToken) return

//     try {
//       const res = await fetch(`http://localhost:5000/api/v1/reservations/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${session.accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       })

//       if (!res.ok) {
//         throw new Error('Failed to delete reservation')
//       }

//       setReservations(prev => prev.filter(item => item._id !== id))
//       alert('Reservation removed successfully')
//     } catch (err) {
//       console.error('Delete error:', err)
//       alert('Failed to remove reservation')
//     }
//   }

//   useEffect(() => {
//     if (!session?.accessToken) return
//     fetchReservations()
//   }, [session])

//   return (
//     <div>
//       {loading ? (
//         <p className="text-gray-500 text-center py-5">Loading reservations...</p>
//       ) : reservations.length === 0 ? (
//         <p className="text-gray-500 text-center py-5">No Massage Reservations</p>
//       ) : (
//         reservations.map((item) => (
//           <div
//             className="bg-slate-200 rounded px-5 mx-5 py-3 my-3"
//             key={item._id}
//           >
//             {item.massageShop ? (
//               <>
//                 <div className="text-xl font-semibold">{item.massageShop.name}</div>
//                 <div className="text-md">Booker's Name: {session?.user?.name}</div>
//                 <div className="text-md">
//                   Reserve Date: {new Date(item.reservationDate).toLocaleDateString()}
//                 </div>
//                 <div className="text-md">Address: {item.massageShop.address}</div>
//                 <div className="text-md">Contact: {item.massageShop.phoneNumber}</div>
//                 <button
//                   onClick={() => handleRemove(item._id)}
//                   className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                 >
//                   Remove Reservation
//                 </button>
//               </>
//             ) : (
//               <div className="text-red-500">Massage shop data not available</div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   )
// }

'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ReservationItem, MassageItem } from '../../interface'
import { useRouter } from 'next/navigation'

export default function ReservationList() {
  const { data: session } = useSession()
  const [reservations, setReservations] = useState<ReservationItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter() // route to update page

  const fetchReservations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/reservations', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch reservations')
      }

      const data = await res.json()
      setReservations(data.data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    if (!session?.accessToken) return

    try {
      const res = await fetch(`http://localhost:5000/api/v1/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to delete reservation')
      }

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
            className="bg-slate-200 rounded px-5 mx-auto py-5 my-5 flex justify-between items-center w-[50%]"
            key={item._id}
          >
            {item.massageShop ? (
              <>
                <div>
                  <div className="text-xl font-semibold">{item.massageShop.name}</div>
                  <div className="text-md">Booker's Name: {session?.user?.name}</div>
                  <div className="text-md">
                    Reserve Date: {new Date(item.reservationDate).toLocaleDateString()}
                  </div>
                  <div className="text-md">Address: {item.massageShop.address}</div>
                  <div className="text-md">Contact: {item.massageShop.phoneNumber}</div>
                  
                  <button
                      onClick={() => handleUpdate(item._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-3 
                      hover:bg-green-700 active:bg-green-700 active:scale-95"
                    >
                      Update Reservation
                  </button>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="mt-3 bg-red-600 text-white px-3 py-1 rounded 
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