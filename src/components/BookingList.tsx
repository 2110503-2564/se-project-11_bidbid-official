"use client"
import { useAppSelector, AppDispatch } from "@/redux/store"
import { useDispatch } from "react-redux"
import { removeBooking } from "@/redux/features/bookSlice"
import { BookingItem } from "../../interface"

export default function BookingList() {
    
    const bookItems = useAppSelector( (state) => state.bookSlice.bookItems )
    const dispatch = useDispatch<AppDispatch>()

    return (
        <div>
        {
            bookItems.length === 0 ?
            (
                <p className="text-gray-500 text-center py-5">No Venue Booking</p>
            )
            :
            (
            bookItems.map( (BookingItem) => (
                <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-3" key={`${BookingItem.nameLastname}-${BookingItem.bookDate}`} >
                        <div className="text-xl font-semibold">{BookingItem.nameLastname}</div>
                        <div className="text-md">Contact: {BookingItem.tel}</div>
                        <div className="text-md">Venue: {BookingItem.venue}</div>
                        <div className="text-md">Booking Date: {BookingItem.bookDate}</div>

                        <button className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2
                        text-white shadow-sm my-2" onClick={ () => dispatch(removeBooking(BookingItem)) } >
                            Remove from Booking List
                        </button>
                </div>
            ) )
            )
        }
        </div>
    )
}