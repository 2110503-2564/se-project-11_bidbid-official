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
      session.user.id,
      session.user.name,
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
    <main className="w-full flex flex-col items-center space-y-4">
      <div className="px-5 py-5 text-2xl font-bold">
        Massage Shop Reservation
      </div>

      <div className="bg-slate-100 rounded-lg px-10 py-5 flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <TextField
            fullWidth
            name="Name-Lastname"
            label="Name-Lastname"
            variant="standard"
            className="w-[400px]"
            onChange={(e) => setNameLastname(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <TextField
            name="Contact-Number"
            label="Contact-Number"
            variant="standard"
            className="w-[400px]"
            onChange={(e) => setTel(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            className="border-b border-gray-300 flex-1 focus:outline-none py-1"
            value={massageShop}
            onChange={(e) => setMassageShop(e.target.value)}
          >
            <option key="" value="">
              Select a shop
            </option>
            {massageShops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.name}
              </option>
            ))}
          </select>

          <select
            className="border-b border-gray-300 flex-1 focus:outline-none py-1"
            value={therapist}
            onChange={(e) => setTherapist(e.target.value)}
          >
            <option value="">Select therapist</option>
            {Therapists.map((th) => (
              <option key={th._id} value={th._id}>
                {th.user.name}
                {/* ไม่ต้องแก้นะ */}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <select
            className="border-b border-gray-300 flex-1 focus:outline-none py-1"
            value={massageProgram}
            onChange={(e) => setMassageProgram(e.target.value)}
          >
            <option value="">Select program</option>
            <option value="footMassage">Foot Massage</option>
            <option value="oilMassage">Oil Massage</option>
          </select>

          <TextField
            variant="standard"
            fullWidth
            type="number"
            value={duration}
            onChange={(e) => {
              const num = Number(e.target.value);
              setDuration(num);
            }}
            inputProps={{ step: 0.5, min: 0.5 }}
          />
        </div>

        <div className="flex items-center space-x-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="bg-white w-full"
              value={bookDate}
              onChange={(value) => {
                setBookDate(value);
              }}
            />
          </LocalizationProvider>
          <CustomTimePicker />
        </div>
      </div>

      <button
        name="Reserve Massage"
        className="block rounded-md bg-blue-800 px-3 py-2 text-white shadow-sm 
          border border-transparent
          hover:bg-white hover:border-blue-800 hover:text-blue-800
          active:bg-white active:border-blue-800 active:text-blue-800 active:scale-95"
        onClick={handleReservation}
      >
        Reserve Massage
      </button>
    </main>
  );
}
