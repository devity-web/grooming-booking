'use client';

import {MoreHorizontal, Trash} from 'lucide-react';
import type {Service} from '@/app/generated/prisma/client';
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

export function ServiceRow({service}: {service: Service}) {
  return (
    <TableRow key={service.id}>
      <TableCell className="font-bold">{service.id.slice(0, 8)}</TableCell>
      <TableCell>{service.name}</TableCell>
      <TableCell>{service.description}</TableCell>
      <TableCell>{String(service.isActive)}</TableCell>
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
