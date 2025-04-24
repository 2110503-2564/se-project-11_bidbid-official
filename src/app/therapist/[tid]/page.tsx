'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import getTherapist from '@/libs/getTherapist'
import getMe from '@/libs/getMe'
import updateTherapist from '@/libs/updateTherapist'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function UpdateTherapistPage() {
  const { tid } = useParams()
  const router = useRouter()
  const { data: session } = useSession()

  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('********') // static for now
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [experience, setExperience] = useState<number>(0)
  const [specialities, setSpecialities] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [massageShop, setMassageShop] = useState('Serenity Spa')
  const [notAvailableDays, setNotAvailableDays] = useState<string[]>([])
  const [status, setStatus] = useState('')

  const [previousData, setPreviousData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  })

  const role = session?.user?.role;
  const isAdmin = role === 'admin';

  useEffect(() => {
    const fetchTherapist = async () => {
      if (!session?.accessToken || !tid) return

      try {
        const data = await getTherapist(tid as string, session.accessToken)
        // const data = await getMe(session.accessToken)

        setName(data.user?.name || '')
        setPhoneNumber(data.user?.phoneNumber || '')
        setEmail(data.user?.email || '')
        setGender(data.gender)
        setAge(data.age)
        setExperience(data.experience)
        setSpecialities(data.specialities)
        setLicenseNumber(data.licenseNumber)
        setNotAvailableDays(data.notAvailableDays || [])
        setStatus(data.state || '')

        setPreviousData({
          name: data.user?.name || '',
          phoneNumber: data.user?.phoneNumber || '',
          email: data.user?.email || '',
        })
      } catch (err) {
        console.error('Error fetching therapist:', err)
        alert('Failed to fetch therapist profile')
        router.push('/therapist/profile')
      }
    }

    fetchTherapist()
  }, [tid, session])

  const handleCheckboxChange = (day: string) => {
    setNotAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  // const handleUpdate = async () => {
  //   if (!session?.accessToken) return

  //   try {
  //     const newStatus = !isAdmin && status === 'rejected' ? 'pending' : status;

  //     await updateTherapist(
  //       tid as string,
  //       {
  //         gender,
  //         age,
  //         experience,
  //         specialities,
  //         licenseNumber,
  //         notAvailableDays,
  //         state: newStatus, // include status in the update
  //       },
  //       session.accessToken
  //     )

  //     alert('Therapist profile updated successfully')
  //     // router.push(`/therapist/profile`)
  //     if (isAdmin) {
  //       router.push('/therapist');
  //     } else {
  //       router.push('/therapist/profile');
  //     }
  //   } catch (err) {
  //     console.error('Update error:', err)
  //     alert('Failed to update therapist profile')
  //   }
  // }

  const handleUpdate = async () => {
    if (!session?.accessToken) return;
  
    try {
      const updatePayload: any = {
        name,
        phoneNumber,
        email,
        gender,
        age,
        experience,
        specialities,
        licenseNumber,
        notAvailableDays,
      };
  
      if (!isAdmin && status === 'rejected') {
        updatePayload.state = 'pending';
      }
  
      if (isAdmin) {
        updatePayload.state = status;
      }
  
      await updateTherapist(
        tid as string,
        updatePayload,
        session.accessToken
      );
  
      console.log("call update");

      alert('Therapist profile updated successfully');
  
      if (isAdmin) {
        router.push('/therapist');
      } else {
        router.push('/therapist/profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update therapist profile');
    }
  };
  
  

  // const isEditable = status !== 'verified'
  const isEditable = true; // all general fields editable
  const canEditRestrictedFields = isAdmin || status !== 'verified';
  const canEditLicense = status !== 'verified';

  return (
    <div className="min-h-screen bg-gray-200 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md px-10 py-8">
        <div className="flex items-center mb-6">
          <div className={`h-3 w-3 rounded-full mr-2 ${
            status === 'verified'
              ? 'bg-green-500'
              : status === 'rejected'
              ? 'bg-red-500'
              : 'bg-yellow-400'
          }`} />
          <h1 className="text-3xl font-bold capitalize">{status}</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={previousData.name} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label>Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label>Phone Number</label>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={previousData.phoneNumber} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border px-3 py-2 rounded">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={previousData.email} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="text-gray-400">Password</label>
            <input value={password} disabled className="w-full border px-3 py-2 rounded bg-gray-200" />
          </div>
          <div>
            <label>Years of experience</label>
            <input type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label>Specialities</label>
            <input value={specialities} onChange={(e) => setSpecialities(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          {/* <div>
            <label className={isEditable ? '' : 'text-gray-400'}>MassageShop</label>
            <select
              value={massageShop}
              onChange={(e) => setMassageShop(e.target.value)}
              disabled={!isEditable}
              className={`w-full border px-3 py-2 rounded ${!isEditable ? 'bg-gray-200' : ''}`}
            >
              <option value="Serenity Spa">Serenity Spa</option>
              <option value="Another Spa">Another Spa</option>
            </select>
          </div> */}

          <div>
            <label className={canEditRestrictedFields ? '' : 'text-gray-400'}>MassageShop</label>
            <select
              value={massageShop}
              onChange={(e) => setMassageShop(e.target.value)}
              disabled={!canEditRestrictedFields}
              className={`w-full border px-3 py-2 rounded ${!canEditRestrictedFields ? 'bg-gray-200' : ''}`}
            >
              <option value="Serenity Spa">Serenity Spa</option>
              <option value="Another Spa">Another Spa</option>
            </select>
          </div>

          <div>
            <label className={canEditLicense ? '' : 'text-gray-400'}>License Number</label>
            <input
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              disabled={!canEditLicense}
              className={`w-full border px-3 py-2 rounded ${!canEditLicense ? 'bg-gray-200' : ''}`}
            />
          </div>

          <div className="col-span-2">
            <label className={`block font-medium mb-1 ${!isAdmin ? 'text-gray-400' : ''}`}>
              State
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!isAdmin}
              className={`w-full border px-3 py-2 rounded ${!isAdmin ? 'bg-gray-200 text-gray-500' : ''}`}
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

        </div>

        <div className="mt-6">
          <label className={`block mb-2 ${!canEditRestrictedFields ? 'text-gray-400' : ''}`}>Select Not Available Days</label>
          <div className="grid grid-cols-4 gap-2">
            {weekdays.map((day) => (
              <label key={day} className={`flex items-center space-x-2 ${!canEditRestrictedFields ? 'text-gray-400' : ''}`}>
                <input
                  type="checkbox"
                  checked={notAvailableDays.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                  disabled={!canEditRestrictedFields}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>


        <div className="mt-6 text-center">
          <button
            onClick={handleUpdate}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-white hover:text-blue-700 border border-transparent hover:border-blue-700 transition-all"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  )
}