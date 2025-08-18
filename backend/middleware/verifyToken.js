import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import AppError from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.accessToken || req.header('Authorization') || req.body.token;
  if (!token) {
    return next(
      new AppError('token is required', 401, httpStatusText.BAD_REQUEST)
    );
  }
  // const token = authHeader.split(' ')[1];
  // if (!token) {
  //   return next(
  //     appError.create('token is required', 401, httpStatusText.ERROR)
  //   );
  // }
  try {
    // const decoded = jwt.verify(token, config.get('jwtSecret'));
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return next(
            new AppError('invalid token', 401, httpStatusText.BAD_REQUEST)
          );
        }
        return decoded;
      }
    );
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('invalid token', 401, httpStatusText.BAD_REQUEST));
  }
};

// verify user
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(
        new AppError('you are not authorized', 403, httpStatusText.ERROR)
      );
    }
  });
};

// verify admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(
        new AppError('you are not authorized', 403, httpStatusText.ERROR)
      );
    }
  });
};

export default { verifyToken, verifyUser, verifyAdmin };
