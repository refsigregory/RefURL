import { Response } from 'express';
import { urlService } from '../services/url.service';
import { AppError } from '../utils/error';
import { Request } from '../types/express';

export const shortenUrl = async (req: Request, res: Response) => {
  const { original_url, title } = req.body;
  const owner_id = req.user?.userId;
  
  const url = await urlService.createUrl({
    original_url,
    title,
    owner_id
  });

  res.status(201).json({
    success: true,
    data: url
  });
};

export const redirectToOriginal = async (req: Request, res: Response) => {
  const { shortCode } = req.params;
  
  const url = await urlService.getUrlByShortCode(shortCode);
  await urlService.incrementClicks(shortCode);

  res.redirect(url.original_url);
};

export const getUserUrls = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError('Authentication required', 401);
  }

  const urls = await urlService.getUserUrls(req.user.userId);
  
  res.json({
    success: true,
    data: urls
  });
};

export const deleteUrl = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;
  const deleted = await urlService.deleteUrl(parseInt(id), req.user.userId);

  if (!deleted) {
    throw new AppError('URL not found or unauthorized', 404);
  }

  res.json({
    success: true,
    message: 'URL deleted successfully'
  });
}; 

export const testPerformance = async (req: Request, res: Response) => {
  await urlService.testPerformance();

  res.json({
    success: true,
    message: 'Performance test completed'
  });
};