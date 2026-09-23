import 'dotenv/config';

const isTest = process.env.NODE_ENV === 'test';
const requiredVariables = ['MONGODB_URI', 'JWT_SECRET'];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0 && !isTest) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI ?? '',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  jsonBodyLimit: process.env.JSON_BODY_LIMIT ?? '1mb',
  logFormat: process.env.LOG_FORMAT ?? 'dev',
  jwtSecret: process.env.JWT_SECRET ?? 'test-only-campus-connect-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
  adminEmail: process.env.ADMIN_EMAIL ?? '',
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
});
