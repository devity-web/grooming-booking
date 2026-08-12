import {NextRequest} from 'next/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {
  connection,
  cookieDelete,
  cookieGet,
  cookies,
  createGoogleAuth,
  encrypt,
  findFirst,
  getContextFromSlug,
  getToken,
  integrationCreate,
  integrationUpdate,
} = vi.hoisted(() => ({
  connection: vi.fn(),
  cookieDelete: vi.fn(),
  cookieGet: vi.fn(),
  cookies: vi.fn(),
  createGoogleAuth: vi.fn(),
  encrypt: vi.fn(),
  findFirst: vi.fn(),
  getContextFromSlug: vi.fn(),
  getToken: vi.fn(),
  integrationCreate: vi.fn(),
  integrationUpdate: vi.fn(),
}));

vi.mock(import('next/server'), async importOriginal => {
  const actual = await importOriginal();

  return {
    ...actual,
    connection,
  };
});

vi.mock('next/headers', () => ({cookies}));

vi.mock('@/lib/encryption', () => ({encrypt}));

vi.mock('@/lib/integrations/calendar', () => ({createGoogleAuth}));

vi.mock('@/lib/prisma', () => ({
  default: {
    integration: {
      findFirst,
      create: integrationCreate,
      update: integrationUpdate,
    },
  },
}));

vi.mock('@/lib/tenant', () => ({getContextFromSlug}));

import {GET} from './route';

function createRequest(
  params: {code?: string; state?: string; error?: string} = {},
) {
  const url = new URL(
    'http://localhost/api/integrations/google-calendar/callback',
  );

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  }

  return new NextRequest(url);
}

describe('GET /api/integrations/google-calendar/callback', () => {
  beforeEach(() => {
    vi.stubEnv('APP_URL', 'https://toskio.test');
    cookieGet.mockReturnValue({value: 'oauth-state'});
    cookies.mockResolvedValue({
      get: cookieGet,
      delete: cookieDelete,
    });
    createGoogleAuth.mockReturnValue({getToken});
    getToken.mockResolvedValue({
      tokens: {refresh_token: 'google-refresh-token'},
    });
    getContextFromSlug.mockResolvedValue({
      business: {
        id: 'business-1',
        profileId: 'profile-1',
        url: 'happy-paws',
      },
    });
    encrypt.mockReturnValue('encrypted-refresh-token');
    findFirst.mockResolvedValue(null);
    integrationCreate.mockResolvedValue({id: 'integration-1'});
    integrationUpdate.mockResolvedValue({id: 'integration-1'});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    connection.mockReset();
    cookieDelete.mockReset();
    cookieGet.mockReset();
    cookies.mockReset();
    createGoogleAuth.mockReset();
    encrypt.mockReset();
    findFirst.mockReset();
    getContextFromSlug.mockReset();
    getToken.mockReset();
    integrationCreate.mockReset();
    integrationUpdate.mockReset();
  });

  it('returns 400 when code is missing', async () => {
    const response = await GET(createRequest({state: 'oauth-state'}));

    expect(connection).toHaveBeenCalledOnce();
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'code is required',
    });
    expect(cookies).not.toHaveBeenCalled();
    expect(getToken).not.toHaveBeenCalled();
  });

  it('returns 500 when Google returns an OAuth error', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const response = await GET(
      createRequest({code: 'oauth-code', error: 'access_denied'}),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'access_denied',
    });
    expect(consoleError).toHaveBeenCalledWith(expect.any(Error));
    expect(cookies).not.toHaveBeenCalled();
    expect(getToken).not.toHaveBeenCalled();
  });

  it('returns 400 when state is missing', async () => {
    const response = await GET(createRequest({code: 'oauth-code'}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'state is required',
    });
    expect(cookies).not.toHaveBeenCalled();
    expect(getToken).not.toHaveBeenCalled();
  });

  it('deletes the state cookie and returns 400 when state is invalid', async () => {
    cookieGet.mockReturnValue({value: 'wrong-state'});

    const response = await GET(
      createRequest({code: 'oauth-code', state: 'oauth-state'}),
    );

    expect(cookieGet).toHaveBeenCalledWith('google-calendar-oauth-state');
    expect(cookieDelete).toHaveBeenCalledOnce();
    expect(cookieDelete).toHaveBeenCalledWith('google-calendar-oauth-state');
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'invalid state',
    });
    expect(createGoogleAuth).not.toHaveBeenCalled();
    expect(getToken).not.toHaveBeenCalled();
  });

  it('returns 500 when Google does not provide a refresh token', async () => {
    getToken.mockResolvedValue({tokens: {access_token: 'access-token'}});
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const response = await GET(
      createRequest({code: 'oauth-code', state: 'oauth-state'}),
    );

    expect(cookieDelete).toHaveBeenCalledWith('google-calendar-oauth-state');
    expect(getToken).toHaveBeenCalledWith('oauth-code');
    expect(getContextFromSlug).toHaveBeenCalledOnce();
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Could not retrieve a refresh token from oauth',
    });
    expect(consoleError).toHaveBeenCalledWith(expect.any(Error));
    expect(findFirst).not.toHaveBeenCalled();
    expect(integrationCreate).not.toHaveBeenCalled();
    expect(integrationUpdate).not.toHaveBeenCalled();
  });

  it('creates an integration and redirects to settings', async () => {
    const response = await GET(
      createRequest({code: 'oauth-code', state: 'oauth-state'}),
    );

    expect(cookieDelete).toHaveBeenCalledWith('google-calendar-oauth-state');
    expect(createGoogleAuth).toHaveBeenCalledOnce();
    expect(getToken).toHaveBeenCalledOnce();
    expect(getToken).toHaveBeenCalledWith('oauth-code');
    expect(getContextFromSlug).toHaveBeenCalledOnce();
    expect(findFirst).toHaveBeenCalledWith({
      where: {
        profileId: 'profile-1',
        type: 'google-calendar',
      },
    });
    expect(encrypt).toHaveBeenCalledOnce();
    expect(encrypt).toHaveBeenCalledWith('google-refresh-token');
    expect(integrationCreate).toHaveBeenCalledOnce();
    expect(integrationCreate).toHaveBeenCalledWith({
      data: {
        token: 'encrypted-refresh-token',
        type: 'google-calendar',
        profileId: 'profile-1',
      },
    });
    expect(integrationUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://toskio.test/happy-paws/dashboard/settings?tab=integrations&success=google-calendar',
    );
  });

  it('updates an existing Google Calendar integration', async () => {
    findFirst.mockResolvedValue({id: 'integration-1'});

    const response = await GET(
      createRequest({code: 'oauth-code', state: 'oauth-state'}),
    );

    expect(integrationUpdate).toHaveBeenCalledOnce();
    expect(integrationUpdate).toHaveBeenCalledWith({
      where: {
        id: 'integration-1',
      },
      data: {
        token: 'encrypted-refresh-token',
        type: 'google-calendar',
        profileId: 'profile-1',
      },
    });
    expect(integrationCreate).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
  });

  it('returns a generic 500 response when token exchange fails', async () => {
    const error = new Error('Google unavailable');
    getToken.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const response = await GET(
      createRequest({code: 'oauth-code', state: 'oauth-state'}),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Failed to create session with google calendar',
    });
    expect(consoleError).toHaveBeenCalledWith(error);
    expect(findFirst).not.toHaveBeenCalled();
    expect(integrationCreate).not.toHaveBeenCalled();
    expect(integrationUpdate).not.toHaveBeenCalled();
  });
});
