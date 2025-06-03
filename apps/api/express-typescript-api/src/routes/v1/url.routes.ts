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

router.post('/shorten',
  validate([
    body('original_url').isURL().withMessage('Valid URL is required'),
    body('title').optional().isString().withMessage('Title must be a string'),
  ]),
  asyncHandler(urlController.shortenUrl)
);

// Protected routes
router.use(authenticate);

router.post('/',
  validate([
    body('original_url').isURL().withMessage('Valid URL is required'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('short_code').optional().isString().withMessage('Short code must be a string'),
  ]),
  asyncHandler(urlController.addUrl)
);

router.get('/',
  asyncHandler(urlController.getUserUrls)
);

router.get('/:id',
  asyncHandler(urlController.getUrlById)
);

router.put('/:id',
  validate([
    body('original_url').isURL().withMessage('Valid URL is required'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('short_code').optional().isString().withMessage('Short code must be a string'),
  ]),
  asyncHandler(urlController.updateUrl)
);

router.delete('/:id',
  asyncHandler(urlController.deleteUrl)
);

router.get('/test',
  asyncHandler(urlController.testPerformance)
);

export default router; 