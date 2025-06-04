import { UrlService } from '../../services/url.service';
import Url from '../../models/url.model';
import { NotFoundError } from '../../types/errors';

// Mock dependencies
jest.mock('../../models/url.model');
jest.mock('nanoid', () => ({
  nanoid: () => 'abc123'
}));
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('UrlService', () => {
  let urlService: UrlService;
  const mockUrl = {
    id: 1,
    original_url: 'https://example.com',
    short_code: 'abc123',
    title: 'Test URL',
    clicks: 0,
    created_at: new Date(),
    clicks_at: new Date(),
    owner: 123
  };

  beforeEach(() => {
    jest.clearAllMocks();
    urlService = new UrlService();
  });

  describe('createUrl', () => {
    it('creates a new URL with generated short code', async () => {
      // Arrange
      const createData = {
        original_url: 'https://example.com',
        title: 'Test URL',
        owner_id: 123
      };
      (Url.create as jest.Mock).mockResolvedValue(mockUrl);

      // Act
      const result = await urlService.createUrl(createData);

      // Assert
      expect(Url.create).toHaveBeenCalledWith({
        original_url: createData.original_url,
        short_code: 'abc123',
        title: createData.title,
        owner: createData.owner_id
      });
      expect(result).toEqual({
        id: mockUrl.id,
        original_url: mockUrl.original_url,
        short_code: mockUrl.short_code,
        title: mockUrl.title,
        clicks: mockUrl.clicks,
        created_at: mockUrl.created_at,
        clicks_at: mockUrl.clicks_at
      });
    });

    it('creates a new URL with custom short code', async () => {
      // Arrange
      const createData = {
        original_url: 'https://example.com',
        title: 'Test URL',
        owner_id: 123,
        short_code: 'custom123'
      };
      (Url.create as jest.Mock).mockResolvedValue({
        ...mockUrl,
        short_code: 'custom123'
      });

      // Act
      const result = await urlService.createUrl(createData);

      // Assert
      expect(Url.create).toHaveBeenCalledWith({
        original_url: createData.original_url,
        short_code: 'custom123',
        title: createData.title,
        owner: createData.owner_id
      });
      expect(result.short_code).toBe('custom123');
    });
  });

  describe('getUrlByShortCode', () => {
    it('returns URL when found', async () => {
      // Arrange
      (Url.findOne as jest.Mock).mockResolvedValue(mockUrl);

      // Act
      const result = await urlService.getUrlByShortCode('abc123');

      // Assert
      expect(Url.findOne).toHaveBeenCalledWith({
        where: { short_code: 'abc123' },
        raw: true
      });
      expect(result).toEqual({
        id: mockUrl.id,
        original_url: mockUrl.original_url,
        short_code: mockUrl.short_code,
        title: mockUrl.title,
        clicks: mockUrl.clicks,
        created_at: mockUrl.created_at,
        clicks_at: mockUrl.clicks_at
      });
    });

    it('throws NotFoundError when URL not found', async () => {
      // Arrange
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(urlService.getUrlByShortCode('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('incrementClicks', () => {
    it('increments clicks and updates clicks_at', async () => {
      // Arrange
      const mockUrlInstance = {
        increment: jest.fn(),
        update: jest.fn()
      };
      (Url.findOne as jest.Mock).mockResolvedValue(mockUrlInstance);

      // Act
      await urlService.incrementClicks('abc123');

      // Assert
      expect(mockUrlInstance.increment).toHaveBeenCalledWith('clicks');
      expect(mockUrlInstance.update).toHaveBeenCalledWith({
        clicks_at: expect.any(Date)
      });
    });

    it('throws NotFoundError when URL not found', async () => {
      // Arrange
      (Url.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(urlService.incrementClicks('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteUrl', () => {
    it('deletes URL successfully', async () => {
      // Arrange
      (Url.destroy as jest.Mock).mockResolvedValue(1);

      // Act
      const result = await urlService.deleteUrl(1, 123);

      // Assert
      expect(Url.destroy).toHaveBeenCalledWith({
        where: {
          id: 1,
          owner: 123
        }
      });
      expect(result).toBe(true);
    });

    it('returns false when URL not found', async () => {
      // Arrange
      (Url.destroy as jest.Mock).mockResolvedValue(0);

      // Act
      const result = await urlService.deleteUrl(999, 123);

      // Assert
      expect(result).toBe(false);
    });
  });
}); 