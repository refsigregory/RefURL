import { nanoid } from 'nanoid';
import { ValidationError, NotFoundError } from '../types/errors';
import logger from '../utils/logger';
import Url from '../models/url.model';

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

      // Create URL record
      const url = await Url.create({
        originalUrl: data.originalUrl,
        shortCode,
        title: data.title,
        owner: data.ownerId,
      });

      logger.info(`URL created: ${shortCode} -> ${data.originalUrl}`);

      return this.mapToResponse(url);
    } catch (error) {
      logger.error('URL creation error:', error);
      throw error;
    }
  }

  async getUrlByShortCode(shortCode: string): Promise<UrlResponse> {
    try {
      const url = await Url.findByShortCode(shortCode);

      if (!url) {
        throw new NotFoundError('URL not found');
      }

      return this.mapToResponse(url);
    } catch (error) {
      logger.error('URL retrieval error:', error);
      throw error;
    }
  }

  async incrementClicks(shortCode: string): Promise<void> {
    try {
      const url = await Url.findByShortCode(shortCode);

      if (!url) {
        throw new NotFoundError('URL not found');
      }

      await url.increment('clicks');
      await url.update({ clicksAt: new Date() });
      
      logger.info(`Clicks incremented for URL: ${shortCode}`);
    } catch (error) {
      logger.error('URL clicks increment error:', error);
      throw error;
    }
  }

  async getUserUrls(userId: number): Promise<UrlResponse[]> {
    try {
      const urls = await Url.findByOwner(userId);
      return urls.map(url => this.mapToResponse(url));
    } catch (error) {
      logger.error('User URLs retrieval error:', error);
      throw error;
    }
  }

  private mapToResponse(url: Url): UrlResponse {
    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      title: url.title,
      clicks: url.clicks,
      createdAt: url.createdAt,
      clicksAt: url.clicksAt,
    };
  }
}

export const urlsService = new UrlsService();
