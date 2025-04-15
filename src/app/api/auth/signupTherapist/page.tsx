'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type MassageShop = {
  _id: string
  name: string
}

export default function TherapistSignUpPage() {

  const [massageShops, setMassageShops] = useState<MassageShop[]>([])
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Female',
    age : '',
    phoneNumber: '',
    email: '',
    password: '',
    experience: '',
    specialities: '',
    massageShop_name: '',
    massageShopID: '',
    licenseNumber: '',
    notAvailableDays: [] as string[],
  })

  useEffect(() => {
    const fetchMassageShops = async () => {
      try {
        const res = await fetch('https://backend-may-i-scan.vercel.app/api/v1/massageShops')
        const data = await res.json()

        const shops = Array.isArray(data.data) ? data.data : []
        setMassageShops(shops)
      } catch (err) {
        console.error("Error fetching", err)
      }
    }

    fetchMassageShops()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (day: string) => {
    setFormData(prev => {
      const updated = prev.notAvailableDays.includes(day)
        ? prev.notAvailableDays.filter(d => d !== day)
        : [...prev.notAvailableDays, day]
      return { ...prev, notAvailableDays: updated }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          workingInfo: [{
            massageShopID: formData.massageShopID,
            massageShop_name: formData.massageShop_name,
          }],
          role: 'therapist',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create account')
      }

      const result = await response.json()
      console.log('Server response:', result)
      alert('Account created successfully!')
      setFormData({
        name: '',
        gender: 'Female',
        age: '',
        phoneNumber: '',
        email: '',
        password: '',
        experience: '',
        specialities: '',
        massageShop_name: '',
        massageShopID: '',
        licenseNumber: '',
        notAvailableDays: [],
      })
      
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to create account.')
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-8">
          Sign Up for therapist
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength={10}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="XXXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                name="age"
                type="number"
                min="18"
                step="1"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of experience
            </label>
            <input
              name="experience"
              type="number"
              min="0"
              step="1"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="answer in year at least 0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialities
            </label>
            <input
              name="specialities"
              type="text"
              value={formData.specialities}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div >
          <label className="block text-sm font-medium text-gray-700 mb-1">
                MassageShop
              </label>
              <select
                name="massageShopID"
                value={formData.massageShopID}
                onChange={(e) => {
                  const selectedId = e.target.value
                  const selectedShop = massageShops.find(shop => shop._id === selectedId)
                  setFormData(prev => ({
                    ...prev,
                    massageShopID: selectedId,
                    massageShop_name: selectedShop?.name || ''
                  }))
                }}
                required
                className="border px-2 py-1 rounded w-full"
              >
                {/* ✅ option นี้ใช้เป็น placeholder และเลือกไม่ได้ */}
                <option value="" disabled hidden>
                  Select a massage shop
                </option>

                {massageShops.map(shop => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name}
                  </option>
                ))}
              </select>

          </div>

          <div >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              name="licenseNumber"
              type="text"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Check in the checkbox for your Not Available Day
            </p>
            <div className="flex flex-wrap gap-4">
              {days.map(day => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.notAvailableDays.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className="text-sm text-gray-800">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
            >
              Create an Account
            </button>
          </div>

          <div className="md:col-span-2 text-center text-sm text-gray-700">
            Are you a customer?{' '}
            <Link href="/api/auth/signup" className="text-blue-700 hover:underline">
              Sign Up for customer here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
