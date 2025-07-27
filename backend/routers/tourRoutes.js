const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const validationSchema = require('../middleware/validations/validationSchema.js');
const allowedTo = require('../middleware/allowedTo.js');
const userRoles = require('../utils/userRoles');

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getSingleTour);
router.post(
  '/',
  allowedTo(userRoles.ADMIN, userRoles.MANAGER),
  validationSchema.TourValidation,
  tourController.createTour
);
router.patch(
  '/:id',
  allowedTo(userRoles.ADMIN, userRoles.MANAGER, userRoles.GUIDE),
  validationSchema.TourValidation,
  tourController.updateTour
);
router.delete(
  '/:id',
  allowedTo(userRoles.ADMIN, userRoles.MANAGER),
  tourController.deleteTour
);

module.exports = router;
