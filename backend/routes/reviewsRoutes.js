import express from 'express';
const router = express.Router();
import {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviews/reviewsController.js';
import verifyToken from '../middleware/verifyToken.js';
// const allowedTo = require('../middleware/allowedTo.js');
import allowedTo from '../middleware/allowedTo.js';
// const ROLES = require('../utils/userRoles.js');
import ROLES from '../utils/userRoles.js';

router
  .route('/tour/:tourId')
  .get(getAllReviews)
  .post(verifyToken.verifyToken, allowedTo(ROLES.USER), createReview);
router
  .route('/:id')
  .get(getReview)
  .put(verifyToken.verifyToken, allowedTo(ROLES.USER), updateReview)
  .delete(verifyToken.verifyToken, allowedTo(ROLES.USER), deleteReview);

export default router;
