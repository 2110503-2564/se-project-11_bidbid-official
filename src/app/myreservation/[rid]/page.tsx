'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Select, MenuItem, Button } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { useSession } from 'next-auth/react'

export default function UpdateReservationPage() {
  const { rid } = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [massageShopId, setMassageShopId] = useState('')
  const [reservationDate, setReservationDate] = useState<Dayjs | null>(null)
  const [shops, setShops] = useState<any[]>([])
  const [previousShop, setPreviousShop] = useState('')
  const [previousDate, setPreviousDate] = useState('')

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/reservations/${rid}`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) throw new Error('Failed to fetch reservation')

        const data = await res.json()
        const reservation = data.data
        setPreviousShop(reservation.massageShop.name)
        setPreviousDate(dayjs(reservation.reservationDate).format('YYYY-MM-DD'))
        setMassageShopId(reservation.massageShop._id)
        setReservationDate(dayjs(reservation.reservationDate))
      } catch (err) {
        console.error('Error fetching reservation:', err)
      }
    }

    const fetchShops = async () => {
      const res = await fetch('http://localhost:5000/api/v1/massageShops')
      const data = await res.json()
      setShops(data.data || [])
    }

    if (session?.accessToken) {
      fetchReservation()
      fetchShops()
    }
  }, [session, rid])

  const handleUpdate = async () => {
    if (!reservationDate || !massageShopId || !session?.accessToken) return

    try {
      const res = await fetch(`http://localhost:5000/api/v1/reservations/${rid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          reservationDate: reservationDate.toISOString(),
          massageShop: massageShopId,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update reservation')
      }

      alert('Reservation updated successfully')
      router.push('/myreservation')
    } catch (err) {
      console.error('Update error:', err)
      alert('Failed to update reservation')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Reservation</h1>

      <div className="mt-5 text-md text-gray-700">
        <p>Previous date: <span className="font-semibold">{previousDate}</span></p>
      </div>

      <div className="mb-5 mt-2 text-md text-gray-700">
        <p>Previous massage shop: <span className="font-semibold">{previousShop}</span></p>
      </div>

      <div className="mb-5 mt-7">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="New Reservation Date"
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
          <MenuItem value="" disabled>Select New Massage Shop</MenuItem>
          {shops.map((shop) => (
            <MenuItem key={shop._id} value={shop._id}>{shop.name}</MenuItem>
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
  )
}