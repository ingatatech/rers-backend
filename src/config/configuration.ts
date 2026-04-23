/**
 * Application configuration factory.
 *
 * Values are read from environment variables. Provide defaults only where
 * running without a value is safe in development; leave sensitive settings
 * undefined so startup fails fast when they are missing in production.
 */
export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string | undefined;
  db: number;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string | undefined;
  pass: string | undefined;
  from: string;
}

export interface UploadConfig {
  destination: string;
  maxFileSizeMb: number;
  allowedMimeTypes: string[];
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  database: DatabaseConfig;
  jwt: JwtConfig;
  redis: RedisConfig;
  smtp: SmtpConfig;
  upload: UploadConfig;
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '4000', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',

  database: {
    url: process.env.DATABASE_URL ?? '',
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-refresh-secret-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },

  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
  },

  smtp: {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM ?? 'noreply@rnec.go.ke',
  },

  upload: {
    destination: process.env.UPLOAD_DESTINATION ?? './uploads',
    maxFileSizeMb: parseInt(process.env.UPLOAD_MAX_FILE_SIZE_MB ?? '10', 10),
    allowedMimeTypes: (
      process.env.UPLOAD_ALLOWED_MIME_TYPES ??
      'application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ).split(','),
  },
});
