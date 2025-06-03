import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware/validation';
import { asyncHandler } from '../../middleware/errorHandler';
import { authenticate } from '../../middleware/auth';
import * as urlController from '../../controllers/url.controller';

const router = Router();

// Public routes
router.get('/go/:shortCode',
  asyncHandler(urlController.redirectToOriginal)
);

// Protected routes
router.use(authenticate);

router.post('/shorten',
  validate([
    body('original_url').isURL().withMessage('Valid URL is required'),
    body('title').optional().isString().withMessage('Title must be a string'),
  ]),
  asyncHandler(urlController.shortenUrl)
);

router.get('/',
  asyncHandler(urlController.getUserUrls)
);

router.delete('/:id',
  validate([
    body('id').isInt().withMessage('Valid URL ID is required'),
  ]),
  asyncHandler(urlController.deleteUrl)
);

router.get('/test',
  asyncHandler(urlController.testPerformance)
);

export default router; 