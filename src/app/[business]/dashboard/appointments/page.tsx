import {Suspense} from 'react';
import {BookingTable} from '@/components/dashboard/booking-table';
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
import {getTenantPrisma, type TenantPageProps} from '@/lib/tenant';

export default function AppointmentsPage(props: TenantPageProps) {
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
                <TableHead className="w-12.5">...</TableHead>
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
              <BookingsTableBody {...props} />
            </Suspense>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

async function BookingsTableBody({params}: TenantPageProps) {
  const prisma = await getTenantPrisma(params);

  const bookings = await prisma.appointment.findMany({
    include: {
      customer: true,
      service: true,
      business: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <BookingTable bookings={bookings} />;
}
