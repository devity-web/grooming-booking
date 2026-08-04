import {IconLink} from '@tabler/icons-react';
import {Suspense} from 'react';
import {BookingRow} from '@/components/dashboard/booking-row';
import {EmptyState} from '@/components/empty-state';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Spinner} from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import prisma from '@/lib/prisma';

export default function AppointmentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead className="w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <Suspense
              fallback={
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex justify-center items-center py-12">
                        <Spinner className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              }
            >
              <BookingsTableBody />
            </Suspense>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

async function BookingsTableBody() {
  const bookings = await prisma.appointment.findMany({
    include: {
      user: true,
      service: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (bookings.length === 0) {
    return (
      <EmptyState
        span={7}
        title="No appointments"
        body={
          <div className="flex flex-col items-center gap-2">
            You have no appointments yet. Get started by sharing your
            appointment link with your customers.
            <Button>
              <IconLink />
              Share
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <TableBody>
      {bookings.map(booking => (
        <BookingRow key={booking.id} booking={booking} />
      ))}
    </TableBody>
  );
}
