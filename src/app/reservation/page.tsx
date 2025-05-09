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
import getAvailableTherapists from "@/libs/getAvailableTherapists";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import addReservation from "@/libs/addReservation";
import updateReservation from "@/libs/updateReservation";
import addUnavailableTimeSlot from "@/libs/addUnavailableTimeSlot";
import deleteUnavailableTimeSlot from "@/libs/deleteUnavailableTimeSlot";
import getMe from "@/libs/getMe";
import weekday from "dayjs/plugin/weekday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import CustomTimePicker from "@/components/CustomTimePicker";
dayjs.extend(weekday);
dayjs.extend(localizedFormat);
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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
      if (!bookDate || !massageShop || !time || !session?.accessToken) {
        console.log("Missing required parameters");
        return; // Ensure all required parameters and token are available
      }

      const day = dayjs(bookDate).format("dddd"); // Get the day of the week (e.g., "Monday")
      const date = bookDate.format("YYYY-MM-DD"); // Format date as YYYY-MM-DD
      const startTime = time; // Start time
      const endTime = dayjs(time, "HH:mm").add(duration, "hour").format("HH:mm"); // Calculate end time

      console.log("bookDate", bookDate.format("YYYY-MM-DD"));
      console.log("date", date);
      console.log("day", day);
      try {
        const data = await getAvailableTherapists(
          date,
          day,
          startTime,
          endTime,
          massageShop
        );
        console.log("Fetched therapists data:", data);
        setTherapists(data.data);
        console.log("Updated Therapists state:", data.data);
      } catch (error) {
        console.error("Error fetching therapists:", error);
      }
    };

    fetchTherapists();
  }, [bookDate, massageShop, time, duration]);

  // Filter therapists based on the selected massage shop
  // const filteredTherapists = allTherapists.filter(
  //   (therapist) => 
  //     therapist.workingInfo.some(
  //       (working) => working.massageShopID === massageShop
  //     )
  // );

  // Handle reservation form submission
  const handleReservation = async () => {
    if (!session?.accessToken) {
      alert("You must be logged in.");
      router.push("/api/auth/signin");
      return;
    }
  
    console.log("User reservation token: ", session?.accessToken);
  
    if (!massageShop) {
      alert("Please select a massage shop.");
      return;
    }
  
    if (!bookDate || !dayjs(bookDate).isValid()) {
      alert("Please select a valid date.");
      return;
    }
  
    const date = dayjs(bookDate).format("YYYY-MM-DD");
    const startTime = time;
    const endTime = dayjs(time, "HH:mm").add(duration, "hour").format("HH:mm");
    const day = dayjs(bookDate).format("dddd");
  
    let unavailableTimeSlotAdded = false;
  
    try {
      // Add unavailable time slot
      const unavailableTimeSlotResponse = await addUnavailableTimeSlot(
        date,
        day,
        startTime,
        endTime,
        therapist,
        session.accessToken
      );
      console.log("Response from addUnavailableTimeSlot:", unavailableTimeSlotResponse);
  
      unavailableTimeSlotAdded = true; // Mark as added
  
      // Add reservation
      const reservationResponse = await addReservation(
        date,
        time,
        duration,
        therapist,
        massageShop,
        massageProgram,
        session.accessToken
      );
      console.log("Response from addReservation:", reservationResponse);
  
      alert("Reservation successful!");
      router.push("/");
    } catch (error) {
      console.error("Reservation failed:", error);
  
      // Rollback if unavailable time slot was added
      if (unavailableTimeSlotAdded) {
        try {
          console.log("Rolling back unavailable time slot...");
          await deleteUnavailableTimeSlot(
            therapist,
            session.accessToken,
            date,
            startTime,
            endTime
          );
          console.log("Rollback successful: Unavailable time slot removed.");
        } catch (rollbackError) {
          console.error("Rollback failed:", rollbackError);
        }
      }
  
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
              {!massageShop ? (
                <option disabled>Please select a massage shop</option>
              ) : !bookDate ? (
                <option disabled>Please select date</option>
              ) : Therapists && Therapists.length > 0 ? (
                Therapists.map((th) => (
                  <option key={th._id} value={th._id}>
                    {th.user.name}
                  </option>
                ))
              ) : (
                <option disabled>No therapists available</option>
              )}
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
            <div className="h-[40px]">
              <CustomTimePicker onTimeChange={(newTime) => setTime(newTime)} />
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