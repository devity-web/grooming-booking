import {afterEach, describe, expect, it, vi} from 'vitest';

const {update} = vi.hoisted(() => ({
  update: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    business: {update},
  },
}));

import {updateBusiness} from './update-business';

const businessData = {
  name: 'Toskio Grooming',
  url: 'toskio-grooming',
  address: '123 Main Street',
};

describe('updateBusiness', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    update.mockReset();
  });

  it('updates and returns the business', async () => {
    const business = {
      id: 'business-1',
      ...businessData,
    };
    update.mockResolvedValue(business);

    await expect(updateBusiness('business-1', businessData)).resolves.toBe(
      business,
    );
    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith({
      where: {id: 'business-1'},
      data: businessData,
    });
  });

  it('throws when the business is not found', async () => {
    update.mockResolvedValue(null);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(
      updateBusiness('missing-business', businessData),
    ).rejects.toThrow('Business with id not found');
  });

  it('logs and rethrows errors from Prisma', async () => {
    const error = new Error('Database unavailable');
    update.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(updateBusiness('business-1', businessData)).rejects.toBe(
      error,
    );
    expect(consoleError).toHaveBeenCalledWith(
      '[update-business] failed to update',
      error,
    );
  });
});
