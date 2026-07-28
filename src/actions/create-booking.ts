'use server';

import prisma from '@/lib/prisma';
import {type CreateUserInput, createOrGetUser} from './create-or-get-user';

type CreateBookingInput = {
  form: CreateUserInput;
  date: Date;
  slot: string;
};

export async function createBooking(data: CreateBookingInput) {
  try {
    console.log('[create-booking] Creating booking with data', data);

    const {user} = await createOrGetUser(data.form);

    if (!user) {
      throw new Error('Falha ao criar usuário. Tente novamente.');
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId: user.id,
        date: dateAndSlotToDate(data.date, data.slot),
        status: 'confirmed',
      },
    });

    return {success: true, booking: newBooking};
  } catch (error) {
    console.error('[create-booking] Error creating booking', error);
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
