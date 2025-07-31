const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tours/tourController');
const validationSchema = require('../middleware/validations/validationSchema');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');
const verifyToken = require('../middleware/verifyToken');

router.get('/', tourController.getAllTours);
router.get('/search', tourController.tourSearch);
router.get('/featured', tourController.tourFeatured);
router.get('/count', tourController.tourCount);
router.get('/:id', tourController.getSingleTour);
router.post(
  '/',
  verifyToken.verifyAdmin,
  allowedTo(userRoles.ADMIN, userRoles.MANAGER),
  validationSchema.TourValidation,
  tourController.createTour
);
router.patch(
  '/:id',
  verifyToken.verifyAdmin,
  allowedTo(userRoles.ADMIN, userRoles.MANAGER, userRoles.GUIDE),
  validationSchema.TourValidation,
  tourController.updateTour
);
router.delete(
  '/:id',
  verifyToken.verifyAdmin,
  allowedTo(userRoles.ADMIN, userRoles.MANAGER),
  tourController.deleteTour
);

module.exports = router;
