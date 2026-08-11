'use server';

import {revalidatePath} from 'next/cache';
import {resendTrigger} from '@/lib/email/resend';
import {googleCalendar} from '@/lib/integrations/calendar';
import prisma from '@/lib/prisma';
import {AppointmentStatus} from '@/lib/utils';

export async function confirmAppointment(id: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: {id},
      data: {
        status: AppointmentStatus.CONFIRMED,
      },
      include: {
        business: true,
        customer: true,
        service: true,
      },
    });

    const googleCalendarInt = await prisma.integration.findFirst({
      where: {
        profileId: appointment.business.profileId,
        type: 'google-calendar',
      },
    });

    if (googleCalendarInt) {
      googleCalendar
        .createAppointmentEvent(appointment, googleCalendarInt)
        .then(() =>
          console.log(
            '[confirm-appointment] created calendar event for',
            appointment.id,
          ),
        )
        .catch(err =>
          console.error(
            '[confirm-appointment] failed to create calendar event',
            err,
          ),
        );
    }

    resendTrigger
      .sendAppointmentConfirmed(appointment)
      .then(() =>
        console.log(
          '[confirm-appointment] successfully sent email for ',
          appointment.id,
        ),
      )
      .catch(err =>
        console.error('[confirm-appointment] failed to send email', err),
      );

    revalidatePath('/dashboard');

    return appointment;
  } catch (error) {
    console.error(error);
  }
}
