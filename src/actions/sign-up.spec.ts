import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {businessCreate, createClient, profileCreate, supabaseSignUp} =
  vi.hoisted(() => ({
    businessCreate: vi.fn(),
    createClient: vi.fn(),
    profileCreate: vi.fn(),
    supabaseSignUp: vi.fn(),
  }));

vi.mock('@/lib/prisma', () => ({
  default: {
    business: {create: businessCreate},
    profile: {create: profileCreate},
  },
}));

vi.mock('@/lib/supabase/server', () => ({createClient}));

import {signUp} from './sign-up';

const signUpData = {
  firstName: 'Taylor',
  lastName: 'Smith',
  email: 'owner@example.com',
  password: 'secret-password',
  company: 'Happy Paws',
};

describe('signUp', () => {
  beforeEach(() => {
    vi.stubEnv('APP_URL', 'https://toskio.test');
    createClient.mockResolvedValue({
      auth: {signUp: supabaseSignUp},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    businessCreate.mockReset();
    createClient.mockReset();
    profileCreate.mockReset();
    supabaseSignUp.mockReset();
  });

  it('signs up the user and provisions their profile and business', async () => {
    supabaseSignUp.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    profileCreate.mockResolvedValue({id: 'profile-1', userId: 'user-1'});
    businessCreate.mockResolvedValue({id: 'business-1'});

    await expect(signUp(signUpData)).resolves.toBeUndefined();
    expect(supabaseSignUp).toHaveBeenCalledOnce();
    expect(supabaseSignUp).toHaveBeenCalledWith({
      email: 'owner@example.com',
      password: 'secret-password',
      options: {
        emailRedirectTo: 'https://toskio.test/auth/verify',
        data: {
          first_name: 'Taylor',
          last_name: 'Smith',
        },
      },
    });
    expect(profileCreate).toHaveBeenCalledOnce();
    expect(profileCreate).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
      },
    });
    expect(businessCreate).toHaveBeenCalledOnce();
    expect(businessCreate).toHaveBeenCalledWith({
      data: {
        profileId: 'profile-1',
        meta: {},
        name: 'Happy Paws',
        url: 'happy-paws',
        address: 'Test',
      },
    });
  });

  it('throws the Supabase error and does not provision records', async () => {
    const error = new Error('Email already registered');
    supabaseSignUp.mockResolvedValue({
      data: {user: null},
      error,
    });

    await expect(signUp(signUpData)).rejects.toBe(error);
    expect(profileCreate).not.toHaveBeenCalled();
    expect(businessCreate).not.toHaveBeenCalled();
  });

  it('throws when Supabase succeeds without returning a user', async () => {
    supabaseSignUp.mockResolvedValue({
      data: {user: null},
      error: null,
    });

    await expect(signUp(signUpData)).rejects.toThrow(
      'Something went wrong when creating user.',
    );
    expect(profileCreate).not.toHaveBeenCalled();
    expect(businessCreate).not.toHaveBeenCalled();
  });

  it('does not create a business when profile creation fails', async () => {
    const error = new Error('Unable to create profile');
    supabaseSignUp.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    profileCreate.mockRejectedValue(error);

    await expect(signUp(signUpData)).rejects.toBe(error);
    expect(businessCreate).not.toHaveBeenCalled();
  });

  it('propagates errors from business creation', async () => {
    const error = new Error('Unable to create business');
    supabaseSignUp.mockResolvedValue({
      data: {user: {id: 'user-1'}},
      error: null,
    });
    profileCreate.mockResolvedValue({id: 'profile-1', userId: 'user-1'});
    businessCreate.mockRejectedValue(error);

    await expect(signUp(signUpData)).rejects.toBe(error);
    expect(profileCreate).toHaveBeenCalledOnce();
    expect(businessCreate).toHaveBeenCalledOnce();
  });
});
