import { resolve } from "path";

export default async function getMassageShops() {
    await new Promise ( (resolve)=>setTimeout(resolve, 300))
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const response = await fetch("https://backend-may-i-scan.vercel.app/api/v1/massageShops")
    const response = await fetch(`${baseUrl}/api/v1/massageShops`)
    if(!response.ok) {
        throw new Error("Failed to fetch venues")
    }

    return await response.json()
}