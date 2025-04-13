export default async function getUserProfile(token:string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const response = await fetch("https://backend-may-i-scan.vercel.app/api/v1/auth/me" , {
    const response = await fetch(`${baseUrl}/api/v1/auth/me` , {
        method: "GET",
        headers: {
            authorization: `Bearer ${token}` ,
        },
    })

    if(!response.ok) {
        throw new Error("Failed to fetch user profile")
    }
    return await response.json()
}