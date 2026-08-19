import {afterEach, describe, expect, it, vi} from 'vitest';

const {signIn} = vi.hoisted(() => ({signIn: vi.fn()}));

vi.mock('@/actions/sign-in', () => ({signIn}));

import {POST} from './route';

const credentials = {
  email: 'owner@example.com',
  password: 'secret-password',
};

function request(body: unknown) {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  afterEach(() => signIn.mockReset());

  it('rejects invalid credentials before authentication', async () => {
    const response = await POST(request({email: 'invalid'}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid credentials',
    });
    expect(signIn).not.toHaveBeenCalled();
  });

  it('returns authentication errors', async () => {
    signIn.mockResolvedValue({
      business: null,
      error: new Error('Invalid login credentials'),
    });

    const response = await POST(request(credentials));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid login credentials',
    });
  });

  it('returns the authenticated business URL', async () => {
    signIn.mockResolvedValue({
      business: {id: 'business-1', url: 'happy-paws'},
      user: {id: 'user-1'},
    });

    const response = await POST(request(credentials));

    expect(signIn).toHaveBeenCalledWith(credentials);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      business: {url: 'happy-paws'},
    });
  });

  it('returns unexpected server errors', async () => {
    signIn.mockRejectedValue(new Error('Database unavailable'));

    const response = await POST(request(credentials));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Database unavailable',
    });
  });
});
