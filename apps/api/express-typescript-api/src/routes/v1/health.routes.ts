import { Router } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import * as healthController from '../../controllers/health';

const router = Router();

router.get('/', asyncHandler(healthController.getHealth));
router.get('/detailed', asyncHandler(healthController.getDetailedHealth));

export default router; 
