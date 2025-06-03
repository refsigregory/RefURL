import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UnauthorizedError, ValidationError } from '../types/errors';
import { env } from '../config/env';
import logger from '../utils/logger';
import User from '../models/user.model';

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
      // Check if user exists
      const existingUser = await User.findOne({ where: { email: data.email } });
      if (existingUser) {
        throw new ValidationError('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const user = await User.create({
        email: data.email,
        name: data.name,
        password: hashedPassword
      } as any);

      // Generate JWT token
      const token = this.generateToken(user.id.toString());

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
      // Find user
      const user = await User.findOne({ where: { email: data.email } });
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user.id.toString());

      logger.info(`User logged in: ${data.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  private generateToken(userId: string): string {
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as unknown as number
    };
    
    return jwt.sign(
      { userId },
      env.JWT_SECRET,
      options
    );
  }
}

export const authService = new AuthService();
