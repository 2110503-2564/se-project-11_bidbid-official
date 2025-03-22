'use client'

import { useState, useEffect } from 'react'
import { signIn, getCsrfToken } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const router = useRouter()

  const { data: session } = useSession()
  console.log(session?.user)

  useEffect(() => {
    const fetchCsrf = async () => {
      const token = await getCsrfToken()
      if (token) setCsrfToken(token)
    }
    fetchCsrf()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      // token: user.token,
    })

    if (res?.ok) {
      router.push('/')
    } else {
      alert("Login failed.")
    }

    // try {
    //   const res = await fetch('http://localhost:5000/api/v1/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password }),
    //   })
  
    //   const data = await res.json()
  
    //   if (res.ok) {
    //     localStorage.setItem('token', data.token) // Store token
    //     alert('Login successful!')
    //     router.push('/')
    //   } else {
    //     alert(data.message || 'Login failed.')
    //   }
    // } catch (err) {
    //   alert('Error logging in')
    //   console.error(err)
    // }

  }


  return (
    <div className="h-screen bg-gray-100 flex justify-center pt-24">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md max-h-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="csrfToken" value={csrfToken} />

          <div>
            <label className="block mb-1 text-md font-medium text-gray-700">
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
            <label className="block mb-1 text-md font-medium text-gray-700">
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

          <div className="mb-1 text-sm font-medium text-gray-500 flex flex-row items-center gap-x-2">
            <span>New to Massage?</span> 
            <Link href="/api/auth/signup" className="text-blue-600 hover:underline">Create an Account</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
