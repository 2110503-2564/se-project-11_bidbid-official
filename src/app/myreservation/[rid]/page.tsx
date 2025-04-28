// src/app/myreservation/[rid]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import dayjs, { Dayjs } from "dayjs";

import {
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import getReservation from "@/libs/getReservation";
import getMassageShops from "@/libs/getMassageShops";
import getVerifiedTherapists from "@/libs/getVerifiedTherapist";
import updateReservation from "@/libs/updateReservation";
import { MassageItem, TherapistItem } from "../../../../interface";

export default function UpdateReservationPage() {
  const router = useRouter();
  const params = useParams();
  const rawRid = params.rid;
  const rid = Array.isArray(rawRid) ? rawRid[0] : rawRid!;

  // Pull both `data` and `status`
  const { data: session, status } = useSession();

  const [shops, setShops] = useState<MassageItem[]>([]);
  const [therapists, setTherapists] = useState<TherapistItem[]>([]);

  const [original, setOriginal] = useState({
    date: "",
    time: "",
    duration: 0,
    massageShop: "",
    massageProgram: "",
    therapist: "",
  });

  const [bookDate, setBookDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState("08:00");
  const [duration, setDuration] = useState(0.5);
  const [shopId, setShopId] = useState("");
  const [program, setProgram] = useState("");
  const [therapistId, setTherapistId] = useState("");

  // Fetch shops & therapists once
  useEffect(() => {
    getMassageShops().then((r) => setShops(r.data));
    getVerifiedTherapists().then((r) => setTherapists(r.therapists));
  }, []);

  // Fetch the reservation **after** session is authenticated
  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const { reservation, formattedDate } = await getReservation(
          rid,
          session.accessToken
        );
        console.log("Fetched reservation:", reservation);

        // Defensive checks in case your backend shape changed:
        const d = dayjs(reservation.date);
        setOriginal({
          date: d.isValid() ? d.format("YYYY-MM-DD") : "",
          time: reservation.time || "",
          duration: reservation.duration || 0,
          massageShop: reservation.massageShop?.name || "",
          massageProgram: reservation.massageProgram || "",
          therapist: reservation.therapist?.user?.name || "",
        });

        setBookDate(d.isValid() ? d : null);
        setTime(reservation.time || "08:00");
        setDuration(reservation.duration ?? 0.5);
        setShopId(reservation.massageShop?._id || "");
        setProgram(reservation.massageProgram || "");
        setTherapistId(reservation.therapist?._id || "");
      } catch (err) {
        console.error("Error loading reservation", err);
      }
    })();
  }, [rid, status]);

  const filteredTherapists = therapists.filter((t) =>
    t.workingInfo.some((w) => w.massageShopID === shopId)
  );

  const handleUpdate = async () => {
    if (status !== "authenticated" || !bookDate) {
      router.push("/api/auth/signin");
      return;
    }
    const isoDate = `${bookDate.format("YYYY-MM-DD")}T${time}`;
    try {
      // updateReservation(id, reservationDate, massageShopId, token)
      await updateReservation(rid, isoDate, shopId, session.accessToken);
      alert("Reservation updated");
      router.push("/myreservation");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  return (
    <Box component="main" sx={{ py: 6, px: 2, bgcolor: "background.default" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Update Reservation
      </Typography>

      <Box
        sx={{
          maxWidth: 960,
          mx: "auto",
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Grid container spacing={4}>
          {/* Left panel */}
          <Grid item xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{ p: 2, bgcolor: "#f0f0f0", borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Recent Information
              </Typography>
              <Typography>Date : {original.date || "-"}</Typography>
              <Typography>Time : {original.time || "-"}</Typography>
              <Typography>
                Duration (hour) : {original.duration}
              </Typography>
              <Typography>
                Massage shop : {original.massageShop || "-"}
              </Typography>
              <Typography>
                Massage program : {original.massageProgram || "-"}
              </Typography>
              <Typography>
                Therapist : {original.therapist || "-"}
              </Typography>
            </Paper>
          </Grid>

          {/* Right form */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="New Reservation Date"
                    value={bookDate}
                    onChange={(d) => setBookDate(d)}
                    slotProps={{
                      textField: { fullWidth: true, size: "small" },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Time"
                  type="time"
                  fullWidth
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Duration (hour)"
                  type="number"
                  fullWidth
                  value={duration}
                  onChange={(e) => setDuration(+e.target.value)}
                  inputProps={{ step: 0.5, min: 0.5, max: 3 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  label="Massage Shop"
                  fullWidth
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                >
                  {shops.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  label="Massage Program"
                  fullWidth
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                >
                  <MenuItem value="footMassage">Foot Massage</MenuItem>
                  <MenuItem value="oilMassage">Oil Massage</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  label="Therapist"
                  fullWidth
                  value={therapistId}
                  onChange={(e) => setTherapistId(e.target.value)}
                >
                  {filteredTherapists.map((t) => (
                    <MenuItem key={t._id} value={t._id}>
                      {t.user.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                container
                spacing={2}
                justifyContent="flex-end"
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => router.back()}
                  >
                    Cancel Update
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleUpdate}
                  >
                    Confirm Update
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
