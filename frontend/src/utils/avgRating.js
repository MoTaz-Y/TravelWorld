const calculateAvgRating = (reviews) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return { avgRating: 0, totalRating: 0 };
  }

  const totalRating = reviews.reduce((acc, review) => {
    const rating = Number(review.rating) || 0;
    return acc + rating;
  }, 0);

  const avgRating =
    totalRating === 0 ? 0 : (totalRating / reviews.length).toFixed(1);

  return { avgRating: Number(avgRating), totalRating };
};

export default calculateAvgRating;
