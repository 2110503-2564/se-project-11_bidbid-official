'use client'

import { useEffect, useState } from 'react';
import getPendingTherapists from '@/libs/getPendingTherapist';
import getVerifiedTherapists from '@/libs/getVerifiedTherapist';
import verifyTherapist from '@/libs/verifyTherapist';
import rejectTherapist from '@/libs/rejectTherapist';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TherapistListPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [verifiedTherapists, setVerifiedTherapists] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchTherapists = async () => {
      try {
        const verified = await getVerifiedTherapists(session.accessToken);

        setVerifiedTherapists(verified.therapists);
      } catch (error) {
        console.error('Error fetching therapists:', error);
      }
    };

    fetchTherapists();
  }, [session]);

  const renderTherapistCard = (therapist: any) => (
    <div
      key={therapist._id}
      className="group bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative"
    >
      {/* Always visible content */}
      <p><strong>Name:</strong> {therapist.user?.name}</p>
      <p><strong>Specialities:</strong> {therapist.specialities}</p>
  
      {/* Hover-only details */}
      <div className="mt-3 space-y-1 max-h-0 overflow-hidden opacity-0 group-hover:max-h-96 group-hover:opacity-100 transition-all duration-300">
        <p><strong>Gender:</strong> {therapist.gender}</p>
        <p><strong>Age:</strong> {therapist.age}</p>
        <p><strong>Years of experience:</strong> {therapist.experience}</p>
        <p><strong>MassageShop:</strong> {therapist.workingInfo?.[0]?.massageShop_name}</p>
        <p><strong>License Number:</strong> {therapist.licenseNumber}</p>
        <p><strong>Unavailable Days:</strong> {therapist.notAvailableDays?.join(', ')}</p>
      </div>
  
      {/* Arrow Down - visible by default, fades on hover */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400 transition-opacity duration-300 group-hover:opacity-0">
        ▼
      </div>
    </div>
  );
  
  
  
  

  return (
    <div className="min-h-screen bg-gray-100 p-10 px-40">
      {/* Verified Therapists */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
        </div>
        {verifiedTherapists.map((therapist) => renderTherapistCard(therapist))}
      </section>
    </div>
  );
}
