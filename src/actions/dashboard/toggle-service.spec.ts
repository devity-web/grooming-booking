import {afterEach, describe, expect, it, vi} from 'vitest';

const {revalidatePath, serviceUpdate} = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  serviceUpdate: vi.fn(),
}));

vi.mock('next/cache', () => ({revalidatePath}));

vi.mock('@/lib/prisma', () => ({
  default: {
    service: {update: serviceUpdate},
  },
}));

import {toggleService} from './toggle-service';

describe('toggleService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    revalidatePath.mockReset();
    serviceUpdate.mockReset();
  });

  it('enables an inactive service and revalidates the services page', async () => {
    serviceUpdate.mockResolvedValue({id: 'service-1', isActive: true});

    await expect(toggleService('service-1', false)).resolves.toEqual({
      message: 'Service successfully enabled',
    });
    expect(serviceUpdate).toHaveBeenCalledWith({
      where: {id: 'service-1'},
      data: {isActive: true},
    });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard/services');
  });

  it('disables an active service', async () => {
    serviceUpdate.mockResolvedValue({id: 'service-1', isActive: false});

    await expect(toggleService('service-1', true)).resolves.toEqual({
      message: 'Service successfully disabled',
    });
    expect(serviceUpdate).toHaveBeenCalledWith({
      where: {id: 'service-1'},
      data: {isActive: false},
    });
  });

  it('returns a not-found message when Prisma returns no service', async () => {
    serviceUpdate.mockResolvedValue(null);

    await expect(toggleService('missing-service', false)).resolves.toEqual({
      message: 'Service not found',
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('logs update failures without revalidating', async () => {
    const error = new Error('Database unavailable');
    serviceUpdate.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(toggleService('service-1', false)).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(error);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
