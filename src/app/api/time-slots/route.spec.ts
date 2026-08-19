import {NextRequest} from 'next/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

const {findMany} = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    appointment: {findMany},
  },
}));

import {GET} from './route';

function createRequest(date?: string) {
  const url = new URL('http://localhost/api/time-slots');

  if (date !== undefined) {
    url.searchParams.set('date', date);
  }

  return new NextRequest(url);
}

describe('GET /api/time-slots', () => {
  afterEach(() => {
    vi.useRealTimers();
    findMany.mockReset();
  });

  it('returns 400 when the date is missing', async () => {
    const response = await GET(createRequest());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'Missing date from query',
    });
    expect(findMany).not.toHaveBeenCalled();
  });

  it('returns the unbooked hourly slots for the requested date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 10, 9));
    findMany.mockResolvedValue([
      {date: new Date(2026, 7, 11, 9, 30)},
      {date: new Date(2026, 7, 11, 12, 45)},
    ]);

    const response = await GET(createRequest('2026-08-11T12:00:00'));

    const startOfDay = new Date('2026-08-11T12:00:00');
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date('2026-08-11T12:00:00');
    endOfDay.setHours(23, 59, 59, 999);

    expect(findMany).toHaveBeenCalledOnce();
    expect(findMany).toHaveBeenCalledWith({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      '10:00',
      '11:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]);
  });

  it('only returns slots that are at least two hours from now', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 11, 10));
    findMany.mockResolvedValue([]);

    const response = await GET(createRequest('2026-08-11T12:00:00'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]);
  });

  it('excludes slots less than two hours from now', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 11, 10, 1));
    findMany.mockResolvedValue([]);

    const response = await GET(createRequest('2026-08-11T12:00:00'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]);
  });

  it('propagates errors from Prisma', async () => {
    const error = new Error('Database unavailable');
    findMany.mockRejectedValue(error);

    await expect(GET(createRequest('2026-08-11'))).rejects.toBe(error);
  });
});
