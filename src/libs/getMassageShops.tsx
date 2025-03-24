import { resolve } from "path";

export default async function getMassageShops() {
    await new Promise ( (resolve)=>setTimeout(resolve, 300))
    
    const response = await fetch("http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/massageShops")
    if(!response.ok) {
        throw new Error("Failed to fetch venues")
    }

    return await response.json()
}