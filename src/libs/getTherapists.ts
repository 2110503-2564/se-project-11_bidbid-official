import { resolve } from "path";

export default async function getTherapist() {
    await new Promise ( (resolve)=>setTimeout(resolve, 300))
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${baseUrl}/api/v1/therapists`)
    if(!response.ok) {
        throw new Error("Failed to fetch therapists")
    }

    return await response.json()
}