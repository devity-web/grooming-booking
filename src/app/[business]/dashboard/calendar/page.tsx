import {WeekCalendar} from '@/components/week-calendar';
import prisma from '@/lib/prisma';

export default async function CalendarPage() {
  const appoinments = await prisma.appointment.findMany({
    include: {
      user: true,
      service: true,
    },
  });

  return <WeekCalendar appointments={appoinments} />;
}
