import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware/validation';
import { asyncHandler } from '../../middleware/errorHandler';
import * as authController from '../../controllers/auth.controller';

const router = Router();

router.post('/register',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ]),
  asyncHandler(authController.register)
);

router.post('/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  asyncHandler(authController.login)
);

export default router; 