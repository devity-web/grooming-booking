'use client';

import {useQuery} from '@tanstack/react-query';
import {CircleOff, MoreHorizontal, Trash} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Spinner} from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {formatDate} from '@/lib/utils';
import type {Booking} from '@/types/booking';

export default function BookingsPage() {
  const {data, isLoading} = useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Booking[]> => {
      const response = await fetch('/api/dashboard/bookings');

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      return response.json();
    },
  });

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
                <TableHead>Status</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex justify-center items-center py-4 w-full">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && data && data.length <= 0 && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center gap-6 py-20">
                      <CircleOff className="h-20 w-20 text-muted" />
                      <div className="space-y-2 text-center">
                        <h3 className="text-2xl font-bold">No Bookings</h3>
                        <p className="text-muted-foreground">
                          It looks like you haven't any bookings yet.
                          <br />
                          Get started by sharing the booking url with your
                          customers.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {data?.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell className="font-bold">
                    {booking.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>{formatDate(booking.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
