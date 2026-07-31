import {CircleOff} from 'lucide-react';
import {Suspense} from 'react';
import {BookingRow} from '@/components/dashboard/booking-row';
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

export default function BookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
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
  const bookings = await prisma.booking.findMany({
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
      <TableBody>
        <TableRow>
          <TableCell colSpan={7}>
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <CircleOff className="h-16 w-16 text-muted-foreground" />
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold">No Bookings</h3>
                <p className="text-sm text-muted-foreground">
                  It looks like you don't have any bookings yet.
                  <br />
                  Get started by sharing the booking URL with your customers.
                </p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
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
