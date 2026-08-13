import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {getContextFromSlug, revalidatePath, serviceUpsert} = vi.hoisted(() => ({
  getContextFromSlug: vi.fn(),
  revalidatePath: vi.fn(),
  serviceUpsert: vi.fn(),
}));

vi.mock('next/cache', () => ({revalidatePath}));

vi.mock('@/lib/prisma', () => ({
  default: {
    service: {upsert: serviceUpsert},
  },
}));

vi.mock('@/lib/tenant', () => ({getContextFromSlug}));

import {upsertService} from './upsert-service';

const serviceData = {
  name: 'Banho completo',
  description: 'Banho e secagem',
  price: 35,
};

describe('upsertService', () => {
  beforeEach(() => {
    getContextFromSlug.mockResolvedValue({
      business: {id: 'business-1'},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    getContextFromSlug.mockReset();
    revalidatePath.mockReset();
    serviceUpsert.mockReset();
  });

  it('creates a service for the current business', async () => {
    const service = {id: 'service-1', ...serviceData};
    serviceUpsert.mockResolvedValue(service);

    await expect(upsertService(serviceData)).resolves.toEqual(service);
    expect(serviceUpsert).toHaveBeenCalledWith({
      where: {id: ''},
      create: {
        ...serviceData,
        businessId: 'business-1',
      },
      update: serviceData,
    });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/services');
  });

  it('updates a service by id', async () => {
    const data = {id: 'service-1', ...serviceData};
    serviceUpsert.mockResolvedValue(data);

    await expect(upsertService(data)).resolves.toEqual(data);
    expect(serviceUpsert).toHaveBeenCalledWith({
      where: {id: 'service-1'},
      create: {
        ...data,
        businessId: 'business-1',
      },
      update: data,
    });
  });

  it('logs failures without revalidating', async () => {
    const error = new Error('Database unavailable');
    serviceUpsert.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(upsertService(serviceData)).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(error);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
