const jwt = require('jsonwebtoken');

const generateToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
};
const generateRefreshToken = async (payload) => {
  const refreshToken = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return refreshToken;
};
const verifyToken = async (token) => {
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
const verifyRefreshToken = async (refreshToken) => {
  const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
  return decoded;
};
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
};
