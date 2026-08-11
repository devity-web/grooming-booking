import {Suspense} from 'react';
import {Spinner} from '@/components/ui/spinner';
import {WeekCalendar} from '@/components/week-calendar';
import prisma from '@/lib/prisma';

export default async function CalendarPage() {
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <CalendarPageWrapper />
    </Suspense>
  );
}

async function CalendarPageWrapper() {
  const appoinments = await prisma.appointment.findMany({
    include: {
      customer: true,
      service: true,
      business: true,
    },
  });
  return <WeekCalendar appointments={appoinments} />;
}
