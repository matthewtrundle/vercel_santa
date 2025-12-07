import { z } from 'zod';

const envSchema = z.object({
  // AI - Vercel AI Gateway (get from Vercel Dashboard > AI Gateway)
  AI_GATEWAY_API_KEY: z.string().min(1, 'AI_GATEWAY_API_KEY is required'),

  // Database
  POSTGRES_URL: z.string().min(1, 'POSTGRES_URL is required'),

  // Blob Storage
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'BLOB_READ_WRITE_TOKEN is required'),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Statsig (optional - feature flags/experiments)
  STATSIG_SERVER_API_KEY: z.string().optional(),
  STATSIG_CLIENT_API_KEY: z.string().optional(),
  EDGE_CONFIG: z.string().optional(),

  // Resend (optional - email sending)
  RESEND_API_KEY: z.string().optional(),

  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export const env = validateEnv();
