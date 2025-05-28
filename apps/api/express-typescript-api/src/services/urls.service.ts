import { nanoid } from 'nanoid';
import { ValidationError, NotFoundError } from '../types/errors';
import logger from '../utils/logger';

export interface CreateUrlData {
  originalUrl: string;
  title?: string;
  ownerId?: number;
}

export interface UrlResponse {
  id: number;
  originalUrl: string;
  shortCode: string;
  title?: string;
  clicks: number;
  createdAt: Date;
  clicksAt: Date;
}

export class UrlsService {
  async createUrl(data: CreateUrlData): Promise<UrlResponse> {
    try {
      // Generate a unique short code
      const shortCode = nanoid(6);

      // Create URL record (implement with your database)
      const url = {
        id: Date.now(), // Replace with actual ID generation
        originalUrl: data.originalUrl,
        shortCode,
        title: data.title,
        ownerId: data.ownerId,
        clicks: 0,
        createdAt: new Date(),
        clicksAt: new Date(),
      };

      logger.info(`URL created: ${shortCode} -> ${data.originalUrl}`);

      return {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        title: url.title,
        clicks: url.clicks,
        createdAt: url.createdAt,
        clicksAt: url.clicksAt,
      };
    } catch (error) {
      logger.error('URL creation error:', error);
      throw error;
    }
  }

  async getUrlByShortCode(shortCode: string): Promise<UrlResponse> {
    try {
      // Find URL by short code (implement with your database)
      // const url = await UrlRepository.findByShortCode(shortCode);
      // if (!url) {
      //   throw new NotFoundError('URL not found');
      // }

      // Mock URL for example
      const url = {
        id: 1,
        originalUrl: 'https://example.com',
        shortCode,
        title: 'Example URL',
        clicks: 0,
        createdAt: new Date(),
        clicksAt: new Date(),
      };

      return {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        title: url.title,
        clicks: url.clicks,
        createdAt: url.createdAt,
        clicksAt: url.clicksAt,
      };
    } catch (error) {
      logger.error('URL retrieval error:', error);
      throw error;
    }
  }

  async incrementClicks(shortCode: string): Promise<void> {
    try {
      // Update clicks count (implement with your database)
      // await UrlRepository.incrementClicks(shortCode);
      
      logger.info(`Clicks incremented for URL: ${shortCode}`);
    } catch (error) {
      logger.error('URL clicks increment error:', error);
      throw error;
    }
  }

  async getUserUrls(userId: number): Promise<UrlResponse[]> {
    try {
      // Get user's URLs (implement with your database)
      // const urls = await UrlRepository.findByUserId(userId);
      
      // Mock URLs for example
      const urls = [{
        id: 1,
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        title: 'Example URL',
        clicks: 0,
        createdAt: new Date(),
        clicksAt: new Date(),
      }];

      return urls.map(url => ({
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        title: url.title,
        clicks: url.clicks,
        createdAt: url.createdAt,
        clicksAt: url.clicksAt,
      }));
    } catch (error) {
      logger.error('User URLs retrieval error:', error);
      throw error;
    }
  }
}

export const urlsService = new UrlsService();
