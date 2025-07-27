const jwt = require('jsonwebtoken');
const config = require('config');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return next(
      appError.create('token is required', 401, httpStatusText.ERROR)
    );
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(
      appError.create('token is required', 401, httpStatusText.ERROR)
    );
  }
  try {
    // const decoded = jwt.verify(token, config.get('jwtSecret'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(appError.create('token is invalid', 401, httpStatusText.ERROR));
  }
};

module.exports = verifyToken;
