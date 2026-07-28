'use server';

import prisma from '@/lib/prisma';
import {delay} from '@/lib/utils';

export async function getAvailableSlots(date: Date) {
  await delay(2500);

  const dayBookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  const bookedSlots = dayBookings.map(booking => {
    const bookingDate = new Date(booking.date);
    return `${String(bookingDate.getHours()).padStart(2, '0')}:00`;
  });

  const allSlots = Array.from({length: 9}, (_, i) => {
    const start = 9 + i;
    return `${String(start).padStart(2, '0')}:00`;
  });

  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

  return availableSlots;
}
