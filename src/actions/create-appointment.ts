'use server';

import prisma from '@/lib/prisma';
import {type CreateUserInput, createOrGetUser} from './create-or-get-user';

type createAppointmentInput = {
  form: CreateUserInput;
  date: Date;
  slot: string;
  service: string;
};

export async function createAppointment(data: createAppointmentInput) {
  try {
    console.log('[create-appointment] Creating appointment with data', data);

    const {user} = await createOrGetUser(data.form);

    if (!user) {
      throw new Error('Falha ao criar usuário. Tente novamente.');
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        date: dateAndSlotToDate(data.date, data.slot),
        serviceId: data.service,
      },
    });

    return {success: true, appointment};
  } catch (error) {
    console.error('[create-appointment] Error creating appointment', error);
    return {
      success: false,
      error: 'Falha ao criar agendamento. Tente novamente.',
    };
  }
}

function dateAndSlotToDate(date: Date, slot: string): Date {
  const [hours, minutes] = slot.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}
