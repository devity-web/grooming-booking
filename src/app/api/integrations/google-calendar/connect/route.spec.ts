import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {
  bytesToString,
  cookieSet,
  cookies,
  createGoogleAuth,
  generateAuthUrl,
  randomBytes,
} = vi.hoisted(() => ({
  bytesToString: vi.fn(),
  cookieSet: vi.fn(),
  cookies: vi.fn(),
  createGoogleAuth: vi.fn(),
  generateAuthUrl: vi.fn(),
  randomBytes: vi.fn(),
}));

vi.mock('node:crypto', async importOriginal => {
  const actual = await importOriginal<typeof import('node:crypto')>();

  return {
    ...actual,
    randomBytes,
  };
});

vi.mock('next/headers', () => ({cookies}));

vi.mock('@/lib/integrations/calendar', () => ({createGoogleAuth}));

import {GET} from './route';

describe('GET /api/integrations/google-calendar/connect', () => {
  beforeEach(() => {
    bytesToString.mockReturnValue('oauth-state');
    randomBytes.mockReturnValue({toString: bytesToString});
    cookies.mockResolvedValue({set: cookieSet});
    createGoogleAuth.mockReturnValue({generateAuthUrl});
    generateAuthUrl.mockReturnValue(
      'https://accounts.google.com/o/oauth2/v2/auth?state=oauth-state',
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    bytesToString.mockReset();
    cookieSet.mockReset();
    cookies.mockReset();
    createGoogleAuth.mockReset();
    generateAuthUrl.mockReset();
    randomBytes.mockReset();
  });

  it('stores an OAuth state and redirects to Google authorization', async () => {
    const response = await GET();

    expect(createGoogleAuth).toHaveBeenCalledOnce();
    expect(randomBytes).toHaveBeenCalledOnce();
    expect(randomBytes).toHaveBeenCalledWith(32);
    expect(bytesToString).toHaveBeenCalledOnce();
    expect(bytesToString).toHaveBeenCalledWith('hex');
    expect(cookies).toHaveBeenCalledOnce();
    expect(cookieSet).toHaveBeenCalledOnce();
    expect(cookieSet).toHaveBeenCalledWith(
      'google-calendar-oauth-state',
      'oauth-state',
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/api/integrations/google-calendar',
        maxAge: 10 * 60,
      },
    );
    expect(generateAuthUrl).toHaveBeenCalledOnce();
    expect(generateAuthUrl).toHaveBeenCalledWith({
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: true,
      scope: ['https://www.googleapis.com/auth/calendar.events'],
      state: 'oauth-state',
    });
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth?state=oauth-state',
    );
  });

  it('marks the OAuth state cookie as secure in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    await GET();

    expect(cookieSet).toHaveBeenCalledWith(
      'google-calendar-oauth-state',
      'oauth-state',
      expect.objectContaining({secure: true}),
    );
  });
});
