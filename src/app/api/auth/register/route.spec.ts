import {afterEach, describe, expect, it, vi} from 'vitest';

const {signUp} = vi.hoisted(() => ({signUp: vi.fn()}));

vi.mock('@/actions/sign-up', () => ({signUp}));

import {POST} from './route';

const registration = {
  firstName: 'Taylor',
  lastName: 'Smith',
  company: 'Happy Paws',
  email: 'owner@example.com',
  password: 'secret-password',
};

function request(body: unknown) {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/register', () => {
  afterEach(() => signUp.mockReset());

  it('rejects invalid registration details before signup', async () => {
    const response = await POST(request({email: 'invalid'}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Invalid registration details',
    });
    expect(signUp).not.toHaveBeenCalled();
  });

  it('registers valid customer details', async () => {
    signUp.mockResolvedValue(undefined);

    const response = await POST(request(registration));

    expect(signUp).toHaveBeenCalledWith(registration);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({success: true});
  });

  it('returns signup errors', async () => {
    signUp.mockRejectedValue(new Error('Email already registered'));

    const response = await POST(request(registration));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Email already registered',
    });
  });
});
