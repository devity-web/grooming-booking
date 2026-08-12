import {google} from 'googleapis';
import type {Integration} from '@/app/generated/prisma/client';
import type {Appointment} from '@/types/appointment';
import {decrypt} from '../encryption';
import {getServerEnv} from '../env';
import {formatDate, formatTime} from '../utils';

const env = getServerEnv();

export const createGoogleAuth = () => {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    `${env.APP_URL}/api/integrations/google-calendar/callback`,
  );
};

export const googleCalendar = {
  createAppointmentEvent: (
    appointment: Appointment,
    googleCalendarInt: Integration,
  ) => {
    const endDate = new Date(appointment.date);
    endDate.setHours(endDate.getHours() + 1);

    const oauth = createGoogleAuth();
    oauth.setCredentials({
      refresh_token: decrypt(googleCalendarInt.token),
    });

    const calendar = google.calendar({version: 'v3', auth: oauth});

    return calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `[Toskio] ${appointment.petName} - ${appointment.customer.name}`,
        description: `
        [${appointment.status.toUpperCase()}] ${appointment.customer.name}

        🏠 ${appointment.business.name}
        🕕 ${formatDate(appointment.date, false)} · ${formatTime(appointment.date)}
        📍 ${appointment.business.address}
        
        
        🐶 ${appointment.petName}
        🛁 ${appointment.service.name}

        - Created by Toskio.app
        `,
        location: appointment.business.address,
        start: {
          dateTime: appointment.date.toISOString(),
          timeZone: 'Europe/Lisbon',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Europe/Lisbon',
        },
      },
    });
  },
};
