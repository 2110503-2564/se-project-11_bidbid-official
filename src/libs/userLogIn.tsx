export default async function userLogin(userEmail:string, userPassword:string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${baseUrl}/api/v1/auth/login` , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:  JSON.stringify({
            email: userEmail, 
            password: userPassword,
        }),
    })

    if(!response.ok) {
        throw new Error("Failed to log-in")
    }

    // return await response.json()

    const data = await response.json();

    return {
        id: data.id,      
        name: data.name,
        email: data.email,
        role: data.role,
        token: data.token
    };

}