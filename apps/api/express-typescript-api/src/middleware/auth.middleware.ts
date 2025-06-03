import { Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt';
import { UnauthorizedError } from '../types/errors';
import { Request } from '../types/express';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token required');
    }

    const token = authHeader.substring(7);
    const payload = JwtUtil.verifyToken(token);
    
    req.user = { userId: parseInt(payload.userId, 10) };
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = JwtUtil.verifyToken(token);
      req.user = { userId: parseInt(payload.userId, 10) };
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't throw errors
    next();
  }
}; 