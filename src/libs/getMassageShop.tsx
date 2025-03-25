export default async function getMassageShop(id:string){
    const response = await fetch(`http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/massageShops/${id}`)
    if(!response.ok) {
        throw new Error("Failed to fetch cars")
    }
    
    return await response.json()
}