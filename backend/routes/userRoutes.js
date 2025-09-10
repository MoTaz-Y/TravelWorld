import express from 'express';
const router = express.Router();
import userController from '../controllers/users/userController.js';
import authFactory from '../controllers/users/authHandlerFactory.js';
import { validate } from '../middleware/validations/validate.js';
import validationSchema from '../middleware/validations/validationSchema.js';
import verifyToken from '../middleware/verifyToken.js';
import allowedTo from '../middleware/allowedTo.js';
import userRoles from '../utils/userRoles.js';

router.get(
  '/',
  verifyToken.verifyAdmin,
  allowedTo(userRoles.ADMIN),
  userController.getAllUsers
);
router.get('/me', verifyToken.verifyToken, userController.getUserProfile);
router.get('/refresh-token', userController.handleRefreshToken);
router.get('/:id', verifyToken.verifyToken, userController.getSingleUser);

router.post(
  '/register',
  validate(validationSchema.UserValidation),
  userController.registerUser
);
router.post(
  '/login',
  validate(validationSchema.SigninValidation),
  userController.loginUser
);
router.post(
  '/verify-otp',
  validate(validationSchema.OTPValidation),
  userController.verifyOTP
);
router.post('/resend-otp', userController.resendOTP);
router.post('/logout', userController.logoutUser);
router.post(
  '/forgot-password',
  validate(validationSchema.ForgotPasswordValidation),
  userController.forgotPassword
);

router.put('/me', verifyToken.verifyToken, userController.updateUserProfile);
router.put(
  '/update-password',
  verifyToken.verifyToken,
  userController.updatePassword
);

router.delete(
  '/:id',
  verifyToken.verifyToken,
  allowedTo(userRoles.ADMIN),
  userController.deleteUser
);

export default router;
