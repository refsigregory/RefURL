import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ValidationError } from '../types/errors';
import { env } from '../config/env';
import logger from '../utils/logger';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData) {
    try {
      // Check if user exists (implement with your database)
      // const existingUser = await UserRepository.findByEmail(data.email);
      // if (existingUser) {
      //   throw new ValidationError('User already exists');
      // }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user (implement with your database)
      const user = {
        id: Date.now().toString(), // Replace with actual ID generation
        email: data.email,
        name: data.name,
        password: hashedPassword,
      };

      // Generate JWT token
      const token = this.generateToken(user.id);

      logger.info(`User registered: ${data.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(data: LoginData) {
    try {
      // Find user (implement with your database)
      // const user = await UserRepository.findByEmail(data.email);
      // if (!user) {
      //   throw new UnauthorizedError('Invalid credentials');
      // }

      // Mock user for example
      const user = {
        id: '1',
        email: data.email,
        password: '$2a$12$example', // This should come from database
      };

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user.id);

      logger.info(`User logged in: ${data.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }
}

export const authService = new AuthService();
