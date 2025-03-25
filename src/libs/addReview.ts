const addReview = async (
    massageShopId: string,
    review: { rating: number; comment: string },
    accessToken: string // Add accessToken parameter
  ) => {
    try {
      const response = await fetch(`https://backend-may-i-scan.vercel.app/api/v1/massageShops/${massageShopId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(review),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add review');
      }
  
      return await response.json(); // Return the response data
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };
  
  export default addReview;