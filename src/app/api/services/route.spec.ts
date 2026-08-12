import {NextRequest} from 'next/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

const {findMany, connection} = vi.hoisted(() => ({
  findMany: vi.fn(),
  connection: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    service: {findMany},
  },
}));

vi.mock(import('next/server'), async importOriginal => {
  const actual = await importOriginal();
  return {
    ...actual,
    connection,
  };
});

import {GET} from './route';

function createRequest(id?: string) {
  const url = new URL('http://localhost/api/services');

  if (id !== undefined) {
    url.searchParams.set('businessId', id);
  }

  return new NextRequest(url);
}

describe('GET /api/services', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    findMany.mockReset();
  });

  it('returns 400 when the businessId is missing', async () => {
    const response = await GET(createRequest());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'businessId is required',
    });
    expect(findMany).not.toHaveBeenCalled();
  });

  it('returns the active services for the requested business', async () => {
    const services = [
      {
        id: 'service-1',
        name: 'Full Groom',
        description: 'A complete grooming service',
        price: 45,
        isActive: true,
        businessId: 'business-1',
      },
      {
        id: 'service-2',
        name: 'Nail Trim',
        description: 'Nail trimming service',
        price: 15,
        isActive: true,
        businessId: 'business-1',
      },
    ];
    findMany.mockResolvedValue(services);

    const response = await GET(createRequest('toskio-grooming'));

    expect(findMany).toHaveBeenCalledOnce();
    expect(findMany).toHaveBeenCalledWith({
      where: {
        isActive: true,
        business: {id: 'toskio-grooming'},
      },
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(services);
  });

  it('returns 500 when Prisma fails', async () => {
    const error = new Error('Database unavailable');
    findMany.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const response = await GET(createRequest('toskio-grooming'));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: 'Database unavailable',
    });
    expect(consoleError).toHaveBeenCalledWith(error);
  });
});
