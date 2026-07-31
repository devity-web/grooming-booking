'use server';

import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma';
import {AppointmentStatus} from '@/lib/utils';

export async function confirmAppointment(id: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: {id},
      data: {
        status: AppointmentStatus.CONFIRMED,
      },
    });

    revalidatePath('/dashboard');

    return appointment;
  } catch (error) {
    console.error(error);
  }
}
