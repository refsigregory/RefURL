import { Request, Response, NextFunction } from 'express';
import { validate } from '../../middleware/validation';
import { ValidationError } from '../../types/errors';
import { body } from 'express-validator';

// Mock logger
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('calls next() when validation passes', async () => {
    // Arrange
    const validations = [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
    mockRequest.body = { email: 'test@example.com', password: 'password123' };

    // Act
    await validate(validations)(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('calls next with ValidationError when validation fails', async () => {
    // Arrange
    const validations = [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
    mockRequest.body = { email: 'invalid-email', password: '123' };

    // Act
    await validate(validations)(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(nextFunction.mock.calls[0][0].message).toContain('Valid email is required');
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('handles multiple validation errors', async () => {
    // Arrange
    const validations = [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
    mockRequest.body = { email: 'invalid-email', password: '123' };

    // Act
    await validate(validations)(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
    const errorMessage = nextFunction.mock.calls[0][0].message;
    expect(errorMessage).toContain('Valid email is required');
    expect(errorMessage).toContain('Password must be at least 6 characters');
  });
}); 