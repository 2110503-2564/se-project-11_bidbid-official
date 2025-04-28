"use client";

import { useEffect, useState } from "react";
import getPendingTherapists from "@/libs/getPendingTherapist";
import getVerifiedTherapists from "@/libs/getVerifiedTherapist";
import verifyTherapist from "@/libs/verifyTherapist";
import rejectTherapist from "@/libs/rejectTherapist"; // Ensure this function exists and works
import removeTherapist from "@/libs/removeTherapist";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TherapistItem, TherapistJson } from "../../../interface";
import getRejectedTherapists from "@/libs/getRejectedTherapists";

export default function TherapistListPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [pendingTherapists, setPendingTherapists] = useState<any[]>([]);
  const [verifiedTherapists, setVerifiedTherapists] = useState<any[]>([]);
  const [rejectedTherapists, setRejectedTherapists] = useState<TherapistItem[]>(
    []
  );

  useEffect(() => {
    const fetchRejectedTherapists = async () => {
      var rejected = await getRejectedTherapists();
      setRejectedTherapists(rejected.therapists);
    };
    fetchRejectedTherapists();
  }, []);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchTherapists = async () => {
      try {
        const pending = await getPendingTherapists(session.accessToken);
        const verified = await getVerifiedTherapists();

        setPendingTherapists(pending);
        setVerifiedTherapists(verified.therapists);
      } catch (error) {
        console.error("Error fetching therapists:", error);
      }
    };

    fetchTherapists();
  }, [session]);

  const handleVerify = async (id: string) => {
    if (!session?.accessToken) return;
    const confirmed = window.confirm("Are you sure you want to verify this therapist?")
    if (!confirmed) return;

    try {
      await verifyTherapist(id, session.accessToken);
      const updatedPending = pendingTherapists.filter((t) => t._id !== id);
      const verifiedTherapist = pendingTherapists.find((t) => t._id === id);

      if (verifiedTherapist) {
        setVerifiedTherapists([
          ...verifiedTherapists,
          { ...verifiedTherapist, state: "verified" },
        ]);
      }
      setPendingTherapists(updatedPending);
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleReject = async (id: string) => {
    if (!session?.accessToken) return;
  
    const comment = window.prompt("Please provide a reason for rejection:");
    if(!comment) return;

    const therapist = pendingTherapists.find((t) => t._id === id);
  
    if (!therapist) {
      alert("Therapist not found!");
      return;
    }
  
    try {
      await rejectTherapist(id, comment || "No reason provided", session.accessToken);
  
      const updatedPending = pendingTherapists.filter((t) => t._id !== id);
      setPendingTherapists(updatedPending);
  
      const rejected = await getRejectedTherapists();
      setRejectedTherapists(rejected.therapists);
  
      alert("Therapist rejected successfully.");
    } catch (error) {
      console.error("Rejection failed:", error);
      alert("Failed to reject therapist.");
    }
  };
  

  const handleRemove = async (id: string) => {
    if (!session?.accessToken) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this therapist?"
    );
    if (!confirmed) return;

    try {
      await removeTherapist(id, session.accessToken);

      const updatedPending = pendingTherapists.filter((t) => t._id !== id);
      const updatedVerified = verifiedTherapists.filter((t) => t._id !== id);

      setPendingTherapists(updatedPending);
      setVerifiedTherapists(updatedVerified);

      alert("Therapist removed successfully.");
    } catch (error) {
      console.error("Remove failed:", error);
      alert("Failed to remove therapist.");
    }
  };

  const renderTherapistCard = (
    therapist: any,
    showVerifyButton = false,
    showRejectButton = false
  ) => (
    <div key={therapist._id} className="bg-white rounded-lg p-5 shadow-md mb-6">
      <p>
        <strong>Name:</strong> {therapist.user?.name}
      </p>
      <p>
        <strong>Gender:</strong> {therapist.gender}
      </p>
      <p>
        <strong>Age :</strong> {therapist.age}
      </p>
      <p>
        <strong>Years of experience:</strong> {therapist.experience}
      </p>
      <p>
        <strong>Specialities:</strong> {therapist.specialities}
      </p>
      <p>
        <strong>MassageShop:</strong>{" "}
        {therapist.workingInfo?.[0]?.massageShop_name}
      </p>
      <p>
        <strong>License Number:</strong> {therapist.licenseNumber}
      </p>
      <p>
        <strong>Unavailable Days:</strong>{" "}
        {therapist.notAvailableDays?.join(", ")}
      </p>
  
      {/* Show the comment if the state is 'rejected' */}
      {therapist.state === 'rejected' && therapist.comment && (
        <p className="text-red-600"><strong>Comment:</strong> {therapist.comment}</p>
      )}
  
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
              onClick={() => handleVerify(therapist._id)}
            >
              Verify
            </button>
          </>
        )}
  
        {showRejectButton && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => handleReject(therapist._id)}
          >
            Reject
          </button>
        )}
  
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={() => handleRemove(therapist._id)}
        >
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
        {pendingTherapists.map((therapist) =>
          renderTherapistCard(therapist, true, true)
        )}
      </section>

      {/* Verified Therapists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          <h2 className="text-3xl font-bold">Verified</h2>
        </div>
        {verifiedTherapists.map((therapist) => renderTherapistCard(therapist))}
      </section>

      {/* Rejected Therapists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          <h2 className="text-3xl font-bold">Rejected</h2>
        </div>
        {rejectedTherapists.map((therapist) => renderTherapistCard(therapist))}
      </section>
    </div>
  );
}
