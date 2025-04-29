export default async function getRejectedTherapists(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${baseUrl}/api/v1/therapists/rejected`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch rejected therapists");
  const data = await res.json();
  console.log(data);
  return data;
}
