const validateMongodbId = (id) => {
  console.log(typeof id);
  const isValid = mongoose.Types.ObjectId.isValid(id);
  console.log(isValid);
  if (!isValid) throw new Error('User not found');
};
export default validateMongodbId;
