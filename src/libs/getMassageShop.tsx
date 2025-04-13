export default async function getMassageShop(id:string){
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${baseUrl}/api/v1/massageShops/${id}`)
    if(!response.ok) {
        throw new Error("Failed to fetch cars")
    }
    
    return await response.json()
}