'use client'
import { useState } from "react"
import { DatePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import { Select, MenuItem } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"

export default function DateReserve( {onDateChange, onLocationChange} 
    : { onDateChange:Function, onLocationChange:Function } ) {

    const [bookDate, setBookDate] = useState<Dayjs | null>(null)
    const [venue, setVenue] = useState<string>('Bloom')

    return (

        <div className="bg-slate-100 rounded-lg space-x-5 space-y-2 w-[500px] 
        px-10 py-5 flex flex-row justify-between items-center">

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className="bg-white w-full"
                value = {bookDate}
                onChange={ (value)=>{setBookDate(value); onDateChange(value)} }
                />
            </LocalizationProvider>

            <Select variant="standard" 
            name="location" id="location" value={venue}
            onChange={ (e)=> {setVenue(e.target.value); onLocationChange(e.target.value) } } 
            className="h-[2em] w-[300px]">
                <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
                <MenuItem value="Spark">Spark Space</MenuItem>
                <MenuItem value="GrandTable">The Grand Table</MenuItem>
            </Select>
                
        </div>

    );
}