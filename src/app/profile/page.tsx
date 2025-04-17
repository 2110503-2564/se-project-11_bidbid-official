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

  const renderTherapistCard = (therapist: any, showVerifyButton = false) => (
    <div key={therapist._id} className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto">
      <p><strong>Name:</strong> {therapist.user?.name}</p>
      <p><strong>Gender:</strong> {therapist.gender}</p>
      <p><strong>Age :</strong> {therapist.age}</p>
      <p><strong>Years of experience:</strong> {therapist.experience}</p>
      <p><strong>Specialities:</strong> {therapist.specialities}</p>
      <p><strong>MassageShop:</strong> {therapist.workingInfo?.[0]?.massageShop_name}</p>
      <p><strong>License Number:</strong> {therapist.licenseNumber}</p>
      <p><strong>Unavailable Days:</strong> {therapist.notAvailableDays?.join(', ')}</p>

      </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-10 px-40">
      {/* Verified Therapists */}
      <section>
        <div className="flex items-center gap-2 mb-4 ">
        </div>
        {verifiedTherapists.map((therapist) => renderTherapistCard(therapist))}
      </section>
    </div>
  );
}
