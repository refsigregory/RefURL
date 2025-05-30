import { Sequelize, Dialect } from 'sequelize';
import { env } from './env';
import logger from '../utils/logger';

const getDatabaseUrl = () => {
  if (env.DATABASE_URL) return env.DATABASE_URL;
  
  const { DB_DRIVER, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DB_SSL_MODE } = env;
  return `${DB_DRIVER}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=${DB_SSL_MODE}`;
};

const sequelize = new Sequelize(getDatabaseUrl(), {
  dialect: env.DB_DRIVER as Dialect,
  logging: (msg: string) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true, // Enable timestamps createdAt and updatedAt
    underscored: true, // Use snake_case for column names
    paranoid: false, // Enable/Disable soft deletes
  }
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
