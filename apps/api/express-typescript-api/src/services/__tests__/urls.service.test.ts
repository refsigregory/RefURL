import { UrlsService, CreateUrlData } from '../urls.service';
import { ValidationError, NotFoundError } from '../../types/errors';
import { nanoid } from 'nanoid';

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

describe('UrlsService', () => {
  let urlsService: UrlsService;
  const mockNanoid = nanoid as jest.MockedFunction<typeof nanoid>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    urlsService = new UrlsService();
    
    // Mock nanoid to return a predictable value
    mockNanoid.mockReturnValue('abc123');
  });

  describe('createUrl', () => {
    const validUrlData: CreateUrlData = {
      originalUrl: 'https://example.com',
      title: 'Test URL',
      ownerId: 1,
    };

    it('should create a new URL with valid data', async () => {
      const result = await urlsService.createUrl(validUrlData);

      expect(result).toMatchObject({
        originalUrl: validUrlData.originalUrl,
        shortCode: 'abc123',
        title: validUrlData.title,
        clicks: 0,
      });
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.clicksAt).toBeInstanceOf(Date);
      expect(mockNanoid).toHaveBeenCalledWith(6);
    });

    it('should create URL without optional fields', async () => {
      const minimalData: CreateUrlData = {
        originalUrl: 'https://example.com',
      };

      const result = await urlsService.createUrl(minimalData);

      expect(result).toMatchObject({
        originalUrl: minimalData.originalUrl,
        shortCode: 'abc123',
        clicks: 0,
      });
      expect(result.title).toBeUndefined();
    });

    it('should throw error for invalid URL', async () => {
      const invalidData: CreateUrlData = {
        originalUrl: 'not-a-valid-url',
      };

      await expect(urlsService.createUrl(invalidData)).rejects.toThrow();
    });
  });

  describe('getUrlByShortCode', () => {
    it('should return URL for valid short code', async () => {
      const result = await urlsService.getUrlByShortCode('abc123');

      expect(result).toMatchObject({
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
        clicks: 0,
      });
    });

    it('should throw NotFoundError for non-existent short code', async () => {
      // Mock the database to return null
      // This will be implemented when we add the database layer
      await expect(urlsService.getUrlByShortCode('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('incrementClicks', () => {
    it('should increment clicks for valid short code', async () => {
      await expect(urlsService.incrementClicks('abc123')).resolves.not.toThrow();
    });

    it('should throw error for non-existent short code', async () => {
      await expect(urlsService.incrementClicks('nonexistent')).rejects.toThrow();
    });
  });

  describe('getUserUrls', () => {
    it('should return array of URLs for valid user ID', async () => {
      const result = await urlsService.getUserUrls(1);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toMatchObject({
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        clicks: 0,
      });
    });

    it('should return empty array for user with no URLs', async () => {
      // Mock the database to return empty array
      // This will be implemented when we add the database layer
      const result = await urlsService.getUserUrls(999);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
}); 