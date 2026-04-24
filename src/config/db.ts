import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseEntities } from '../database/models';

loadEnv();

const isProduction = process.env.NODE_ENV === 'production';

const getDatabaseUrl = (): string => {
  return process.env.DATABASE_URL ?? process.env.DB_URL ?? '';
};

const requiresSSL = (url: string): boolean => {
  return url.includes('sslmode=require') || url.includes('neon.tech');
};

const stripSslFromUrl = (url: string): string => {
  return url
    .replace(/[?&]sslmode=[^&]*/g, '')
    .replace(/[?&]ssl=[^&]*/g, '');
};

export const createDatabaseOptions = (): DataSourceOptions => {
  const databaseUrl = getDatabaseUrl();
  const useSSL = requiresSSL(databaseUrl);
  const sanitizedUrl = useSSL ? databaseUrl : stripSslFromUrl(databaseUrl);

  return {
    type: 'postgres',
    url: sanitizedUrl,
    synchronize: true,
    logging: false,
    entities: databaseEntities,
    extra: {
      connectionTimeoutMillis: 30000,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    },
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    schema: 'public',
  };
};

export const AppDataSource = new DataSource(createDatabaseOptions());
