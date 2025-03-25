const getMassageShopReview = async (mid: string) => {
    const res = await fetch(
      `http://massageshop-mayiscan-env.eba-ghuryipb.us-east-1.elasticbeanstalk.com/api/v1/massageShops/${mid}/reviews`
    )
  
    if (!res.ok) {
      throw new Error('Failed to fetch reviews')
    }
  
    return res.json()
  }
  
  export default getMassageShopReview
  