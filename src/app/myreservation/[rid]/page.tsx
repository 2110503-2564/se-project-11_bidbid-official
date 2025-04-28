"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Select, MenuItem, Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import getMassageShops from "@/libs/getMassageShops";
import getReservation from "@/libs/getReservation";
import updateReservation from "@/libs/updateReservation";

export default function UpdateReservationPage() {
  const { rid } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [massageShopId, setMassageShopId] = useState("");
  const [reservationDate, setReservationDate] = useState<Dayjs | null>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [previousShop, setPreviousShop] = useState("");
  const [previousDate, setPreviousDate] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!rid || !session?.accessToken) return;

        const { reservation, formattedDate, readableDate } =
          await getReservation(rid as string, session.accessToken);

        setPreviousShop(reservation.massageShop.name);
        setPreviousDate(
          dayjs(reservation.reservationDate).format("YYYY-MM-DD")
        );
        setMassageShopId(reservation.massageShop._id);
        setReservationDate(dayjs(reservation.reservationDate));
      } catch (err) {
        console.error("Error fetching reservation:", err);
      }
    };

    const fetchShops = async () => {
      try {
        const data = await getMassageShops();
        setShops(data.data || []);
      } catch (err) {
        console.error("Error fetching shops:", err);
      }
    };

    if (session?.accessToken) {
      fetchReservation();
      fetchShops();
    }
  }, [session, rid]);

  const handleUpdate = async () => {
    if (!reservationDate || !massageShopId || !session?.accessToken) return;

    try {
      await updateReservation(
        String(rid),
        reservationDate.toISOString(),
        massageShopId,
        session.accessToken
      );
      alert("Reservation updated successfully");
      router.push("/myreservation");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update reservation");
    }

    // try {
    //   const res = await fetch(`http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/reservations/${rid}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${session.accessToken}`,
    //     },
    //     body: JSON.stringify({
    //       reservationDate: reservationDate.toISOString(),
    //       massageShop: massageShopId,
    //     }),
    //   })

    //   if (!res.ok) {
    //     throw new Error('Failed to update reservation')
    //   }

    //   alert('Reservation updated successfully')
    //   router.push('/myreservation')
    // } catch (err) {
    //   console.error('Update error:', err)
    //   alert('Failed to update reservation')
    // }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Reservation</h1>

      <div className="mt-5 text-md text-gray-700">
        <p>
          Previous date: <span className="font-semibold">{previousDate}</span>
        </p>
      </div>

      <div className="mb-5 mt-2 text-md text-gray-700">
        <p>
          Previous massage shop:{" "}
          <span className="font-semibold">{previousShop}</span>
        </p>
      </div>

      <div className="mb-5 mt-7">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="New Reservation Date"
            disablePast
            value={reservationDate}
            onChange={(value) => setReservationDate(value)}
            className="bg-white w-full"
          />
        </LocalizationProvider>
      </div>

      <div className="mb-5">
        <Select
          value={massageShopId}
          onChange={(e) => setMassageShopId(e.target.value)}
          fullWidth
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select New Massage Shop
          </MenuItem>
          {shops.map((shop) => (
            <MenuItem key={shop._id} value={shop._id}>
              {shop.name}
            </MenuItem>
          ))}
        </Select>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded 
        hover:bg-green-700 active:bg-green-700 active:scale-95"
      >
        Confirm Update
      </button>
    </div>
  );
}
