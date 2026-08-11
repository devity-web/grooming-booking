'use server';

import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma';
import {resend, TEMPLATES} from '@/lib/resend';
import {
  AppointmentStatus,
  formatDate,
  formatTime,
  moneyFormat,
} from '@/lib/utils';

export async function confirmAppointment(id: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: {id},
      data: {
        status: AppointmentStatus.CONFIRMED,
      },
      select: {
        customer: true,
        business: true,
        service: true,
        date: true,
        id: true,
      },
    });

    await resend.emails.send({
      from: 'Toskio <noreply@tt.mthstudio.dev>',
      to: appointment.customer.email,
      subject: 'Seu agendamento foi confirmado',
      template: {
        id: TEMPLATES.appointmentConfirmed,
        variables: {
          BUSINESS_NAME: appointment.business.name,
          PET_NAME: 'Max',
          CUSTOMER_NAME: appointment.customer.name,
          SERVICE_NAME: appointment.service.name,
          APPOINTMENT_DATE: formatDate(appointment.date),
          APPOINTMENT_TIME: formatTime(appointment.date),
          BUSINESS_ADDRESS: 'Rua dos Sismeiros 22 RC B',
          TOTAL_PRICE: moneyFormat.format(appointment.service.price),
          BOOKING_REFERENCE: `#${appointment.id.substring(0, 8).toUpperCase()}`,
        },
      },
    });

    revalidatePath('/dashboard');

    return appointment;
  } catch (error) {
    console.error(error);
  }
}
