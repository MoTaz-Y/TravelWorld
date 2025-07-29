const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validationSchema = require('../middleware/validations/validationSchema');
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');

//public routes
router.post(
  '/register',
  validationSchema.UserValidation,
  userController.registerUser
);
router.post(
  '/login',
  validationSchema.SigninValidation,
  userController.loginUser
);
router.get('/logout', userController.logoutUser);

router.post(
  '/forgot-password',
  validationSchema.ForgotPasswordValidation,
  userController.forgotPassword
);

//protected user routes
router.get(
  '/me',
  verifyToken,
  allowedTo(userRoles.USER),
  userController.getUserProfile
);

router.put(
  '/me',
  verifyToken,
  allowedTo(userRoles.USER),
  validationSchema.UserUpdateValidation,
  userController.updateUserProfile
);
router.post(
  '/refresh-token',
  allowedTo(userRoles.ADMIN, userRoles.USER),
  userController.refreshToken
);

router.post(
  '/me/password',
  verifyToken,
  validationSchema.UpdatePasswordValidation,
  userController.updatePassword
);

//protected admin routes
router.get(
  '/',
  verifyToken,
  allowedTo(userRoles.ADMIN),
  userController.getAllUsers
);
router.post(
  '/',
  verifyToken,
  allowedTo(userRoles.ADMIN),
  validationSchema.UserValidation,
  userController.createUser
);

router.get(
  '/:id',
  verifyToken,
  allowedTo(userRoles.ADMIN),
  userController.getSingleUser
);
router.patch(
  '/:id',
  verifyToken,
  allowedTo(userRoles.ADMIN),
  validationSchema.UserUpdateValidation,
  userController.updateUser
);
router.delete(
  '/:id',
  verifyToken,
  allowedTo(userRoles.ADMIN),
  userController.deleteUser
);

module.exports = router;
