import express from 'express';
const router = express.Router();
import tourController from '../controllers/tours/tourController.js';
import validationSchema from '../middleware/validations/validationSchema.js';
import allowedTo from '../middleware/allowedTo.js';
import userRoles from '../utils/userRoles.js';
import verifyToken from '../middleware/verifyToken.js';
import { validate } from '../middleware/validations/validate.js';

router.get('/', tourController.getAllTours);
router.get('/search', tourController.tourSearch);
router.get('/featured', tourController.tourFeatured);
router.get('/count', tourController.tourCount);
router.get('/:id', tourController.getTour);
router.post(
  '/',
  // verifyToken.verifyAdmin,
  // allowedTo(userRoles.ADMIN, userRoles.MANAGER),
  // validate(validationSchema.TourValidation),
  tourController.createTour
);
router.patch(
  '/:id',
  verifyToken.verifyAdmin,
  allowedTo(userRoles.ADMIN, userRoles.MANAGER, userRoles.GUIDE),
  validate(validationSchema.TourValidation),
  tourController.updateTour
);
router.delete(
  '/:id',
  // verifyToken.verifyAdmin,
  // allowedTo(userRoles.ADMIN, userRoles.MANAGER),
  tourController.deleteTour
);

export default router;
