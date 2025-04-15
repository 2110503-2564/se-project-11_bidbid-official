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
  const [pendingTherapists, setPendingTherapists] = useState<any[]>([]);
  const [verifiedTherapists, setVerifiedTherapists] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchTherapists = async () => {
      try {
        const pending = await getPendingTherapists(session.accessToken);
        const verified = await getVerifiedTherapists(session.accessToken);

        setPendingTherapists(pending);
        setVerifiedTherapists(verified);
      } catch (error) {
        console.error('Error fetching therapists:', error);
      }
    };

    fetchTherapists();
  }, [session]);

  const handleVerify = async (id: string) => {
    if (!session?.accessToken) return;

    try {
      await verifyTherapist(id, session.accessToken);
      const updatedPending = pendingTherapists.filter(t => t._id !== id);
      const verifiedTherapist = pendingTherapists.find(t => t._id === id);

      if (verifiedTherapist) {
        setVerifiedTherapists([...verifiedTherapists, { ...verifiedTherapist, state: 'verified' }]);
      }
      setPendingTherapists(updatedPending);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleReject = async (id: string) => {
    if (!session?.accessToken) return;
  
    try {
      await rejectTherapist(id, session.accessToken);
      const updatedPending = pendingTherapists.filter(t => t._id !== id);
      setPendingTherapists(updatedPending);
      alert("Therapist rejected successfully.");
    } catch (error) {
      console.error('Rejection failed:', error);
      alert("Failed to reject therapist.");
    }
  };

  const renderTherapistCard = (therapist: any, showVerifyButton = false) => (
    <div key={therapist._id} className="bg-white rounded-lg p-5 shadow-md mb-6">
      <p><strong>Name:</strong> {therapist.user?.name}</p>
      <p><strong>Gender:</strong> {therapist.gender}</p>
      <p><strong>Age :</strong> {therapist.age}</p>
      <p><strong>Years of experience:</strong> {therapist.experience}</p>
      <p><strong>Specialities:</strong> {therapist.specialities}</p>
      <p><strong>MassageShop:</strong> {therapist.workingInfo?.[0]?.massageShop_name}</p>
      <p><strong>License Number:</strong> {therapist.licenseNumber}</p>
      <p><strong>Unavailable Days:</strong> {therapist.notAvailableDays?.join(', ')}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.push(`/therapist/${therapist._id}`)}
        >
          Update Profile
        </button>

        {showVerifyButton && (
          <>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => {
                const confirmed = window.confirm("Are you sure you want to verify this therapist?");
                if (confirmed) {
                  handleVerify(therapist._id);
                }
              }}
            >
              Verify
            </button>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                const confirmed = window.confirm("Are you sure you want to reject this therapist?");
                if (confirmed) {
                  handleReject(therapist._id);
                }
              }}
            >
              Reject
            </button>
          </>
        )}


        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Delete Profile
        </button>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-10 px-40">
      {/* Pending Therapists */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>
          <h2 className="text-3xl font-bold">Pending</h2>
        </div>
        {pendingTherapists.map((therapist) => renderTherapistCard(therapist, true))}
      </section>

      {/* Verified Therapists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          <h2 className="text-3xl font-bold">Verified</h2>
        </div>
        {verifiedTherapists.map((therapist) => renderTherapistCard(therapist))}
      </section>
    </div>
  );
}
