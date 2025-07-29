const bcrypt = require('bcryptjs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const httpStatusText = require('../utils/httpStatusText');

const comparePassword = catchAsync(async (password, hashedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordCorrect) {
    return next(
      new AppError('Incorrect password', 400, httpStatusText.BAD_REQUEST)
    );
  }
});

module.exports = comparePassword;
