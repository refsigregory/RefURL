import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import logger from '../utils/logger';

// Config model
interface ConfigAttributes {
  id: number;
  CONFIG_NAME: string;
  CONFIG_VALUE: string;
}

interface ConfigCreationAttributes extends Optional<ConfigAttributes, 'id'> {}

class Config extends Model<ConfigAttributes, ConfigCreationAttributes> implements ConfigAttributes {
  public id!: number;
  public CONFIG_NAME!: string;
  public CONFIG_VALUE!: string;
}

Config.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    CONFIG_NAME: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    CONFIG_VALUE: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'configs',
    modelName: 'Config',
  }
);

// Configuration types
export interface AppConfig {
  // Application
  APP_NAME: string;
  APP_VERSION: string;
  APP_DESCRIPTION: string;
  
  // URL Settings
  MAX_URL_LENGTH: number;
  MIN_SHORT_CODE_LENGTH: number;
  MAX_SHORT_CODE_LENGTH: number;
  DEFAULT_EXPIRY_DAYS: number;
  ALLOW_CUSTOM_CODES: boolean;
  
  // Features
  REQUIRE_REGISTRATION: boolean;
  ANALYTICS_ENABLED: boolean;
  RATE_LIMIT_PER_HOUR: number;
  RATE_LIMIT_PER_DAY: number;
  MAINTENANCE_MODE: boolean;
  REGISTRATION_ENABLED: boolean;
  EMAIL_VERIFICATION_REQUIRED: boolean;
  
  // UI
  DEFAULT_THEME: string;
  
  // Contact
  CONTACT_EMAIL: string;
  PRIVACY_POLICY_URL: string;
  TERMS_OF_SERVICE_URL: string;
  SUPPORT_URL: string;
}

export class ConfigService {
  private static instance: ConfigService;
  private configCache: Map<string, any> = new Map();
  private configTypes: Map<string, 'string' | 'number' | 'boolean'> = new Map([
    // Application
    ['APP_NAME', 'string'],
    ['APP_VERSION', 'string'],
    ['APP_DESCRIPTION', 'string'],
    
    // URL Settings
    ['MAX_URL_LENGTH', 'number'],
    ['MIN_SHORT_CODE_LENGTH', 'number'],
    ['MAX_SHORT_CODE_LENGTH', 'number'],
    ['DEFAULT_EXPIRY_DAYS', 'number'],
    ['ALLOW_CUSTOM_CODES', 'boolean'],
    
    // Features
    ['REQUIRE_REGISTRATION', 'boolean'],
    ['ANALYTICS_ENABLED', 'boolean'],
    ['RATE_LIMIT_PER_HOUR', 'number'],
    ['RATE_LIMIT_PER_DAY', 'number'],
    ['MAINTENANCE_MODE', 'boolean'],
    ['REGISTRATION_ENABLED', 'boolean'],
    ['EMAIL_VERIFICATION_REQUIRED', 'boolean'],
    
    // UI
    ['DEFAULT_THEME', 'string'],
    
    // Contact
    ['CONTACT_EMAIL', 'string'],
    ['PRIVACY_POLICY_URL', 'string'],
    ['TERMS_OF_SERVICE_URL', 'string'],
    ['SUPPORT_URL', 'string'],
  ]);

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      await this.loadAllConfigs();
      logger.info('Configuration service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize configuration service:', error);
      throw error;
    }
  }

  public async getConfig<T extends keyof AppConfig>(key: T): Promise<AppConfig[T]> {
    if (this.configCache.has(key)) {
      return this.configCache.get(key);
    }

    const config = await Config.findOne({ where: { CONFIG_NAME: key } });
    if (!config) {
      throw new Error(`Configuration key '${key}' not found`);
    }

    const value = this.parseConfigValue(key, config.CONFIG_VALUE);
    this.configCache.set(key, value);
    return value;
  }

  public async setConfig<T extends keyof AppConfig>(key: T, value: AppConfig[T]): Promise<void> {
    const stringValue = String(value);
    await Config.upsert({
      CONFIG_NAME: key,
      CONFIG_VALUE: stringValue,
    });
    this.configCache.set(key, value);
    logger.info(`Configuration updated: ${key} = ${stringValue}`);
  }

  public async getAllConfigs(): Promise<AppConfig> {
    const configs = await Config.findAll();
    const result: Partial<AppConfig> = {};

    for (const config of configs) {
      const key = config.CONFIG_NAME as keyof AppConfig;
      result[key] = this.parseConfigValue(key, config.CONFIG_VALUE);
    }

    return result as AppConfig;
  }

  private async loadAllConfigs(): Promise<void> {
    const configs = await Config.findAll();
    for (const config of configs) {
      const key = config.CONFIG_NAME as keyof AppConfig;
      this.configCache.set(key, this.parseConfigValue(key, config.CONFIG_VALUE));
    }
  }

  private parseConfigValue(key: keyof AppConfig, value: string): any {
    const type = this.configTypes.get(key);
    if (!type) return value;

    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value.toLowerCase() === 'true';
      default:
        return value;
    }
  }

  public clearCache(): void {
    this.configCache.clear();
  }
}

export const configService = ConfigService.getInstance(); 