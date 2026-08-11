import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {
  BookingExperience,
  BookingExperienceSkeleton,
} from '@/components/booking/booking-experience';
import prisma from '@/lib/prisma';
import type {TenantPageProps} from '@/lib/tenant';

export default async function AppointmentPage(props: TenantPageProps) {
  return (
    <main className="min-h-svh bg-background">
      <Suspense fallback={<BookingExperienceSkeleton />}>
        <AppointmentPageWrapper {...props} />
      </Suspense>
    </main>
  );
}

async function AppointmentPageWrapper({params}: TenantPageProps) {
  const url = (await params).business;
  const business = await prisma.business.findUnique({
    where: {url},
  });

  if (!business) {
    return notFound();
  }

  return <BookingExperience business={business} />;
}
