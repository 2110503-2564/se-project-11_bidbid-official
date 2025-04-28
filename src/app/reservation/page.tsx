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
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import addReservation from "@/libs/addReservation";
import updateReservation from "@/libs/updateReservation";
import getMe from "@/libs/getMe";
import weekday from "dayjs/plugin/weekday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
dayjs.extend(weekday);
dayjs.extend(localizedFormat);

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
  const [time, setTime] = useState<string>("08:00");
  const [minTime, setMinTime] = useState<Dayjs>(
    dayjs().hour(8).minute(0).second(0)
  );

  const now = dayjs();
  const todayStart = dayjs().startOf("day");
  const closeToday = todayStart.hour(17).minute(0).second(0);
  const afterCloseToday = now.isAfter(closeToday);

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
      var data = await getVerifiedTherapists();
      setTherapists(data.therapists);
    };
    fetchTherapists();
  }, []);

  useEffect(() => {
    if (!bookDate) return;

    const open = bookDate.hour(8).minute(0).second(0);
    const close = bookDate.hour(17).minute(0).second(0);

    if (bookDate.isSame(todayStart, "day") && !afterCloseToday) {
      const rem = now.minute() % 30;
      const add = rem === 0 && now.second() === 0 ? 0 : 30 - rem;
      let rounded = now.add(add, "minute").startOf("minute");
      if (rounded.isBefore(open)) rounded = open;
      if (rounded.isAfter(close)) rounded = close;
      setMinTime(rounded);
    } else {
      setMinTime(open);
    }
  }, [bookDate]);

  const maxTime = bookDate
    ? bookDate.hour(17).minute(0).second(0)
    : dayjs().hour(17).minute(0).second(0);

  const handleReservation = async () => {
    if (!session?.accessToken) {
      alert("You must be logged in.");
      router.push("/api/auth/signin");
      return;
    }

    console.log("user reservation token: ", session?.accessToken); //debug user token

    if (!massageShop) {
      alert("Please select a massage shop.");
      return;
    }

    if (!bookDate || !dayjs(bookDate).isValid()) {
      alert("Please select a valid date.");
      return;
    }

    const date = bookDate.toISOString();
    console.log("Date to be sent:", date);

    console.log(session.user.id);

    try {
      await addReservation(
        date,
        time,
        duration,
        therapist,
        massageShop,
        massageProgram,
        session.accessToken
      );
      alert("Reservation successful!");
      router.push("/");
    } catch (error) {
      console.error("Reservation failed:", error);
      alert("Reservation failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center pt-10 px-4">
      <div className="text-xl font-semibold mb-4">Massage Reservation</div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-2xl space-y-6">
        {/* Massage Shop and Therapist */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Massage Shop
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
              value={massageShop}
              onChange={(e) => setMassageShop(e.target.value)}
            >
              <option value="" disabled hidden>
                Select a massage shop
              </option>
              {massageShops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Therapist
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
              value={therapist}
              onChange={(e) => setTherapist(e.target.value)}
            >
              <option value="" disabled hidden>
                Select therapist
              </option>
              {Therapists.map((th) => (
                <option key={th._id} value={th._id}>
                  {th.user.name}
                </option>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Massage Program
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
              value={massageProgram}
              onChange={(e) => setMassageProgram(e.target.value)}
            >
              <option value="" disabled hidden>
                Select program
              </option>
              <option value="footMassage">Foot Massage</option>
              <option value="oilMassage">Oil Massage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hour) maximum:3
            </label>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              size="small"
              inputProps={{ step: 0.5, min: 0.5, max: 3 }}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                shouldDisableDate={(date) =>
                  date.isBefore(todayStart, "day") ||
                  (afterCloseToday && date.isSame(todayStart, "day"))
                }
                value={bookDate}
                onChange={(newValue) => setBookDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    inputProps: { readOnly: true },
                    sx: {
                      height: 40,
                      "& .MuiInputBase-root": {
                        height: 40,
                      },
                      "& input": {
                        padding: "10px 14px",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={
                  bookDate && time
                    ? dayjs(`${bookDate.format("YYYY-MM-DD")}T${time}`)
                    : null
                }
                onChange={(newVal) => {
                  if (newVal) setTime(newVal.format("HH:mm"));
                }}
                minutesStep={30}
                ampm={false}
                minTime={minTime}
                maxTime={maxTime}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    inputProps: { readOnly: true },
                    sx: {
                      height: 40,
                      "& .MuiInputBase-root": { height: 40 },
                      "& input": { padding: "10px 14px" },
                    },
                  },
                }}
              />
            </LocalizationProvider>
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
