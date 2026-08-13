import {afterEach, describe, expect, it, vi} from 'vitest';
import type {Business} from '@/app/generated/prisma/client';

const {customerCreate, customerFindFirst} = vi.hoisted(() => ({
  customerCreate: vi.fn(),
  customerFindFirst: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    customer: {
      create: customerCreate,
      findFirst: customerFindFirst,
    },
  },
}));

import {createOrGetUser} from './create-or-get-user';

const business = {id: 'business-1'} as Business;
const customerData = {
  name: 'Taylor Smith',
  email: 'taylor@example.com',
  phone: '910000000',
};

describe('createOrGetUser', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    customerCreate.mockReset();
    customerFindFirst.mockReset();
  });

  it('returns an existing customer for the business', async () => {
    const customer = {id: 'customer-1', ...customerData};
    customerFindFirst.mockResolvedValue(customer);

    await expect(createOrGetUser(customerData, business)).resolves.toEqual({
      success: true,
      user: customer,
    });
    expect(customerFindFirst).toHaveBeenCalledWith({
      where: {
        email: 'taylor@example.com',
        businessId: 'business-1',
      },
    });
    expect(customerCreate).not.toHaveBeenCalled();
  });

  it('creates a customer when none exists', async () => {
    const customer = {
      id: 'customer-1',
      ...customerData,
      businessId: 'business-1',
    };
    customerFindFirst.mockResolvedValue(null);
    customerCreate.mockResolvedValue(customer);

    await expect(createOrGetUser(customerData, business)).resolves.toEqual({
      success: true,
      user: customer,
    });
    expect(customerCreate).toHaveBeenCalledWith({
      data: {
        ...customerData,
        businessId: 'business-1',
      },
    });
  });

  it('returns a localized failure when customer lookup fails', async () => {
    const error = new Error('Database unavailable');
    customerFindFirst.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(createOrGetUser(customerData, business)).resolves.toEqual({
      success: false,
      error: 'Falha ao criar usuário. Tente novamente.',
    });
    expect(customerCreate).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      '[create-or-get-user] Error creating user',
      error,
    );
  });

  it('returns a localized failure when customer creation fails', async () => {
    const error = new Error('Unable to create customer');
    customerFindFirst.mockResolvedValue(null);
    customerCreate.mockRejectedValue(error);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(createOrGetUser(customerData, business)).resolves.toEqual({
      success: false,
      error: 'Falha ao criar usuário. Tente novamente.',
    });
  });
});
