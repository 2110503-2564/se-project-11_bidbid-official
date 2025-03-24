'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import getMassageShop from '@/libs/getMassageShop'

export default function MassageDetailPage({ params }: { params: { mid: string } }) {
  const router = useRouter()
  const [massage, setMassage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMassage = async () => {
      try {
        const res = await getMassageShop(params.mid)
        setMassage(res.data)
      } catch (error) {
        console.error('Failed to fetch massage shop:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMassage()
  }, [params.mid])

  if (loading) {
    return <div className="text-center p-5">Loading...</div>
  }

  if (!massage) {
    return <div className="text-center p-5 text-red-500">Massage shop not found.</div>
  }

  return (
    <main className="text-center p-5">
      <h1 className="text-lg font-medium">{massage.name}</h1>
      <div className="flex flex-row my-5">
        <Image
          src={massage.picture}
          alt="Massage Image"
          width={0}
          height={0}
          sizes="100vw"
          className="rounded-lg w-[30%]"
        />
        <div className="text-medium mx-5 text-left">
          <div className="text-medium mx-5">Name: {massage.name}</div>
          <div className="text-medium mx-5">Address: {massage.address}</div>
          <div className="text-medium mx-5">Price Range: {massage.priceRange}</div>
          <div className="text-medium mx-5">Tel: {massage.phoneNumber}</div>
          <div className="text-medium mx-5">Open Time: {massage.openTime}</div>
          <div className="text-medium mx-5">Close Time: {massage.closeTime}</div>
          <button
            onClick={() => router.push('/reservation')}
            className="mx-5 my-3 bg-blue-800 text-white px-3 py-1 rounded 
              border border-transparent
              hover:bg-white hover:border-blue-800 hover:text-blue-800 
              active:bg-white active:border-blue-800 active:text-blue-800  active:scale-95"
          >
            Reserve NOW!
          </button>
        </div>
      </div>
    </main>
  )
}
