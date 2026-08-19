'use client';

import {
  IconCalendarOff,
  IconClockEdit,
  IconLink,
  IconTrash,
} from '@tabler/icons-react';
import {useMutation} from '@tanstack/react-query';
import {MoreHorizontal} from 'lucide-react';
import {useState} from 'react';
import {toast} from 'sonner';
import {deleteAppointment} from '@/actions/dashboard/delete-appointment';
import {formatDate} from '@/lib/utils';
import type {Appointment} from '@/types/appointment';
import {BookingLabel} from '../booking-label';
import {DeleteDialog} from '../delete-dialog';
import {Button} from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty';
import {TableBody, TableCell, TableRow} from '../ui/table';

export function BookingTable({bookings}: {bookings: Appointment[]}) {
  const [open, setOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string>();

  const {mutate: mutateDelete, isPending: isPendingDelete} = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteAppointment(id);

      return response;
    },
    onSuccess: () => {
      toast.success('Appointment successfully deleted');
    },
    onError: () => {
      toast.error('Something went wrong. Please try again later.');
    },
    onSettled: () => {
      setOpen(false);
      setAppointmentToDelete(undefined);
    },
  });

  const handleDelete = () => {
    if (appointmentToDelete) {
      mutateDelete(appointmentToDelete);
    }
  };

  if (bookings.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7}>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconCalendarOff />
                </EmptyMedia>
                <EmptyTitle>No appointments yet</EmptyTitle>
                <EmptyDescription>
                  You don't have any appointments yet. Get started by sharing
                  you appointment link with your customers.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <Button>
                  <IconLink />
                  Share
                </Button>
              </EmptyContent>
            </Empty>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      <DeleteDialog
        open={open}
        setOpen={setOpen}
        handleDelete={handleDelete}
        isLoading={isPendingDelete}
        title="Are you sure?"
        description=""
      />
      {bookings.map(booking => (
        <TableRow key={booking.id}>
          <TableCell className="font-bold">{booking.id.slice(0, 8)}</TableCell>
          <TableCell>{booking.customer.name}</TableCell>
          <TableCell>{formatDate(booking.date)}</TableCell>
          <TableCell>{booking.service.name}</TableCell>
          <TableCell>
            <BookingLabel status={booking.status} />
          </TableCell>
          <TableCell>{formatDate(booking.createdAt)}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                }
              >
                Open
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <IconClockEdit className="mr-2 h-4 w-4" />
                    <span>Update</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCalendarOff className="mr-2 h-4 w-4" />
                    <span>Cancel</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setAppointmentToDelete(booking.id);
                      setOpen(true);
                    }}
                    variant="destructive"
                  >
                    <IconTrash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
