export default async function getRejectedTherapists() {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${baseUrl}/api/v1/therapists/rejected`);
    if (!res.ok) throw new Error("Failed to fetch rejected therapists");
    const data = await res.json();
    console.log(data);
    return data;
  }
  