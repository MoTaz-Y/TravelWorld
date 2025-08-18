import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import allowedTo from '../middleware/allowedTo.js';
import userRoles from '../utils/userRoles.js';

// const {
//   getBookings,
//   getBooking,
//   createBooking,
//   updateBooking,
//   deleteBooking,
// } = require('../controllers/bookings/bookingsController.js');

import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookings/bookingsController.js';
router
  .route('/tours/:tourId')
  .get(/*verifyToken.verifyAdmin, allowedTo(userRoles.ADMIN),*/ getBookings)
  .post(/*verifyToken.verifyUser, allowedTo(userRoles.USER),*/ createBooking);
router
  .route('/:id')
  .get(
    /*verifyToken.verifyUser,
    allowedTo(userRoles.USER, userRoles.ADMIN),*/
    getBooking
  )
  .put(
    /*verifyToken.verifyUser,
    allowedTo(userRoles.USER, userRoles.ADMIN),*/
    updateBooking
  )
  .delete(
    /*verifyToken.verifyUser,
    allowedTo(userRoles.USER, userRoles.ADMIN),*/
    deleteBooking
  );

export default router;
