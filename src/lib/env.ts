import z from 'zod';

export const booleanEnv = () =>
  z
    .enum(['true', 'false'])
    .default('false')
    .transform(val => val === 'true');

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
});

const serverEnvSchema = publicEnvSchema.extend({
  DATABASE_URL: z.string(),
  RESEND_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  APP_URL: z.string(),
  TOKEN_ENCRYPTION_KEY: z.string(),
  NODE_ENV: z.literal(['production', 'development', 'test']),
});

export const clientEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

export function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'Server environment variables cannot be accessed in the browser.',
    );
  }

  return serverEnvSchema.parse(process.env);
}
