'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import getMe from '@/libs/getMe'

type Therapist = {
  _id: string
  gender: string
  age: string
  experience: number
  specialities: string
  licenseNumber: string
  state: string
  workingInfo: {
    massageShopID: string
    massageShop_name: string
  }[]
  notAvailableDays: string[]
}

type User = {
  name: string
  email: string
  phoneNumber: string
}

export default function TherapistProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.accessToken) return;
    
      try {
        const data = await getMe(session.accessToken);
        setTherapist(data.therapist);
        setUser(data.user);
      } catch (err) {
        alert((err as Error).message);
        router.push('/');
      }

      console.log('Therapist:', therapist)
      console.log('User:', user)
    };

    if (session?.user?.role === 'therapist') {
      fetchProfile()
    } else if (session && session.user?.role !== 'therapist') {
      alert('You are not authorized to view this page.')
      router.push('/')
    }
  }, [session])

  if (status === 'loading' || !therapist || !user) {
    return <div className="p-10 text-center text-gray-500">Loading profile...</div>
  }

  return (
    <div className="min-h-[calc(100vh-50px)] bg-gray-100 flex justify-center items-start pt-16 pb-4">
      <div className="bg-white px-20 py-10 rounded-xl shadow-md w-full max-w-3xl text-left">
        {/* Status */}
        <div className="flex items-center mb-6">
            <div
                className={`h-3 w-3 rounded-full mr-2 ${
                therapist.state === 'verified'
                    ? 'bg-green-500'
                    : therapist.state === 'rejected'
                    ? 'bg-red-500'
                    : 'bg-yellow-400'
                }`}
            ></div>
            <h1 className="text-3xl font-bold text-gray-800 capitalize">{therapist.state}</h1>
        </div>

        {/* Profile Info */}
        <div className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Gender:</strong> {therapist.gender}</p>
          <p><strong>Age:</strong> {therapist.age}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Password:</strong> ********</p>
          <p><strong>Years of experience:</strong> {therapist.experience}</p>
          <p><strong>Specialities:</strong> {therapist.specialities}</p>
          <p><strong>MassageShop:</strong> {therapist.workingInfo[0]?.massageShop_name || '-'}</p>
          <p><strong>License Number:</strong> {therapist.licenseNumber}</p>
          <p>
            <strong>Unavailable Days:</strong>{' '}
            {therapist.notAvailableDays.length > 0
                ? therapist.notAvailableDays.join(', ')
                : '-'}
          </p>

        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            // onClick={() => router.push(`/therapist/${session?.user?.id}`)}
            onClick={() => router.push(`/therapist/${therapist._id}`)}
            className="bg-blue-800 text-white px-3 py-1 rounded 
                border border-transparent
                hover:bg-white hover:border-blue-800 hover:text-blue-800 
                active:bg-white active:border-blue-800 active:text-blue-800 active:scale-95"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  )
}