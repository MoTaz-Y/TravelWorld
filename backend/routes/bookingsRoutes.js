const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');

const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookings/bookingsController');

router
  .route('/tours/:tourId')
  .get(verifyToken.verifyAdmin, allowedTo(userRoles.ADMIN), getBookings)
  .post(verifyToken.verifyUser, allowedTo(userRoles.USER), createBooking);
router
  .route('/:id')
  .get(
    verifyToken.verifyUser,
    allowedTo(userRoles.USER, userRoles.ADMIN),
    getBooking
  )
  .put(
    verifyToken.verifyUser,
    allowedTo(userRoles.USER, userRoles.ADMIN),
    updateBooking
  )
  .delete(
    verifyToken.verifyUser,
    allowedTo(userRoles.USER, userRoles.ADMIN),
    deleteBooking
  );

module.exports = router;
