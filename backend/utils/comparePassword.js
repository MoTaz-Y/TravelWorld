import bcrypt from 'bcryptjs';
import AppError from '../utils/appError.js';
import catchAsync from '../middleware/catchAsync.js';
import httpStatusText from '../utils/httpStatusText.js';

const comparePassword = catchAsync(async (password, hashedPassword) => {
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordCorrect) {
    return next(
      new AppError('Incorrect password', 400, httpStatusText.BAD_REQUEST)
    );
  }
});

export default comparePassword;
