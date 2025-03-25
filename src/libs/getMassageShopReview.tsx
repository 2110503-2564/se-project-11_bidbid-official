const getMassageShopReview = async (mid: string) => {
    const res = await fetch(
      `https://backend-may-i-scan.vercel.app/api/v1/massageShops/${mid}/reviews`
    )
  
    if (!res.ok) {
      throw new Error('Failed to fetch reviews')
    }
  
    return res.json()
  }
  
  export default getMassageShopReview
  