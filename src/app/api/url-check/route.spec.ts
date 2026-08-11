import {NextRequest} from 'next/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

const {findFirst} = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    business: {findFirst},
  },
}));

import {GET} from './route';

function createRequest(slug?: string) {
  const url = new URL('http://localhost/api/url-check');

  if (slug !== undefined) {
    url.searchParams.set('slug', slug);
  }

  return new NextRequest(url);
}

describe('GET /api/url-check', () => {
  afterEach(() => {
    findFirst.mockReset();
  });

  it('returns 400 when the slug is missing', async () => {
    const response = await GET(createRequest());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Missing business slug',
    });
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('returns 409 when the slug is already in use', async () => {
    findFirst.mockResolvedValue({id: 'business-1'});

    const response = await GET(createRequest('toskio-grooming'));

    expect(findFirst).toHaveBeenCalledOnce();
    expect(findFirst).toHaveBeenCalledWith({
      where: {url: 'toskio-grooming'},
      select: {id: true},
    });
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      message: 'This url slug is not valid',
    });
  });

  it('returns 200 when the slug is available', async () => {
    findFirst.mockResolvedValue(null);

    const response = await GET(createRequest('available-slug'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'This is a valid business url',
    });
  });

  it('propagates errors from Prisma', async () => {
    const error = new Error('Database unavailable');
    findFirst.mockRejectedValue(error);

    await expect(GET(createRequest('toskio-grooming'))).rejects.toBe(error);
  });
});
