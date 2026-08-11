import type {NextRequest} from 'next/server';
import {badRequest, ok} from '@/lib/next';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');

  if (!date) {
    return badRequest('Missing date from query');
  }

  const dateValue = new Date(date.toString());

  const dayAppointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: new Date(dateValue.setHours(0, 0, 0, 0)),
        lt: new Date(dateValue.setHours(23, 59, 59, 999)),
      },
    },
  });

  const bookedSlots = dayAppointments.map(appointments => {
    const appointmentDate = new Date(appointments.date);
    return `${String(appointmentDate.getHours()).padStart(2, '0')}:00`;
  });

  const allSlots = Array.from({length: 9}, (_, i) => {
    const start = 9 + i;
    return `${String(start).padStart(2, '0')}:00`;
  });

  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

  return ok(availableSlots);
}
