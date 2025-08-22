import express from 'express';
const router = express.Router();
import userController from '../controllers/users/userController.js';
import validationSchema from '../middleware/validations/validationSchema.js';
import verifyToken from '../middleware/verifyToken.js';
import allowedTo from '../middleware/allowedTo.js';
import userRoles from '../utils/userRoles.js';
import { validate } from '../middleware/validations/validate.js';

//public routes
router.post(
  '/register',
  // validate(validationSchema.UserValidation),
  userController.registerUser
);
router.post(
  '/login',
  // validate(validationSchema.SigninValidation),
  userController.loginUser
);
router.get('/logout', userController.logoutUser);

router.post(
  '/forgot-password',
  // validate(validationSchema.ForgotPasswordValidation),
  userController.forgotPassword
);

//protected user routes
router.get(
  '/me',
  // verifyToken.verifyToken,
  // allowedTo(userRoles.USER),
  userController.getUserProfile
);

router.put(
  '/me',
  // verifyToken.verifyToken,
  // allowedTo(userRoles.USER),
  // validate(validationSchema.UserUpdateValidation),
  userController.updateUserProfile
);
router.post(
  '/refresh-token',
  // allowedTo(userRoles.ADMIN, userRoles.USER),
  userController.refreshToken
);

router.post(
  '/me/password',
  // verifyToken.verifyToken,
  // validate(validationSchema.UpdatePasswordValidation),
  userController.updatePassword
);

//protected admin routes
router.get(
  '/',
  // verifyToken.verifyUser,
  // allowedTo(userRoles.ADMIN),
  userController.getAllUsers
);
router.post(
  '/',
  // verifyToken.verifyUser,
  // allowedTo(userRoles.ADMIN),
  // validate(validationSchema.UserValidation),
  userController.createUser
);

router.get(
  '/:id',
  // verifyToken.verifyUser,
  // allowedTo(userRoles.ADMIN),
  userController.getSingleUser
);
router.put(
  '/:id',
  // verifyToken.verifyUser,
  // allowedTo(userRoles.ADMIN),
  // validate(validationSchema.UserUpdateValidation),
  userController.updateUser
);
router.delete(
  '/:id',
  // verifyToken.verifyUser,
  // allowedTo(userRoles.ADMIN),
  userController.deleteUser
);

export default router;
