export default async function getUserProfile(token:string) {

    const response = await fetch("http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/auth/me" , {
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