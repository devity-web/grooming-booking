'use client';

import {IconCircle, IconCircleOff, IconEditCircle} from '@tabler/icons-react';
import {useMutation} from '@tanstack/react-query';
import {MoreHorizontal} from 'lucide-react';
import {useState} from 'react';
import {toast} from 'sonner';
import {toggleService} from '@/actions/dashboard/toggle-service';
import type {Service} from '@/app/generated/prisma/client';
import {moneyFormat} from '@/lib/utils';
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
import {ActiveLabel} from './active-label';
import {CreateServiceDialog} from './create-service-dialog';

interface ServiceRowProps {
  service: Service;
}

export function ServiceRow({service}: ServiceRowProps) {
  const [open, setOpen] = useState(false);

  const {mutate, isPending} = useMutation({
    mutationFn: async () => await toggleService(service.id, service.isActive),
    onSuccess: data => toast.success(data?.message),
    onError: () => toast.error('Ops... Something went wrong.'),
  });

  return (
    <>
      <CreateServiceDialog open={open} setOpen={setOpen} service={service} />

      <TableRow key={service.id}>
        <TableCell className="font-bold">{service.id.slice(0, 8)}</TableCell>
        <TableCell>{service.name}</TableCell>
        <TableCell>{service.description}</TableCell>
        <TableCell>{moneyFormat.format(service.price)}</TableCell>
        <TableCell className="w-20">
          <ActiveLabel isActive={service.isActive} />
        </TableCell>
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
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <IconEditCircle className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => mutate()}
                  isLoading={isPending}
                >
                  {service.isActive ? (
                    <>
                      <IconCircleOff className="mr-2 h-4 w-4" />
                      <span>Desativar</span>
                    </>
                  ) : (
                    <>
                      <IconCircle className="mr-2 h-4 w-4" />
                      <span>Ativar</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
