'use client';

import {Clock} from 'lucide-react';
import {
  type Appointment,
  DAY_START_HOUR,
  formatMinutes,
  SERVICE_META,
  type ServiceType,
  SLOT_HEIGHT,
} from '@/lib/appointments';
import {cn} from '@/lib/utils';

/** Static class maps so Tailwind can see every service variant at build time. */
const SERVICE_STYLES: Record<
  ServiceType,
  {bar: string; bg: string; text: string; ring: string}
> = {
  bath: {
    bar: 'bg-service-bath',
    bg: 'bg-service-bath-bg',
    text: 'text-service-bath-foreground',
    ring: 'focus-visible:ring-service-bath',
  },
  fullgroom: {
    bar: 'bg-service-fullgroom',
    bg: 'bg-service-fullgroom-bg',
    text: 'text-service-fullgroom-foreground',
    ring: 'focus-visible:ring-service-fullgroom',
  },
  nails: {
    bar: 'bg-service-nails',
    bg: 'bg-service-nails-bg',
    text: 'text-service-nails-foreground',
    ring: 'focus-visible:ring-service-nails',
  },
  haircut: {
    bar: 'bg-service-haircut',
    bg: 'bg-service-haircut-bg',
    text: 'text-service-haircut-foreground',
    ring: 'focus-visible:ring-service-haircut',
  },
  deshed: {
    bar: 'bg-service-deshed',
    bg: 'bg-service-deshed-bg',
    text: 'text-service-deshed-foreground',
    ring: 'focus-visible:ring-service-deshed',
  },
};

export function serviceStyles(service: ServiceType) {
  return SERVICE_STYLES[service];
}

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
  const styles = SERVICE_STYLES[appointment.service];
  const top = ((appointment.start - DAY_START_HOUR * 60) / 60) * SLOT_HEIGHT;
  const height = (appointment.duration / 60) * SLOT_HEIGHT;
  const compact = height < 52;

  return (
    <button
      type="button"
      onClick={() => onSelect(appointment)}
      style={{top, height: height - 4}}
      className={cn(
        'absolute inset-x-1 flex flex-col overflow-hidden rounded-lg border border-transparent px-2 py-1.5 text-left transition-all',
        'shadow-sm hover:z-20 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        styles.bg,
        styles.text,
        styles.ring,
        appointment.status === 'completed' && 'opacity-65',
        isActive && 'z-20 ring-2 ring-offset-1 ring-primary',
      )}
    >
      <span
        className={cn(
          'absolute inset-y-0 left-0 w-1.5 rounded-l-lg',
          styles.bar,
        )}
        aria-hidden="true"
      />
      <div className="flex items-center gap-1.5 pl-1.5">
        <span className="truncate text-[13px] font-bold font-display leading-tight">
          {appointment.petName}
        </span>
        {appointment.status === 'pending' && (
          <span className="shrink-0 rounded-full bg-card/70 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide">
            Pendente
          </span>
        )}
      </div>
      {!compact && (
        <span className="truncate pl-1.5 text-[11px] font-medium leading-tight opacity-80">
          {SERVICE_META[appointment.service].label}
        </span>
      )}
      {height >= 70 && (
        <span className="mt-auto flex items-center gap-1 pl-1.5 text-[10px] font-medium opacity-70">
          <Clock className="size-3" strokeWidth={2.5} />
          {formatMinutes(appointment.start)}
          {' · '}
          {appointment.groomer}
        </span>
      )}
    </button>
  );
}
