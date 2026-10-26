import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const serverDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
config({ path: [resolve(serverDirectory, '.env'), resolve(serverDirectory, '..', '.env')] });

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1),
  SESSION_SECRET: z.string().min(32).default('local-development-secret-change-before-deploy-000000'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-3.8-flash'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().default(8)
});
export const env = configSchema.parse(process.env);
if (process.env.NODE_ENV === 'production' && process.env.SESSION_SECRET === undefined) throw new Error('SESSION_SECRET must be configured in production.');
