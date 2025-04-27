export default async function getVerifiedTherapists() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${baseUrl}/api/v1/therapists/verified`);
  if (!res.ok) throw new Error("Failed to fetch verified therapists");
  const data = await res.json();
  console.log(data);
  return data;
}
