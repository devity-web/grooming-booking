import {afterEach, describe, expect, it, vi} from 'vitest';

const {appointmentCreate, businessFindUnique, createOrGetUser} = vi.hoisted(
  () => ({
    appointmentCreate: vi.fn(),
    businessFindUnique: vi.fn(),
    createOrGetUser: vi.fn(),
  }),
);

vi.mock('@/lib/prisma', () => ({
  default: {
    appointment: {create: appointmentCreate},
    business: {findUnique: businessFindUnique},
  },
}));

vi.mock('./create-or-get-user', () => ({createOrGetUser}));

import {createAppointment} from './create-appointment';

const input = {
  form: {
    name: 'Taylor Smith',
    email: 'taylor@example.com',
    phone: '910000000',
  },
  date: new Date('2026-08-20T00:00:00.000Z'),
  slot: '10:30',
  petName: 'Toby',
  service: 'service-1',
};

describe('createAppointment', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    appointmentCreate.mockReset();
    businessFindUnique.mockReset();
    createOrGetUser.mockReset();
  });

  it('creates an appointment for the resolved customer', async () => {
    const business = {id: 'business-1', name: 'Happy Paws'};
    const customer = {id: 'customer-1'};
    const appointment = {id: 'appointment-1'};
    const expectedDate = new Date(input.date);
    expectedDate.setHours(10, 30, 0, 0);
    businessFindUnique.mockResolvedValue(business);
    createOrGetUser.mockResolvedValue({success: true, user: customer});
    appointmentCreate.mockResolvedValue(appointment);

    await expect(createAppointment('business-1', input)).resolves.toEqual({
      success: true,
      appointment,
    });
    expect(businessFindUnique).toHaveBeenCalledWith({
      where: {id: 'business-1'},
    });
    expect(createOrGetUser).toHaveBeenCalledWith(input.form, business);
    expect(appointmentCreate).toHaveBeenCalledWith({
      data: {
        customerId: 'customer-1',
        businessId: 'business-1',
        date: expectedDate,
        serviceId: 'service-1',
        petName: 'Toby',
      },
    });
  });

  it('rejects when the business does not exist', async () => {
    businessFindUnique.mockResolvedValue(null);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(createAppointment('missing', input)).rejects.toThrow(
      'Business with slug not found',
    );
    expect(createOrGetUser).not.toHaveBeenCalled();
    expect(appointmentCreate).not.toHaveBeenCalled();
  });

  it('rejects when a customer cannot be resolved', async () => {
    businessFindUnique.mockResolvedValue({id: 'business-1'});
    createOrGetUser.mockResolvedValue({success: false});
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(createAppointment('business-1', input)).rejects.toThrow(
      'Falha ao criar usuário. Tente novamente.',
    );
    expect(appointmentCreate).not.toHaveBeenCalled();
  });

  it('rejects when Prisma does not return an appointment', async () => {
    businessFindUnique.mockResolvedValue({id: 'business-1'});
    createOrGetUser.mockResolvedValue({
      success: true,
      user: {id: 'customer-1'},
    });
    appointmentCreate.mockResolvedValue(null);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(createAppointment('business-1', input)).rejects.toThrow(
      'Failed to create appointment',
    );
  });

  it('logs and rethrows Prisma errors', async () => {
    const error = new Error('Database unavailable');
    businessFindUnique.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(createAppointment('business-1', input)).rejects.toBe(error);
    expect(consoleError).toHaveBeenCalledWith(
      '[create-appointment] Error creating appointment',
      error,
    );
  });
});
