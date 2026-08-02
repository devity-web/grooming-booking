'use client';

import {Clock, Scissors, User} from 'lucide-react';
import {AppointmentStatus, cn} from '@/lib/utils';
import {DAY_START_HOUR, SLOT_HEIGHT} from '@/lib/week';
import type {Appointment} from '@/types/appointment';

interface AppointmentBlockProps {
  appointment: Appointment;
  onSelect: (appointment: Appointment) => void;
  isActive: boolean;
}

export function AppointmentBlock({
  appointment,
  onSelect,
  isActive,
}: AppointmentBlockProps) {
  const top =
    ((appointment.date.getHours() * 60 - DAY_START_HOUR * 60) / 60) *
    SLOT_HEIGHT;
  const height = 1 * SLOT_HEIGHT;

  return (
    <button
      type="button"
      onClick={() => onSelect(appointment)}
      style={{top, height: height - 4}}
      className={cn(
        'bg-red-300 text-red-800 absolute inset-x-1 flex flex-col overflow-hidden rounded-lg border border-transparent px-2 py-1.5 text-left transition-all',
        'shadow-sm hover:z-20 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        appointment.status === 'completed' && 'opacity-65',
        isActive && 'z-20 ring-2 ring-offset-1 ring-primary',
      )}
    >
      <span
        className={cn('absolute inset-y-0 left-0 w-1.5 rounded-l-lg bg-red-500')}
        aria-hidden="true"
      />
      <div className="flex items-center gap-1.5 pl-1.5">
        <User className="size-3" strokeWidth={2.5} />
        <span className="truncate text-[13px] font-medium leading-tight">
          {appointment.user.name}
        </span>
      </div>

      <div className="flex items-center gap-1.5 pl-1.5">
        <Scissors className="size-3" strokeWidth={2.5} />
        <span className="truncate text-[13px] font-medium leading-tight">
          {appointment.service.name}
        </span>
      </div>

      {appointment.status === AppointmentStatus.PENDING && (
        <div className="flex items-center gap-1.5 pl-1.5">
          <Clock className="size-3" strokeWidth={2.5} />
          <span className="truncate text-[13px] font-bold leading-tight">
            Pendente
          </span>
        </div>
      )}
    </button>
  );
}
