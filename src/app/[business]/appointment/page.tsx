import {BookingExperience} from '@/components/booking/booking-experience';
import type {TenantPageProps} from '@/lib/tenant';

export default async function AppointmentPage({params}: TenantPageProps) {
  const businessSlug = (await params).business;

  return (
    <main className="min-h-svh bg-background">
      <BookingExperience businessSlug={businessSlug} />
    </main>
  );
}
