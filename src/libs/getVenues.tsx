import { resolve } from "path";

export default async function getVenues() {
    await new Promise ( (resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch("http://localhost:5000/api/v1/massageShops")
    if(!response.ok) {
        throw new Error("Failed to fetch venues")
    }

    return await response.json()
}