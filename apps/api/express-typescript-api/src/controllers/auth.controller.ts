import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);
  
  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
};
