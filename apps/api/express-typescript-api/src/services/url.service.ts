import { nanoid } from 'nanoid';
import { UrlAttributes, UrlResponse, CreateUrlData } from '../types/url.types';
import { NotFoundError } from '../types/errors';
import logger from '../utils/logger';
import Url from '../models/url.model';

export class UrlService {
  async createUrl(data: CreateUrlData): Promise<UrlResponse> {
    try {
      const short_code = nanoid(6);
      const url = await Url.create({
        original_url: data.original_url,
        short_code,
        title: data.title,
        owner: data.owner_id,
      } as UrlAttributes);

      return this.mapToResponse(url);
    } catch (error) {
      logger.error('URL creation error:', error);
      throw error;
    }
  }

  async getUserUrls(user_id: number): Promise<UrlResponse[]> {
    try {
      const urls = await Url.findAll({
        where: { owner: user_id },
        order: [['created_at', 'DESC']],
        raw: true,
      }) as UrlAttributes[];

      return urls.map(this.mapToResponse);
    } catch (error) {
      logger.error('User URLs retrieval error:', error);
      throw error;
    }
  }

  async getUrlByShortCode(short_code: string): Promise<UrlResponse> {
    try {
      const url = await Url.findOne({ 
        where: { short_code },
        raw: true 
      }) as UrlAttributes | null;

      if (!url) {
        throw new NotFoundError('URL not found');
      }

      return this.mapToResponse(url);
    } catch (error) {
      logger.error('URL retrieval error:', error);
      throw error;
    }
  }

  async incrementClicks(short_code: string): Promise<void> {
    try {
      const url = await Url.findOne({ where: { short_code } });

      if (!url) {
        throw new NotFoundError('URL not found');
      }

      await url.increment('clicks');
      await url.update({ clicks_at: new Date() });
      
      logger.info(`Clicks incremented for URL: ${short_code}`);
    } catch (error) {
      logger.error('URL clicks increment error:', error);
      throw error;
    }
  }

  async deleteUrl(id: number, owner_id: number): Promise<boolean> {
    try {
      const deleted = await Url.destroy({
        where: {
          id,
          owner: owner_id
        }
      });
      return deleted > 0;
    } catch (error) {
      logger.error('URL deletion error:', error);
      throw error;
    }
  }

  private mapToResponse(url: UrlAttributes): UrlResponse {
    return {
      id: url.id,
      original_url: url.original_url,
      short_code: url.short_code,
      title: url.title,
      clicks: url.clicks,
      created_at: url.created_at,
      clicks_at: url.clicks_at,
    };
  }
  
  async testPerformance() {
    // Compare the performance of raw and non-raw queries
    console.time('with raw');
    const urls1 = await Url.findAll({ 
      where: { owner: 1 },
      raw: true 
    });
    console.timeEnd('with raw');
  
    console.time('without raw');
    const urls2 = await Url.findAll({ 
      where: { owner: 1 }
    });
    console.timeEnd('without raw');
  }
}

export const urlService = new UrlService();
