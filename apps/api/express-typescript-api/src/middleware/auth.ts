import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/error';
import User from '../models/user.model';
import { Request } from '../types/express';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: number };

    // Get user from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Attach user to request
    req.user = {
      ...user,
      userId: user.id as unknown as number
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};
