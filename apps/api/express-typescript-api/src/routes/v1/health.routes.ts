import { Router } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import * as healthController from '../../controllers/health.controller';

const router = Router();

// Health routes
router.get('/', asyncHandler(healthController.getStatus));
router.get('/detailed', asyncHandler(healthController.getDetailedStatus));

export default router;
