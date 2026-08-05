'use client';

import {IconCheck} from '@tabler/icons-react';
import {useState, useTransition} from 'react';
import {confirmAppointment} from '@/actions/dashboard/confirm-appointment';
import {formatDate} from '@/lib/utils';
import type {Appointment} from '@/types/appointment';
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
  appointments: Appointment[];
}

export function PendingTable({appointments}: PendingTableProps) {
  const [isPending, startTransition] = useTransition();
  const [currentId, setCurrentId] = useState<string>();

  const handleConfirm = (id: string) => {
    setCurrentId(id);
    startTransition(async () => {
      await confirmAppointment(id);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review pending</CardTitle>
        <CardDescription>
          You currently have {appointments.length} pending appointments
        </CardDescription>
      </CardHeader>

      {appointments.length > 0 && (
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
              {appointments.map(appointment => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.customer.name}</TableCell>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{appointment.service.name}</TableCell>
                  <TableCell>
                    <BookingLabel status={appointment.status} />
                  </TableCell>
                  <TableCell>{formatDate(appointment.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      isLoading={isPending && currentId === appointment.id}
                      onClick={() => handleConfirm(appointment.id)}
                      size="icon"
                    >
                      <IconCheck />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}
