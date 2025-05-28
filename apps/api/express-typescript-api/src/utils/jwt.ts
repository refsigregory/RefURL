import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';
import { UnauthorizedError } from '../types/errors';

export class JwtUtil {
  private static readonly SECRET = process.env.JWT_SECRET || 'iAmTheSecretKey';
  private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || 24 * 60 * 60; // 24 hours in seconds

  static generateToken(payload: object): string {
    const options: SignOptions = {
      expiresIn: this.EXPIRES_IN as number
    };
    return jwt.sign(payload, this.SECRET, options);
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.SECRET) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}
