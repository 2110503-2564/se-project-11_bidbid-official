"use client"
import { useAppSelector, AppDispatch } from "@/redux/store"
import { useDispatch } from "react-redux"
import { removeBooking } from "@/redux/features/bookSlice"
import { removeReservation } from "@/redux/features/reserveSlice"
import { BookingItem } from "../../interface"
import { ReservationItem } from "../../interface"

export default function ReservationList() {
    
    const reserveItems = useAppSelector( (state) => state.reserveSlice.reserveItems )
    const dispatch = useDispatch<AppDispatch>()

    return (
        <div>
        {
            reserveItems.length === 0 ?
            (
                <p className="text-gray-500 text-center py-5">No Massage Reservation</p>
            )
            :
            (
                reserveItems.map( (ReservationItem) => (
                <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-3" key={`${ReservationItem.nameLastname}-${ReservationItem.reserveDate}`} >
                        <div className="text-xl font-semibold">{ReservationItem.nameLastname}</div>
                        <div className="text-md">Contact: {ReservationItem.tel}</div>
                        <div className="text-md">Massage Shop: {ReservationItem.massageShop}</div>
                        <div className="text-md">Booking Date: {ReservationItem.reserveDate}</div>

                        <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                        text-white shadow-sm my-2" onClick={ () => dispatch(removeReservation(ReservationItem)) } >
                            Remove from Booking List
                        </button>
                </div>
            ) )
            )
        }
        </div>
    )
}