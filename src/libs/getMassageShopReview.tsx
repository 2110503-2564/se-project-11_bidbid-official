const getMassageShopReview = async (mid: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(
      `${baseUrl}/api/v1/massageShops/${mid}/reviews`
    )
  
    if (!res.ok) {
      throw new Error('Failed to fetch reviews')
    }
  
    return res.json()
  }
  
  export default getMassageShopReview
  