import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config();

import { env } from './config/env';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './types/errors';
import {
  limiter,
  compressionMiddleware,
  securityHeaders,
} from './middleware/security';
import routes from './routes';

// Create Express application
const app: Application = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Rate limiting
app.use(limiter);

// CORS
app.use(cors({
  origin: env.NODE_ENV === 'production' 
    ? ['https://url.ref.si'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Compression
app.use(compressionMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use(securityHeaders);

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }));
}

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use(env.API_PREFIX, routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to TypeScript Express API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    docs: `${req.protocol}://${req.get('host')}${env.API_PREFIX}/docs`,
  });
});

// 404 handler
app.use((req: Request, res: Response, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

export default app;
