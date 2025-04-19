"use client";

import DateReserve from "@/components/DateReserve";
import { useRouter } from "next/navigation";
import { MenuItem, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { MassageItem, TherapistItem, UserItem } from "../../../interface";
import getMassageShops from "@/libs/getMassageShops";
import getVerifiedTherapists from "@/libs/getVerifiedTherapist";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomTimePicker from "@/components/CustomTimePicker";
import addReservation from "@/libs/addReservation";
import updateReservation from "@/libs/updateReservation";
import getMe from "@/libs/getMe";

export default function Reservation() {
  const router = useRouter();
  const { data: session } = useSession();
  const [nameLastname, setNameLastname] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [massageShop, setMassageShop] = useState<string>("");
  const [therapist, setTherapist] = useState<string>("");
  const [massageProgram, setMassageProgram] = useState<string>("");
  const [duration, setDuration] = useState<number>(0.5);
  const [bookDate, setBookDate] = useState<Dayjs | null>(null);

  const [massageShops, setMassageShops] = useState<MassageItem[]>([]);
  useEffect(() => {
    const fetchMassageShops = async () => {
      var data = await getMassageShops();
      setMassageShops(data.data);
    };
    fetchMassageShops();
  }, []);

  const [Therapists, setTherapists] = useState<TherapistItem[]>([]);
  useEffect(() => {
    const fetchTherapists = async () => {
      var data = await getVerifiedTherapists(session?.accessToken || "");
      setTherapists(data.therapists);
    };
    fetchTherapists();
  }, []);

  const handleReservation = async () => {
    if (!session?.accessToken) {
      alert("You must be logged in.");
      router.push("/api/auth/signin"); // Redirect to login page
      return;
    }

    console.log("user reservation token: ", session?.accessToken); //debug user token

    if (!massageShop || !bookDate) {
      alert("Please select a massage shop and date.");
      return;
    }
    console.log(session.user.id);
    if (bookDate === null) return;
    await addReservation(
      // session.user.id,
      bookDate.toISOString(),
      "10:00",
      duration,
      therapist,
      massageShop,
      massageProgram,
      session.accessToken
    );
  };


  return (
    <main className="min-h-screen bg-white flex flex-col items-center pt-10 px-4">
      <div className="text-xl font-semibold mb-4">Massage Reservation</div>
  
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-2xl space-y-6">
  
        {/* Massage Shop and Therapist */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Massage Shop</label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
              value={massageShop}
              onChange={(e) => setMassageShop(e.target.value)}
            >
              <option value="">Select a massage shop</option>
              {massageShops.map((shop) => (
                <option key={shop._id} value={shop._id}>{shop.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
              value={therapist}
              onChange={(e) => setTherapist(e.target.value)}
            >
              <option value="">Select therapist</option>
              {Therapists.map((th) => (
                <option key={th._id} value={th._id}>{th.user.name}</option> 
                //{/* ไม่ต้องแก้นะ */}
                //{/* ไม่ต้องแก้นะ */}
                //{/* ไม่ต้องแก้นะ */}
                //{/* ไม่ต้องแก้นะ */}
              ))}
            </select>
          </div>
        </div>
  
        {/* Massage Program and Duration */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Massage Program</label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
              value={massageProgram}
              onChange={(e) => setMassageProgram(e.target.value)}
            >
              <option value="">Select program</option>
              <option value="footMassage">Foot Massage</option>
              <option value="oilMassage">Oil Massage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hour)</label>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              size="small"
              inputProps={{ step: 0.5, min: 0.5 }}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </div>
  
        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={bookDate}
                onChange={(newValue) => setBookDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      height: 40,
                      '& .MuiInputBase-root': {
                        height: 40,
                      },
                      '& input': {
                        padding: '10px 14px',
                      },
                    },
                  }
                }}
              />
            </LocalizationProvider>
            <p className="text-xs text-gray-500 mt-1">MM/DD/YYYY</p>
          </div>
          <div className="w-full max-w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <div className="h-[40px]">
              <CustomTimePicker />
            </div>
</div>

        </div>
  
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReservation}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-white hover:text-black border border-black transition duration-200"
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
  
}
