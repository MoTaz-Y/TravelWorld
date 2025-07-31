const express = require('express');
const router = express.Router();
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews/reviewsController');
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const ROLES = require('../utils/userRoles');

router
  .route('/tour/:tourId')
  .get(getReviews)
  .post(verifyToken, allowedTo(ROLES.USER), addReview);
router
  .route('/:id')
  .get(getReview)
  .put(verifyToken, allowedTo(ROLES.USER), updateReview)
  .delete(verifyToken, allowedTo(ROLES.USER), deleteReview);

module.exports = router;
