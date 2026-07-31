'use client';

import {MoreHorizontal, Trash} from 'lucide-react';
import {formatDate} from '@/lib/utils';
import type {Appointment} from '@/types/appointment';
import {BookingLabel} from '../booking-label';
import {Button} from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {TableCell, TableRow} from '../ui/table';

export function BookingRow({booking}: {booking: Appointment}) {
  return (
    <TableRow key={booking.id}>
      <TableCell className="font-bold">{booking.id.slice(0, 8)}</TableCell>
      <TableCell>{booking.user.name}</TableCell>
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
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
