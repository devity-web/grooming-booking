import {Resend} from 'resend';
import type {Appointment} from '@/types/appointment';
import {getServerEnv} from '../env';
import {formatDate, formatTime, moneyFormat} from '../utils';

/**
 * Singleton Resend client instance
 *
 * Usage:
 * ```ts
 * import { resend } from '@/lib/resend';
 *
 * const { data, error } = await resend.emails.send({
 *   from: 'delivered@resend.dev',
 *   to: 'delivered@resend.dev',
 *   subject: 'Hello',
 *   html: '<p>Hello World</p>'
 * });
 * ```
 */
const env = getServerEnv();

export const resend = new Resend(env.RESEND_API_KEY);

export const TEMPLATES = Object.freeze({
  appointmentConfirmed: 'appointment-confirmation',
});

export const resendTrigger = {
  sendAppointmentConfirmed: async (appointment: Appointment) => {
    return resend.emails.send({
      from: 'Toskio <noreply@tt.mthstudio.dev>',
      to: appointment.customer.email,
      subject: 'Seu agendamento foi confirmado',
      template: {
        id: TEMPLATES.appointmentConfirmed,
        variables: {
          BUSINESS_NAME: appointment.business.name,
          PET_NAME: appointment.petName,
          CUSTOMER_NAME: appointment.customer.name,
          SERVICE_NAME: appointment.service.name,
          APPOINTMENT_DATE: formatDate(appointment.date),
          APPOINTMENT_TIME: formatTime(appointment.date),
          BUSINESS_ADDRESS: appointment.business.address,
          TOTAL_PRICE: moneyFormat.format(appointment.service.price),
          BOOKING_REFERENCE: `#${appointment.id.substring(0, 8).toUpperCase()}`,
        },
      },
    });
  },
};
