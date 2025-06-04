import { AuthService } from '../../services/auth.service';
import User from '../../models/user.model';
import { UnauthorizedError, ValidationError } from '../../types/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('AuthService', () => {
  let authService: AuthService;
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');
  });

  describe('login', () => {
    it('returns user and token on successful login', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      // Assert
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name
        },
        token: 'mock-token'
      });
    });

    it('throws UnauthorizedError when user not found', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login({
        email: 'nonexistent@example.com',
        password: 'password123'
      })).rejects.toThrow(UnauthorizedError);
    });

    it('throws UnauthorizedError when password is incorrect', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('register', () => {
    it('creates new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User'
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        ...userData,
        id: 2,
        password: 'hashedPassword'
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(result).toEqual({
        user: {
          id: 2,
          email: userData.email,
          name: userData.name
        },
        token: 'mock-token'
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
    });

    it('throws ValidationError when user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User'
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.register(userData)).rejects.toThrow(ValidationError);
    });
  });
}); 