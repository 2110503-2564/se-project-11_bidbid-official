'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import getTherapistReservations from '@/libs/getTherapistReservations';

interface ScheduleItem {
  _id: string;
  userName: string;
  massageShopName: string;
  massageProgram: string;
  duration: number;
  date: string; // "DD/MM/YYYY"
  time: string; // "HH:mm"
}

export default function MySchedulePage() {
  const { data: session, status } = useSession();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !session.accessToken) return;

    getTherapistReservations(session.accessToken)
      .then((data) => {
        // map API → UI shape
        const formatted = data.map((r) => ({
          _id: r._id,
          userName: r.user.name,
          massageShopName: r.massageShop.name,
          massageProgram: r.massageProgram,
          duration: r.duration,
          date: dayjs(r.date).format('DD/MM/YYYY'),
          time: r.time,
        }));

        // manual numeric sort: first by date (Y/M/D), then by time (H:m)
        formatted.sort((a, b) => {
          // parse dates
          const [d1, m1, y1] = a.date.split('/').map(Number);
          const [d2, m2, y2] = b.date.split('/').map(Number);
          if (y1 !== y2) return y1 - y2;
          if (m1 !== m2) return m1 - m2;
          if (d1 !== d2) return d1 - d2;
          // same date → parse times
          const [h1, min1] = a.time.split(':').map(Number);
          const [h2, min2] = b.time.split(':').map(Number);
          if (h1 !== h2) return h1 - h2;
          return min1 - min2;
        });

        setSchedule(formatted);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [session, status]);

  if (status === 'loading') return <p>Loading schedule…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  // group by formatted date; object keys preserve insertion order
  const byDate = schedule.reduce<Record<string, ScheduleItem[]>>((acc, item) => {
    (acc[item.date] ||= []).push(item);
    return acc;
  }, {});

  return (
    <div className="p-10 px-60 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">My Schedule</h1>

      {Object.entries(byDate).map(([date, items]) => (
        <section key={date} className="mb-8">
          <h2 className="flex items-center text-xl font-semibold mb-2">
            <span className="inline-block bg-black text-white rounded-full w-4 h-4 mr-2" />
            {date}
          </h2>
          <div className="space-y-4">
            {items.map((i) => (
              <div
                key={i._id}
                className="border rounded-lg p-6 leading-7 shadow-sm bg-white"
              >
                <p>
                  <strong>Name:</strong> {i.userName}
                </p>
                <p>
                  <strong>Massage Shop:</strong> {i.massageShopName}
                </p>
                <p>
                  <strong>Program:</strong> {i.massageProgram}
                </p>
                <p>
                  <strong>Duration (hour):</strong> {i.duration}
                </p>
                <p>
                  <strong>Date:</strong> {i.date}
                </p>
                <p>
                  <strong>Time:</strong> {i.time}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {schedule.length === 0 && <p>No appointments found.</p>}
    </div>
  );
}
