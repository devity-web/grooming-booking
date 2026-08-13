import {Suspense} from 'react';
import {WeekCalendar} from '@/components/dashboard/week-calendar';
import {Spinner} from '@/components/ui/spinner';
import {getTenantPrisma, type TenantPageProps} from '@/lib/tenant';

export default async function CalendarPage(props: TenantPageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }
    >
      <CalendarPageWrapper {...props} />
    </Suspense>
  );
}

async function CalendarPageWrapper({params}: TenantPageProps) {
  const prisma = await getTenantPrisma(params);
  const appoinments = await prisma.appointment.findMany({
    include: {
      customer: true,
      service: true,
      business: true,
    },
  });
  return <WeekCalendar appointments={appoinments} />;
}
