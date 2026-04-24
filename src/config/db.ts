import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseEntities } from '../database/models';

loadEnv();

const isProduction = process.env.NODE_ENV === 'production';

const getDatabaseUrl = (): string => {
  return process.env.DATABASE_URL ?? process.env.DB_URL ?? '';
};

const requiresSSL = (url: string): boolean => {
  return url.includes('neon.tech');
};

const buildUrl = (rawUrl: string, useSSL: boolean): string => {
  try {
    const u = new URL(rawUrl);
    u.searchParams.delete('sslmode');
    u.searchParams.delete('ssl');
    u.searchParams.delete('channel_binding');
    if (useSSL) {
      u.searchParams.set('sslmode', 'require');
    }
    return u.toString();
  } catch {
    return rawUrl;
  }
};

export const createDatabaseOptions = (): DataSourceOptions => {
  const databaseUrl = getDatabaseUrl();
  const useSSL = requiresSSL(databaseUrl);

  return {
    type: 'postgres',
    url: buildUrl(databaseUrl, useSSL),
    synchronize: true,
    logging: false,
    entities: databaseEntities,
    extra: {
      connectionTimeoutMillis: 30000,
    },
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    schema: 'public',
  };
};

export const AppDataSource = new DataSource(createDatabaseOptions());
