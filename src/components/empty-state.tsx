import {IconCircleOff} from '@tabler/icons-react';
import type {ReactNode} from 'react';
import {TableBody, TableCell, TableRow} from './ui/table';

interface EmptyStateProps {
  span: number;
  title: string;
  body: ReactNode;
}

export function EmptyState({span, title, body}: EmptyStateProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={span}>
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <IconCircleOff className="h-16 w-16 text-muted-foreground" />
            <div className="space-y-1 text-center">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
