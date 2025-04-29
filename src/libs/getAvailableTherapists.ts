export default async function getAvailableTherapists(date:string, day:string, startTime:string, endTime:string, shopId:string){
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${baseUrl}/api/v1/therapists/available?date=${date}&day=${day}&startTime=${startTime}&endTime=${endTime}&massageShop=${shopId}`)
    console.log("Response from getAvailableTherapists:", response); // Debugging line
    if(!response.ok) {
        throw new Error("Failed to fetch available therapists")
    }
    const data = await response.json();
    console.log("URL",data);
    return await data;
}