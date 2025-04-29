'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ReservationItem } from '../../interface'
import { useRouter } from 'next/navigation'
import getReservations from '@/libs/getReservations'
import removeReservation from '@/libs/removeReservation'
import deleteUnavailableTimeSlot from '@/libs/deleteUnavailableTimeSlot'
import dayjs from "dayjs";

export default function ReservationList() {
  const { data: session } = useSession()
  const [reservations, setReservations] = useState<ReservationItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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

  const handleRemove = async (
    id: string,
    timeSlotDetails: { date: string; startTime: string; endTime: string; therapistId: string }
  ) => {
    if (!session?.accessToken) return;
  
    console.log("Removing reservation with the following details:", {
      reservationId: id,
      timeSlotDetails,
    });
  
    try {
      // Remove the reservation
      console.log("Removing reservation...");
      await removeReservation(id, session.accessToken);
      console.log("Reservation removed successfully.");
      
      // Remove the associated unavailable time slot
      const { date, startTime, endTime, therapistId } = timeSlotDetails;
      console.log("Deleting unavailable time slot...");
      await deleteUnavailableTimeSlot(therapistId, session.accessToken, date, startTime, endTime);
      console.log("Unavailable time slot deleted successfully.");
  
      // Update the reservations state
      setReservations((prev) => prev.filter((item) => item._id !== id));
  
      alert("Reservation removed successfully");
    } catch (err) {
      console.error("Error during removal process:", err);
      alert("Failed to remove reservation or associated time slot");
    }
  };

  const handleUpdate = async (
    id: string,
    timeSlotDetails: { date: string; startTime: string; endTime: string; therapistId: string }
  ) => {
    if (!session?.accessToken) return;
  
    console.log("Updating reservation with the following details:", {
      reservationId: id,
      timeSlotDetails,
    });
  
    try {
      // Delete the associated unavailable time slot
      const { date, startTime, endTime, therapistId } = timeSlotDetails;
      console.log("Deleting unavailable time slot before update...");
      await deleteUnavailableTimeSlot(therapistId, session.accessToken, date, startTime, endTime);
      console.log("Unavailable time slot deleted successfully.");
  
      // Navigate to the update reservation page
      router.push(`/myreservation/${id}`);
    } catch (err) {
      console.error("Error during update process:", err);
      alert("Failed to prepare for reservation update");
    }
  };

  useEffect(() => {
    if (!session?.accessToken) return
    fetchReservations()
  }, [session])

  const renderReservationCard = (item: ReservationItem) => (
    <div
      key={item._id}
      className="group bg-white border border-gray-300 shadow rounded-xl px-6 py-5 mx-auto my-4 w-[70%] transition-all duration-300 hover:shadow-lg"
    >
      {/* Always visible section */}
      <div className="space-y-1">
        <div className="text-xl font-semibold">{item.massageShop?.name}</div>
        <div>Reserve Date: {new Date(item.date).toLocaleDateString()}</div>
        <div>Time: {item.time}</div>
        <div>Duration: {item.duration} hours</div>
      </div>

      {/* Hover-only section */}
      <div className="max-h-0 overflow-hidden opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-300 mt-3 space-y-2">
        <div>Booker's Name: {item.user?.name}</div>
        <div>Booker's Contact: {item.user?.phoneNumber}</div>
        <div>Address: {item.massageShop?.address}</div>
        <div>Contact: {item.massageShop?.phoneNumber}</div>
        <div>Therapist: {item.therapist?.user?.name || "N/A"}</div>

        <div className="flex gap-2 pt-2">
        <button
          onClick={() =>
            handleUpdate(item._id, {
              date: dayjs(item.date).format("YYYY-MM-DD"),
              startTime: item.time,
              endTime: calculateEndTime(item.time, item.duration),
              therapistId: item.therapist?._id,
            })
          }
          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 active:scale-95"
        >
          Update Reservation
        </button>
          <button
            onClick={() => 
              handleRemove(item._id, {
                date: dayjs(item.date).format("YYYY-MM-DD"),
                startTime: item.time,
                endTime: calculateEndTime(item.time, item.duration),
                therapistId: item.therapist?._id,
              })
            }
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 active:scale-95"
          >
            Remove Reservation
          </button>
        </div>
      </div>
      
      {/* ▼ icon – visible by default, fades out on hover */}
      <div className="text-center text-gray-400 mt-2 group-hover:opacity-0 transition-opacity duration-300">
        ▼
      </div>

    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-10 px-40">
      {loading ? (
        <p className="text-gray-500 text-center py-5">Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500 text-center py-5">No Massage Reservations</p>
      ) : (
        reservations.map((item) => renderReservationCard(item))
      )}
    </div>
  )
}

const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const endTime = new Date();
  endTime.setHours(hours + Math.floor(duration));
  endTime.setMinutes(minutes + (duration % 1) * 60);
  return endTime.toTimeString().slice(0, 5); // Format as HH:mm
};

// 'use client'
// import { useSession } from 'next-auth/react'
// import { useEffect, useState } from 'react'
// import { ReservationItem, MassageItem } from '../../interface'
// import { useRouter } from 'next/navigation'
// import getReservations from '@/libs/getReservations'
// import removeReservation from '@/libs/removeReservation'

// export default function ReservationList() {
//   const { data: session } = useSession()
//   const [reservations, setReservations] = useState<ReservationItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const router = useRouter() // route to update page

//   const fetchReservations = async () => {
//     if (!session?.accessToken) return

//     try {
//       const reservationsData = await getReservations(session.accessToken)
//       setReservations(reservationsData || [])
//     } catch (err) {
//       console.error('Error:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRemove = async (id: string) => {
//     if (!session?.accessToken) return

//     try {
//       await removeReservation(id, session.accessToken)
//       setReservations(prev => prev.filter(item => item._id !== id))
//       alert('Reservation removed successfully')
//     } catch (err) {
//       console.error('Delete error:', err)
//       alert('Failed to remove reservation')
//     }
//   }

//   const handleUpdate = (id: string) => {
//     router.push(`/myreservation/${id}`)
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
//             className="bg-gray-200 shadow rounded-xl px-5 mx-auto py-5 my-5 flex justify-between items-center w-[50%]"
//             key={item._id}
//           >
//             {item.massageShop ? (
//               <>
//                 <div>
//                   <div className="text-xl font-semibold">{item.massageShop.name}</div>
//                   {/* <div className="text-md">Booker's Name: {session?.user?.name}</div> */}
//                   <div className="text-md">Booker's Name: {item.user?.name}</div>
//                   <div className="text-md">Booker's Contact: {item.user?.phoneNumber}</div>

//                   <div className="text-md">
//                     {/* Reserve Date: {new Date(item.reservationDate).toLocaleDateString()} */}
//                     Reserve Date: {new Date(item.date).toLocaleDateString()}
//                   </div>
//                   <div className="text-md">Address: {item.massageShop.address}</div>
//                   <div className="text-md">Contact: {item.massageShop.phoneNumber}</div>
                  
//                   <button
//                       onClick={() => handleUpdate(item._id)}
//                       className="bg-green-600 text-white px-3 py-1 rounded-md mr-3 
//                       hover:bg-green-700 active:bg-green-700 active:scale-95"
//                     >
//                       Update Reservation
//                   </button>

//                   <button
//                     onClick={() => handleRemove(item._id)}
//                     className="mt-3 bg-red-600 text-white px-3 py-1 rounded-md 
//                     hover:bg-red-700 active:bg-red-700 active:scale-95"
//                   >
//                     Remove Reservation
//                   </button>
//                 </div>
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