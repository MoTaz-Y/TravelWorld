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
import allowedTo from '../middleware/allowedTo.js';
import ROLES from '../utils/userRoles.js';

router
  .route('/tours/:tourId')
  .get(getAllReviews)
  .post(/*verifyToken.verifyToken, allowedTo(ROLES.USER),*/ createReview);
router
  .route('/:id')
  .get(getReview)
  .patch(/*verifyToken.verifyToken, allowedTo(ROLES.USER),*/ updateReview)
  .delete(/*verifyToken.verifyToken, allowedTo(ROLES.USER),*/ deleteReview);

export default router;
