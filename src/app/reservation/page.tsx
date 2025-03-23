// "use client"
// import DateReserve from "@/components/DateReserve";
// import { Select, MenuItem, TextField, Button } from "@mui/material"

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
// import getUserProfile from "@/libs/getUserProfile";

// import { useSearchParams } from "next/navigation";
// import { useState } from "react";
// import dayjs, { Dayjs } from "dayjs"
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { BookingItem , ReservationItem } from "../../../interface";
// import { addReservation } from "@/redux/features/reserveSlice";

// export default function Reservation() {

//     const urlParams = useSearchParams()

//     const dispatch = useDispatch<AppDispatch>()

//     const makeReservation = () => {
//         console.log(nameLastname, tel, massageShop, reserveDate)
//         if(nameLastname && tel && massageShop && reserveDate) {
//             const item:ReservationItem = {
//                 nameLastname: nameLastname,
//                 tel: tel,
//                 massageShop: massageShop,
//                 reserveDate: dayjs(reserveDate).format("YYYY/MM/DD"),
//             }
//             dispatch(addReservation(item))
//             console.log(item)
//         }
//     }

//     const [nameLastname, setNameLastname] = useState<string>()
//     const [tel, setTel] = useState<string>()
//     // const [bookDate, setBookDate] = useState<Dayjs | null>(null)
//     const [reserveDate, setReserveDate] = useState<Dayjs | null>(null)
//     const [massageShop, setMassageShop] = useState<string>('Aroma')

//     return(
//         <main className="w-[100%] flex flex-col items-center space-y-4">
//             <div className="px-5 py-5 text-2xl font-bold">Massage Shop Reservation</div>

//             <div className="bg-slate-100 rounded-lg space-y-2
//             w-fit px-10 py-5 flex flex-col space-y-5 justify-center items-center">

//                 <TextField name="Name-Lastname" label="Name-Lastname" 
//                 variant="standard" className="w-[400px]" 
//                 onChange={(event)=>{setNameLastname(event.target.value)}}></TextField>
                
//                 <TextField name=" Contact-Number" label=" Contact-Number" 
//                 variant="standard" className="w-[400px]" 
//                 onChange={(event)=>{setTel(event.target.value)}}></TextField>

//                 <DateReserve onDateChange={(value:Dayjs)=>{setReserveDate(value)}}
//                 onLocationChange={(value:string)=>{setMassageShop(value)}}/>

//                 <button name="Reserve Massage"  
//                 className="block rounded-md bg-sky-600 
//                 hover:bg-indigo-600 px-3 py-2 text-white shadow-sm
//                 active:bg-indigo-700 active:scale-95 "
//                 onClick = { () => {
//                     makeReservation()
//                     alert("You have made a reservation")
//                 }} >
//                     Reserve Massage
//                 </button>

//             </div>
//         </main>
//     );
// }

'use client'

import DateReserve from "@/components/DateReserve"
import { TextField } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { useSession } from "next-auth/react"

export default function Reservation() {
  const { data: session } = useSession()
  const [nameLastname, setNameLastname] = useState<string>("")
  const [tel, setTel] = useState<string>("")
  const [reserveDate, setReserveDate] = useState<Dayjs | null>(null)
  const [massageShopId, setMassageShopId] = useState<string>("") // store shop ID

  const handleReservation = async () => {
    if (!session?.accessToken) {
      alert("You must be logged in.")
      return
    }

    console.log("user reservation token: " , session?.accessToken) //debug user token

    if (!massageShopId || !reserveDate) {
      alert("Please select a massage shop and date.")
      return
    }

    try {
      const res = await fetch(`http://localhost:5000/api/v1/massageShops/${massageShopId}/reservations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationDate: reserveDate.toISOString(),
          user: session.user.id,
        }),
      })

      if (res.ok) {
        alert("You have made a reservation!")
      } else {
        const err = await res.json()
        alert(err.message || "Reservation failed.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error making reservation.")
    }
  }

  return (
    <main className="w-full flex flex-col items-center space-y-4">
      <div className="px-5 py-5 text-2xl font-bold">Massage Shop Reservation</div>

      <div className="bg-slate-100 rounded-lg px-10 py-5 space-y-5 flex flex-col items-center">
        <TextField
          name="Name-Lastname"
          label="Name-Lastname"
          variant="standard"
          className="w-[400px]"
          onChange={(e) => setNameLastname(e.target.value)}
        />

        <TextField
          name="Contact-Number"
          label="Contact-Number"
          variant="standard"
          className="w-[400px]"
          onChange={(e) => setTel(e.target.value)}
        />

        <DateReserve
          onDateChange={(value: Dayjs) => setReserveDate(value)}
          onLocationChange={(value: string) => setMassageShopId(value)}
        />

        <button
          name="Reserve Massage"
          className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white 
          shadow-sm active:bg-indigo-700 active:scale-95"
          onClick={handleReservation}
        >
          Reserve Massage
        </button>
      </div>
    </main>
  )
}
