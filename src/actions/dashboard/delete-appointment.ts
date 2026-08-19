'use server';

import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma';

export async function deleteAppointment(id: string) {
  try {
    const appoinment = await prisma.appointment.delete({
      where: {id},
    });

    if (!appoinment) {
      throw new Error('Appointment not found');
    }

    revalidatePath('/dashboard/appointments');

    return {message: 'Appointment successfully deleted'};
  } catch (error) {
    console.error(error);
    throw error;
  }
}
