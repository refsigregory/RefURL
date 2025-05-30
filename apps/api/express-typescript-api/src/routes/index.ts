import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import v1Routes from './v1';

const router = Router();

// Example API route with validation
router.post('/test', 
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ]),
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      message: 'API route working!',
      data: req.body,
      timestamp: new Date().toISOString(),
    });
  })
);

// Default to v1 for backward compatibility
router.use('/', v1Routes);

export default router;
