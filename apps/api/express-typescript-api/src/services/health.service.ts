import { testConnection } from '../config/database';
import { env } from '../config/env';
import Url from '../models/url.model';
import { configService } from './config.service';
import os from 'os';
import { NetworkInterfaceInfo } from 'os';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    latency?: number;
  };
  system: {
    memory: {
      total: number;
      free: number;
      used: number;
    };
    cpu: {
      load: number[];
    };
  };
  stats: {
    totalUrls: number;
    totalClicks: number;
  };
  config: {
    environment: string;
    databaseUrl: string;
    apiPrefix: string;
    logLevel: string;
    appConfig: {
      name: string;
      version: string;
      description: string;
      maintenanceMode: boolean;
      registrationEnabled: boolean;
      analyticsEnabled: boolean;
    };
  };
}

export interface DetailedHealthStatus extends HealthStatus {
  system: {
    memory: {
      total: number;
      free: number;
      used: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
      arrayBuffers: number;
    };
    cpu: {
      load: number[];
      cores: number;
      model: string;
      speed: number;
    };
    os: {
      platform: string;
      release: string;
      type: string;
      arch: string;
      hostname: string;
    };
    network: {
      interfaces: { [key: string]: NetworkInterfaceInfo[] | undefined };
    };
  };
  process: {
    pid: number;
    versions: NodeJS.ProcessVersions;
    env: {
      NODE_ENV: string;
      API_PREFIX: string;
      LOG_LEVEL: string;
    };
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
  };
}

export class HealthService {
  async getStatus(): Promise<HealthStatus> {
    const startTime = Date.now();
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';
    let dbLatency: number | undefined;

    try {
      await testConnection();
      dbStatus = 'connected';
      dbLatency = Date.now() - startTime;
    } catch (error) {
      dbStatus = 'disconnected';
    }

    // Get system stats
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    // Get URL stats
    const totalUrls = await Url.count();
    const totalClicks = await Url.sum('clicks') || 0;

    // Get app config
    const appConfig = await configService.getAllConfigs();

    return {
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        latency: dbLatency,
      },
      system: {
        memory: {
          total: totalMemory,
          free: freeMemory,
          used: totalMemory - freeMemory,
        },
        cpu: {
          load: os.loadavg(),
        },
      },
      stats: {
        totalUrls,
        totalClicks,
      },
      config: {
        environment: env.NODE_ENV,
        databaseUrl: this.maskDatabaseUrl(env.DATABASE_URL || ''),
        apiPrefix: env.API_PREFIX,
        logLevel: env.LOG_LEVEL,
        appConfig: {
          name: appConfig.APP_NAME,
          version: appConfig.APP_VERSION,
          description: appConfig.APP_DESCRIPTION,
          maintenanceMode: appConfig.MAINTENANCE_MODE,
          registrationEnabled: appConfig.REGISTRATION_ENABLED,
          analyticsEnabled: appConfig.ANALYTICS_ENABLED,
        },
      },
    };
  }

  async getDetailedStatus(): Promise<DetailedHealthStatus> {
    const basicStatus = await this.getStatus();
    const memoryUsage = process.memoryUsage();

    return {
      ...basicStatus,
      system: {
        memory: {
          ...basicStatus.system.memory,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
          arrayBuffers: memoryUsage.arrayBuffers,
        },
        cpu: {
          ...basicStatus.system.cpu,
          cores: os.cpus().length,
          model: os.cpus()[0].model,
          speed: os.cpus()[0].speed,
        },
        os: {
          platform: os.platform(),
          release: os.release(),
          type: os.type(),
          arch: os.arch(),
          hostname: os.hostname(),
        },
        network: {
          interfaces: os.networkInterfaces(),
        },
      },
      process: {
        pid: process.pid,
        versions: process.versions,
        env: {
          NODE_ENV: env.NODE_ENV,
          API_PREFIX: env.API_PREFIX,
          LOG_LEVEL: env.LOG_LEVEL,
        },
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    };
  }

  private maskDatabaseUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      if (urlObj.password) {
        urlObj.password = '******';
      }
      return urlObj.toString();
    } catch {
      return 'invalid-url';
    }
  }
}

export const healthService = new HealthService(); 