'use client';

import {useQuery} from '@tanstack/react-query';
import {CircleOff, MoreHorizontal, Trash} from 'lucide-react';
import type {Service} from '@/app/generated/prisma/client';
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

export default function ServicesPage() {
  const {data, isLoading} = useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      const response = await fetch('/api/dashboard/services');

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      return response.json();
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Services</h1>
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ativo</TableHead>
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
                        <h3 className="text-2xl font-bold">No Services</h3>
                        <p className="text-muted-foreground">
                          It looks like you haven't created any services yet.
                          Get started by creating your first service.
                        </p>
                      </div>
                      <Button>Create service</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {data?.map(service => (
                <TableRow key={service.id}>
                  <TableCell className="font-bold">
                    {service.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{String(service.isActive)}</TableCell>
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
