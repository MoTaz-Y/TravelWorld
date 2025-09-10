import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// const config = require('config');
// module.exports = function (req, res, next) {
//   const token = req.header('x-auth-token');
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }
//   try {
//     const decoded = jwt.verify(token, config.get('jwtSecret'));
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };
dotenv.config();
// generate token
export const generateToken = (id, role = 'user', email, userName) => {
  return jwt.sign(
    {
      id,
      role,
      email,
      userName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    }
  );
};
