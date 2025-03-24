'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import registerUser from '@/libs/register'

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // const res = await fetch('http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     name,
    //     email,
    //     password,
    //     phoneNumber,
    //     role: 'user', // Force role to be user
    //   }),
    // })

    // if (res.ok) {
    //   alert('Account created successfully!')
    //   router.push('/api/auth/signin')
    // } else {
    //   const error = await res.json()
    //   alert(error.message || 'Failed to create account.')
    // }

    try {
      await registerUser({ name, email, password, phoneNumber })
      alert('Account created successfully!')
      router.push('/api/auth/signin')
    } catch (err: any) {
      alert(err.message || 'Failed to create account.')
    }
  }

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-start pt-20">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}
