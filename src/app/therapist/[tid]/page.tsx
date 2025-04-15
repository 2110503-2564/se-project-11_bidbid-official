'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import getTherapist from '@/libs/getTherapist'
import updateTherapist from '@/libs/updateTherapist'

export default function UpdateTherapistPage() {
  const { tid } = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [experience, setExperience] = useState<number>(0)
  const [specialities, setSpecialities] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [notAvailableDays, setNotAvailableDays] = useState<string[]>([])

  const [previousData, setPreviousData] = useState({
    gender: '',
    age: '',
    experience: '',
    specialities: '',
    licenseNumber: '',
  })

  console.log('token:', session?.accessToken);
  
  useEffect(() => {
    const fetchTherapist = async () => {
      if (!session?.accessToken || !tid) return

      try {
        const data = await getTherapist(tid as string, session.accessToken);

        setGender(data.gender)
        setAge(data.age)
        setExperience(data.experience)
        setSpecialities(data.specialities)
        setLicenseNumber(data.licenseNumber)
        setNotAvailableDays(data.notAvailableDays || [])

        setPreviousData({
          gender: data.gender,
          age: data.age,
          experience: String(data.experience),
          specialities: data.specialities,
          licenseNumber: data.licenseNumber,
        })
      } catch (err) {
        console.error('Error fetching therapist:', err)
        alert('Failed to fetch therapist profile')
        router.push('/therapist/profile')
      }
    }

    fetchTherapist()
  }, [tid, session])

  const handleUpdate = async () => {
    if (!session?.accessToken) return

    try {
      await updateTherapist(
        tid as string,
        {
          gender,
          age,
          experience,
          specialities,
          licenseNumber,
          notAvailableDays,
        },
        session.accessToken
      )
      alert('Therapist profile updated successfully')
      router.push(`/therapist/${tid}`)
    } catch (err) {
      console.error('Update error:', err)
      alert('Failed to update therapist profile')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Therapist Profile</h1>

      <div className="text-md text-gray-700 mb-3">
        <p>Previous Gender: <span className="font-semibold">{previousData.gender}</span></p>
        <p>Previous Age: <span className="font-semibold">{previousData.age}</span></p>
        <p>Previous Experience: <span className="font-semibold">{previousData.experience} year(s)</span></p>
        <p>Previous Specialities: <span className="font-semibold">{previousData.specialities}</span></p>
        <p>Previous License Number: <span className="font-semibold">{previousData.licenseNumber}</span></p>
      </div>

      <div className="mb-4">
        <label className="block mb-1">New Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border px-2 py-1 rounded">
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">New Age</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">New Experience (Years)</label>
        <input type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} className="w-full border px-2 py-1 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">New Specialities</label>
        <input type="text" value={specialities} onChange={(e) => setSpecialities(e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">New License Number</label>
        <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="w-full border px-2 py-1 rounded" />
      </div>

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 active:scale-95"
      >
        Confirm Update
      </button>
    </div>
  )
} 
