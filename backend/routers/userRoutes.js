const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validationSchema = require('../middleware/validations/validationSchema');
const verifyToken = require('../middleware/verifyToken');

router.post(
  '/register',
  validationSchema.SignupValidation,
  userController.registerUser
);
router.post(
  '/login',
  validationSchema.SigninValidation,
  userController.loginUser
);
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/update', verifyToken, userController.updateUserProfile);

module.exports = router;
