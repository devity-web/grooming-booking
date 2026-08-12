import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {
  businessFindFirst,
  cookieSet,
  cookies,
  createClient,
  signInWithPassword,
} = vi.hoisted(() => ({
  businessFindFirst: vi.fn(),
  cookieSet: vi.fn(),
  cookies: vi.fn(),
  createClient: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock('next/headers', () => ({cookies}));

vi.mock('@/lib/prisma', () => ({
  default: {
    business: {findFirst: businessFindFirst},
  },
}));

vi.mock('@/lib/supabase/server', () => ({createClient}));

import {signIn} from './sign-in';

const credentials = {
  email: 'owner@example.com',
  password: 'secret-password',
};

describe('signIn', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    createClient.mockResolvedValue({
      auth: {signInWithPassword},
    });
    cookies.mockResolvedValue({set: cookieSet});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    businessFindFirst.mockReset();
    cookieSet.mockReset();
    cookies.mockReset();
    createClient.mockReset();
    signInWithPassword.mockReset();
  });

  it('returns the Supabase error when authentication fails', async () => {
    const error = new Error('Invalid login credentials');
    signInWithPassword.mockResolvedValue({
      data: {user: null},
      error,
    });

    await expect(signIn(credentials)).resolves.toEqual({error});
    expect(signInWithPassword).toHaveBeenCalledOnce();
    expect(signInWithPassword).toHaveBeenCalledWith(credentials);
    expect(cookies).not.toHaveBeenCalled();
    expect(businessFindFirst).not.toHaveBeenCalled();
  });

  it('returns an error when Supabase does not return a user', async () => {
    signInWithPassword.mockResolvedValue({
      data: {user: null},
      error: null,
    });

    await expect(signIn(credentials)).resolves.toEqual({
      error: 'Something went wrong.',
    });
    expect(cookies).not.toHaveBeenCalled();
    expect(businessFindFirst).not.toHaveBeenCalled();
  });

  it('returns an error when the user has no business', async () => {
    signInWithPassword.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    businessFindFirst.mockResolvedValue(null);

    await expect(signIn(credentials)).resolves.toEqual({
      error: 'Missing business',
    });
    expect(businessFindFirst).toHaveBeenCalledOnce();
    expect(businessFindFirst).toHaveBeenCalledWith({
      where: {
        profile: {
          userId: 'user-1',
        },
      },
    });
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it('sets the tenant cookie and returns the user and business', async () => {
    const user = {id: 'user-1', email: credentials.email};
    const business = {
      id: 'business-1',
      url: 'happy-paws',
    };
    signInWithPassword.mockResolvedValue({
      data: {user},
      error: null,
    });
    businessFindFirst.mockResolvedValue(business);

    await expect(signIn(credentials)).resolves.toEqual({user, business});
    expect(cookieSet).toHaveBeenCalledOnce();
    expect(cookieSet).toHaveBeenCalledWith('business-url', 'happy-paws', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  });

  it('uses a secure tenant cookie in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    signInWithPassword.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    businessFindFirst.mockResolvedValue({
      id: 'business-1',
      url: 'happy-paws',
    });

    await signIn(credentials);

    expect(cookieSet).toHaveBeenCalledWith(
      'business-url',
      'happy-paws',
      expect.objectContaining({secure: true}),
    );
  });

  it('propagates errors from the business lookup', async () => {
    const error = new Error('Database unavailable');
    signInWithPassword.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    businessFindFirst.mockRejectedValue(error);

    await expect(signIn(credentials)).rejects.toBe(error);
    expect(cookieSet).not.toHaveBeenCalled();
  });
});
