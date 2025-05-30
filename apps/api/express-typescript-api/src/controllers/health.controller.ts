import { Request, Response } from 'express';
import { healthService } from '../services/health.service';
import logger from '../utils/logger';

export async function getStatus(req: Request, res: Response) {
  try {
    const status = await healthService.getStatus();
    res.json(status);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Failed to get health status',
    });
  }
}

export async function getDetailedStatus(req: Request, res: Response) {
  try {
    const status = await healthService.getDetailedStatus();
    res.json(status);
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Failed to get detailed health status',
    });
  }
}