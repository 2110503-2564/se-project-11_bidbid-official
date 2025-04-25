// src/app/therapist/[tid]/schedule/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import getReservations from '@/libs/getReservations';
import dayjs from 'dayjs';

interface ScheduleItem {
  _id: string;
  userName: string;
  massageShopName: string;
  massageProgram: string;
  duration: number;
  date: string;  // YYYY-MM-DD or DD/MM/YYYY
  time: string;  // HH:mm
}

export default function TherapistSchedulePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.accessToken) return;

    // Fetch all reservations; backend will filter by therapist role
    getReservations(session.accessToken)
      .then((data: any[]) => {
        const formatted = data.map((r: any) => ({
          _id: r._id,
          userName: r.user?.name || r.userName || 'Unknown',
          massageShopName: r.massageShop.name,
          massageProgram: r.massageProgram,
          duration: r.duration,
          date: dayjs(r.date || r.reservationDate).format('DD/MM/YYYY'),
          time: dayjs(r.time || r.reservationDate).format('HH:mm'),
        }));
        setSchedule(formatted);
      })
      .catch((err: any) => setError(err.message));
  }, [session]);

  // Group by date
  const grouped: Record<string, ScheduleItem[]> = {};
  schedule.forEach((item) => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });

  return (
    <div className="px-8 py-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Schedule</h1>
        <button
          onClick={() => router.push(`/therapist/${session?.user.id}`)}
          className="text-blue-600 hover:underline"
        >
          My Profile
        </button>
      </header>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6 space-y-8">
        {Object.entries(grouped).map(([date, items]) => (
          <section key={date}>
            <div className="flex items-center text-lg font-semibold">
              <span className="mr-2">&#9679;</span> {date}
            </div>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-xl p-4 shadow-md">
                  <p><strong>Name:</strong> {item.userName}</p>
                  <p><strong>Massage Shop:</strong> {item.massageShopName}</p>
                  <p><strong>Massage Program:</strong> {item.massageProgram}</p>
                  <p><strong>Duration (hour):</strong> {item.duration}</p>
                  <p><strong>Date:</strong> {item.date}</p>
                  <p><strong>Time:</strong> {item.time}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}