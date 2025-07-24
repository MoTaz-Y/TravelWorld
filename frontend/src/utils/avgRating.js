const calculateAvgRating = (reviews) => {
  const totalRating = reviews?.reduce((acc, review) => acc + review.rating, 0);
  const avgRating =
    totalRating === 0
      ? ''
      : totalRating === 1
      ? 1
      : (totalRating / reviews?.length).toFixed(1);

  return { avgRating, totalRating };
};

export default calculateAvgRating;
