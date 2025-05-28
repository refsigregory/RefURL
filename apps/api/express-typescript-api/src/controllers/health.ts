import { Request, Response } from 'express';
import { env } from '../config/env';

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
};

export const getDetailedHealth = async (req: Request, res: Response): Promise<void> => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };

  res.status(200).json(healthData);
}; 