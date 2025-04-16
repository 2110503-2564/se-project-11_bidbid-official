"use client";

import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { MassageItem } from "../../interface";

export default function DateReserve({
  onDateChange,
}: {
  onDateChange: Function;
}) {
  const [bookDate, setBookDate] = useState<Dayjs | null>(null);
  // const [massageShops, setMassageShops] = useState<MassageItem[]>([])
  // const [selectedShopId, setSelectedShopId] = useState<string>('')

  // useEffect(() => {
  //   const fetchMassageShops = async () => {
  //     try {
  //       const res = await fetch('https://backend-may-i-scan.vercel.app/api/v1/massageShops')
  //       const data = await res.json()
  //       setMassageShops(data.data || [])

  //       if (data.data.length > 0) {
  //         setSelectedShopId(data.data[0]._id)
  //         onLocationChange(data.data[0]._id)
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch massage shops", err)
  //     }
  //   }

  //   fetchMassageShops()
  // }, [])

  // const handleShopChange = (e: any) => {
  //   const selectedId = e.target.value
  //   setSelectedShopId(selectedId)
  //   onLocationChange(selectedId)
  // }

  return (
    <div className="bg-slate-100 rounded-lg space-x-5 space-y-2 w-[500px] px-10 py-5 flex flex-row justify-between items-center">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          className="bg-white w-full"
          value={bookDate}
          onChange={(value) => {
            setBookDate(value);
            onDateChange(value);
          }}
        />
      </LocalizationProvider>

      {/* <Select
        variant="standard"
        name="location"
        id="location"
        value={selectedShopId}
        onChange={handleShopChange}
        className="h-[2em] w-[300px]"
      >
        {massageShops.map((shop) => (
          <MenuItem key={shop._id} value={shop._id}>
            {shop.name}
          </MenuItem>
        ))}
      </Select> */}
    </div>
  );
}
