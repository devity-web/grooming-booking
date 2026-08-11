import {WeekCalendar} from '@/components/week-calendar';
import prisma from '@/lib/prisma';

export default async function CalendarPage() {
  const appoinments = await prisma.appointment.findMany({
    include: {
      customer: true,
      service: true,
      business: true,
    },
  });

  return <WeekCalendar appointments={appoinments} />;
}
