const catchAsync = (fn) => {
  console.log(fn);
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
export default catchAsync;
