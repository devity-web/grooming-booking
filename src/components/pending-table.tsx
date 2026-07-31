import {Check} from 'lucide-react';
import {formatDate} from '@/lib/utils';
import type {Booking} from '@/types/booking';
import {BookingLabel} from './booking-label';
import {Button} from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface PendingTableProps {
  bookings: Booking[];
}

export function PendingTable({bookings}: PendingTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review pending</CardTitle>
        <CardDescription>
          You currently have {bookings.length} pending bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map(booking => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user.name}</TableCell>
                <TableCell>{formatDate(booking.date)}</TableCell>
                <TableCell>{booking.service.name}</TableCell>
                <TableCell>
                  <BookingLabel status={booking.status} />
                </TableCell>
                <TableCell>{formatDate(booking.createdAt)}</TableCell>
                <TableCell>
                  <Button size="icon">
                    <Check />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
