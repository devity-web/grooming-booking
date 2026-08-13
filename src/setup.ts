import {vi} from 'vitest';

const getEnv = (name: string, fallback: string) =>
  process.env[name] ?? fallback;

vi.mock('@/lib/env', () => ({
  clientEnv: {
    get NEXT_PUBLIC_SUPABASE_URL() {
      return getEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    },
    get NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY() {
      return getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'test-key');
    },
  },
  getServerEnv: () => ({
    get NEXT_PUBLIC_SUPABASE_URL() {
      return getEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    },
    get NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY() {
      return getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'test-key');
    },
    get DATABASE_URL() {
      return getEnv(
        'DATABASE_URL',
        'postgresql://postgres:postgres@localhost:5432/toskio_test',
      );
    },
    get RESEND_API_KEY() {
      return getEnv('RESEND_API_KEY', 'test-resend-key');
    },
    get GOOGLE_CLIENT_ID() {
      return getEnv('GOOGLE_CLIENT_ID', 'test-google-client-id');
    },
    get GOOGLE_CLIENT_SECRET() {
      return getEnv('GOOGLE_CLIENT_SECRET', 'test-google-client-secret');
    },
    get APP_URL() {
      return getEnv('APP_URL', 'http://localhost:3000');
    },
    get TOKEN_ENCRYPTION_KEY() {
      return getEnv(
        'TOKEN_ENCRYPTION_KEY',
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      );
    },
    get NODE_ENV() {
      return getEnv('NODE_ENV', 'test');
    },
  }),
}));
