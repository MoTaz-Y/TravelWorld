import express from 'express';
const router = express.Router();
import dashboardController from '../controllers/dashboard/dashboardController.js';
import {
  uploadTourImages,
  processTourImages,
} from '../middleware/uploadMiddleware.js';
import verifyToken from '../middleware/verifyToken.js';
import allowedTo from '../middleware/allowedTo.js';
import userRoles from '../utils/userRoles.js';

// Protect all dashboard routes
router.use(verifyToken.verifyToken);

// Dashboard routes - only for admin, manager, guide
router.get(
  '/',
  allowedTo(userRoles.ADMIN, userRoles.MANAGER, userRoles.GUIDE),
  dashboardController.getDashboard
);

router.post(
  '/tours',
  allowedTo(userRoles.ADMIN, userRoles.MANAGER),
  uploadTourImages,
  processTourImages,
  dashboardController.createTour
);

// Seed route - only for admin
router.post(
  '/tours/seed',
  allowedTo(userRoles.ADMIN),
  dashboardController.seedTour
);

export default router;
