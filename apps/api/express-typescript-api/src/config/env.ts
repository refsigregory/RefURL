import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  API_PREFIX: z.string().default('/api'),
  
  // Database
  DATABASE_URL: z.string().optional(),
  DB_DRIVER: z.enum(['postgres', 'mysql', 'sqlite']).default('postgres'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_NAME: z.string().default('refurl'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_SSL_MODE: z.enum(['disable', 'require', 'verify-ca', 'verify-full']).default('disable'),
  
  // JWT
  JWT_SECRET: z.string().default('your-secret-key'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Initial setup
  INITIAL_USER_PASSWORD: z.string().default('admin123'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = (): EnvConfig => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
};

export const env = validateEnv(); 