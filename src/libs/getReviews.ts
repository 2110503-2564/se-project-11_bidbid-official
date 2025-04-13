// const getReviews = async (token?: string) => {
//   const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//   const res = await fetch(`${baseUrl}/api/v1/reviews`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!res.ok) {
//     throw new Error('Failed to fetch reviews');
//   }

//   const data = await res.json();
//   console.log(data);
//   return data.data; // Return the reviews array
// };

// export default getReviews;

const getReviews = async (token?: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}/api/v1/reviews`, {
    headers,
  });

  if (!res.ok) {
    throw new Error('Failed to fetch reviews');
  }

  const data = await res.json();
  console.log(data);
  return data.data; // Return the reviews array
};

export default getReviews;
