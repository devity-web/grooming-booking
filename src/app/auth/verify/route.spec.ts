import {NextRequest} from 'next/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {cookieSet, cookies, createClient, findFirst, verifyOtp} = vi.hoisted(
  () => ({
    cookieSet: vi.fn(),
    cookies: vi.fn(),
    createClient: vi.fn(),
    findFirst: vi.fn(),
    verifyOtp: vi.fn(),
  }),
);

vi.mock('next/headers', () => ({cookies}));

vi.mock('@/lib/prisma', () => ({
  default: {
    business: {findFirst},
  },
}));

vi.mock('@/lib/supabase/server', () => ({createClient}));

import {GET} from './route';

function createRequest(params: {tokenHash?: string; type?: string} = {}) {
  const url = new URL('http://localhost/auth/verify');

  if (params.tokenHash !== undefined) {
    url.searchParams.set('token_hash', params.tokenHash);
  }

  if (params.type !== undefined) {
    url.searchParams.set('type', params.type);
  }

  return new NextRequest(url);
}

describe('GET /auth/verify', () => {
  beforeEach(() => {
    vi.stubEnv('APP_URL', 'https://toskio.test');
    cookies.mockResolvedValue({set: cookieSet});
    createClient.mockResolvedValue({
      auth: {verifyOtp},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    cookieSet.mockReset();
    cookies.mockReset();
    createClient.mockReset();
    findFirst.mockReset();
    verifyOtp.mockReset();
  });

  it('returns 400 when token_hash is missing', async () => {
    const response = await GET(createRequest({type: 'email'}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'token_hash is required',
    });
    expect(createClient).not.toHaveBeenCalled();
    expect(verifyOtp).not.toHaveBeenCalled();
  });

  it('returns 400 when type is missing', async () => {
    const response = await GET(createRequest({tokenHash: 'token-hash'}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'type is required',
    });
    expect(createClient).not.toHaveBeenCalled();
    expect(verifyOtp).not.toHaveBeenCalled();
  });

  it('returns 500 when Supabase cannot verify the token', async () => {
    const error = new Error('Token has expired');
    verifyOtp.mockResolvedValue({
      data: {user: null},
      error,
    });
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const response = await GET(
      createRequest({tokenHash: 'token-hash', type: 'email'}),
    );

    expect(verifyOtp).toHaveBeenCalledOnce();
    expect(verifyOtp).toHaveBeenCalledWith({
      token_hash: 'token-hash',
      type: 'email',
    });
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Something went wrong.',
    });
    expect(consoleError).toHaveBeenCalledWith(
      '[auth-verify] failed to verifyOtp',
      error,
    );
    expect(findFirst).not.toHaveBeenCalled();
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it('returns 500 when the verified user has no business', async () => {
    verifyOtp.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    findFirst.mockResolvedValue(null);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const response = await GET(
      createRequest({tokenHash: 'token-hash', type: 'email'}),
    );

    expect(findFirst).toHaveBeenCalledOnce();
    expect(findFirst).toHaveBeenCalledWith({
      where: {
        profile: {
          userId: 'user-1',
        },
      },
    });
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Unabel to find business for account',
    });
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it('stores the business URL and redirects to its dashboard', async () => {
    verifyOtp.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    findFirst.mockResolvedValue({
      id: 'business-1',
      url: 'happy-paws',
    });

    const response = await GET(
      createRequest({tokenHash: 'token-hash', type: 'email'}),
    );

    expect(verifyOtp).toHaveBeenCalledWith({
      token_hash: 'token-hash',
      type: 'email',
    });
    expect(findFirst).toHaveBeenCalledWith({
      where: {
        profile: {
          userId: 'user-1',
        },
      },
    });
    expect(cookieSet).toHaveBeenCalledOnce();
    expect(cookieSet).toHaveBeenCalledWith('business-url', 'happy-paws', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'https://toskio.test/happy-paws/dashboard',
    );
  });
});
