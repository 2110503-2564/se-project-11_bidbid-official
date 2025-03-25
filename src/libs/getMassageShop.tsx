export default async function getMassageShop(id:string){
    const response = await fetch(`https://backend-may-i-scan.vercel.app/api/v1/massageShops/${id}`)
    if(!response.ok) {
        throw new Error("Failed to fetch cars")
    }
    
    return await response.json()
}