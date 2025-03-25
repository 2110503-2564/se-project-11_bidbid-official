const getReviews = async (token: string) => {
  const res = await fetch('https://backend-may-i-scan.vercel.app/api/v1/reviews', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch reviews');
  }

  const data = await res.json();
  console.log(data);
  return data.data; // Return the reviews array
};

export default getReviews;