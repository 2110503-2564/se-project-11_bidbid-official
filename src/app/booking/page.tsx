"use client"
import DateReserve from "@/components/DateReserve";
import { Select, MenuItem, TextField, Button } from "@mui/material"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getUserProfile from "@/libs/getUserProfile";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs"
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { BookingItem } from "../../../interface";
import { addBooking } from "@/redux/features/bookSlice";

export default function Booking() {

    const urlParams = useSearchParams()

    const dispatch = useDispatch<AppDispatch>()

    const makeBooking = () => {
        console.log(nameLastname, tel, venue, bookDate)
        if(nameLastname && tel && venue && bookDate) {
            const item:BookingItem = {
                nameLastname: nameLastname,
                tel: tel,
                venue: venue,
                bookDate: dayjs(bookDate).format("YYYY/MM/DD"),
            }
            dispatch(addBooking(item))
            console.log(item)
        }
    }

    const [nameLastname, setNameLastname] = useState<string>()
    const [tel, setTel] = useState<string>()
    const [bookDate, setBookDate] = useState<Dayjs | null>(null)
    const [venue, setVenue] = useState<string>('Bloom')

    return(
        <main className="w-[100%] flex flex-col items-center space-y-4">
            <div className="px-5 py-5 text-2xl font-bold">Venue Booking</div>

            <div className="bg-slate-100 rounded-lg space-y-2
            w-fit px-10 py-5 flex flex-col space-y-5 justify-center items-center">

                <TextField name="Name-Lastname" label="Name-Lastname" 
                variant="standard" className="w-[400px]" 
                onChange={(event)=>{setNameLastname(event.target.value)}}></TextField>
                
                <TextField name=" Contact-Number" label=" Contact-Number" 
                variant="standard" className="w-[400px]" 
                onChange={(event)=>{setTel(event.target.value)}}></TextField>

                <DateReserve onDateChange={(value:Dayjs)=>{setBookDate(value)}}
                onLocationChange={(value:string)=>{setVenue(value)}}/>

                <button name="Book Venue"  className="block rounded-md bg-sky-600 
                hover:bg-indigo-600 px-3 py-2 text-white shadow-sm"
                onClick={makeBooking} >
                    Book Venue
                </button>

            </div>
        </main>
    );
}