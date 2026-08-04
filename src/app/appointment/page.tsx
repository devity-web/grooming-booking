'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BookingExperience} from '@/components/booking/booking-experience';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppointmentPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-svh bg-background">
        <BookingExperience />
      </main>
    </QueryClientProvider>
  );
}
