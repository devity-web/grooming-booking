import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const {
  appointmentUpdate,
  createAppointmentEvent,
  integrationFindFirst,
  revalidatePath,
  sendAppointmentConfirmed,
} = vi.hoisted(() => ({
  appointmentUpdate: vi.fn(),
  createAppointmentEvent: vi.fn(),
  integrationFindFirst: vi.fn(),
  revalidatePath: vi.fn(),
  sendAppointmentConfirmed: vi.fn(),
}));

vi.mock('next/cache', () => ({revalidatePath}));

vi.mock('@/lib/email/resend', () => ({
  resendTrigger: {sendAppointmentConfirmed},
}));

vi.mock('@/lib/integrations/calendar', () => ({
  googleCalendar: {createAppointmentEvent},
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    appointment: {update: appointmentUpdate},
    integration: {findFirst: integrationFindFirst},
  },
}));

import {confirmAppointment} from './confirm-appointment';

const appointment = {
  id: 'appointment-1',
  status: 'confirmed',
  business: {
    id: 'business-1',
    profileId: 'profile-1',
  },
  customer: {
    id: 'customer-1',
    email: 'customer@example.com',
  },
  service: {
    id: 'service-1',
    name: 'Banho',
  },
};

async function flushSideEffects() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('confirmAppointment', () => {
  beforeEach(() => {
    appointmentUpdate.mockResolvedValue(appointment);
    integrationFindFirst.mockResolvedValue(null);
    createAppointmentEvent.mockResolvedValue(undefined);
    sendAppointmentConfirmed.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    appointmentUpdate.mockReset();
    createAppointmentEvent.mockReset();
    integrationFindFirst.mockReset();
    revalidatePath.mockReset();
    sendAppointmentConfirmed.mockReset();
  });

  it('confirms the appointment, emails the customer, and revalidates', async () => {
    await expect(confirmAppointment('appointment-1')).resolves.toEqual(
      appointment,
    );
    await flushSideEffects();

    expect(appointmentUpdate).toHaveBeenCalledWith({
      where: {id: 'appointment-1'},
      data: {status: 'confirmed'},
      include: {
        business: true,
        customer: true,
        service: true,
      },
    });
    expect(integrationFindFirst).toHaveBeenCalledWith({
      where: {
        profileId: 'profile-1',
        type: 'google-calendar',
      },
    });
    expect(sendAppointmentConfirmed).toHaveBeenCalledWith(appointment);
    expect(createAppointmentEvent).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('creates a calendar event when Google Calendar is connected', async () => {
    const integration = {
      id: 'integration-1',
      type: 'google-calendar',
    };
    integrationFindFirst.mockResolvedValue(integration);

    await confirmAppointment('appointment-1');
    await flushSideEffects();

    expect(createAppointmentEvent).toHaveBeenCalledWith(
      appointment,
      integration,
    );
    expect(sendAppointmentConfirmed).toHaveBeenCalledWith(appointment);
  });

  it('does not fail confirmation when notifications reject', async () => {
    const calendarError = new Error('Calendar unavailable');
    const emailError = new Error('Email unavailable');
    integrationFindFirst.mockResolvedValue({id: 'integration-1'});
    createAppointmentEvent.mockRejectedValue(calendarError);
    sendAppointmentConfirmed.mockRejectedValue(emailError);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(confirmAppointment('appointment-1')).resolves.toEqual(
      appointment,
    );
    await flushSideEffects();

    expect(consoleError).toHaveBeenCalledWith(
      '[confirm-appointment] failed to create calendar event',
      calendarError,
    );
    expect(consoleError).toHaveBeenCalledWith(
      '[confirm-appointment] failed to send email',
      emailError,
    );
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('logs database failures and skips side effects', async () => {
    const error = new Error('Database unavailable');
    appointmentUpdate.mockRejectedValue(error);
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(confirmAppointment('appointment-1')).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith(error);
    expect(integrationFindFirst).not.toHaveBeenCalled();
    expect(sendAppointmentConfirmed).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
