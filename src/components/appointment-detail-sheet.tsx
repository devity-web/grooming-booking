'use client';

import {
  CalendarDays,
  Clock,
  PawPrint,
  Scissors,
  StickyNote,
  User,
  X,
} from 'lucide-react';
import {useEffect} from 'react';
import {cn} from '@/lib/utils';
import type {Appointment} from '@/types/appointment';

const STATUS_META: Record<
  Appointment['status'],
  {label: string; className: string}
> = {
  confirmed: {
    label: 'Confirmado',
    className: 'bg-service-fullgroom-bg text-service-fullgroom-foreground',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-service-nails-bg text-service-nails-foreground',
  },
  completed: {
    label: 'Concluído',
    className: 'bg-muted text-muted-foreground',
  },
};

interface AppointmentDetailSheetProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export function AppointmentDetailSheet({
  appointment,
  onClose,
}: AppointmentDetailSheetProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (appointment) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [appointment, onClose]);

  const open = appointment !== null;

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do agendamento"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-card shadow-xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {appointment && (
          <AppointmentDetailContent
            appointment={appointment}
            onClose={onClose}
          />
        )}
      </aside>
    </>
  );
}

function AppointmentDetailContent({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  const status = STATUS_META[appointment.status];

  return (
    <>
      <header className="flex items-start justify-between gap-4 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-11 items-center justify-center rounded-full bg-red-300',
            )}
          >
            <PawPrint className="size-5" strokeWidth={2.5} />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold leading-tight text-foreground">
              PET NAME
            </h2>
            <p className="text-sm text-muted-foreground">PET BREED</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-5">
        <span
          className={cn(
            'mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold',
            status.className,
          )}
        >
          {status.label}
        </span>

        <DetailRow icon={Scissors} label="Serviço">
          <span className="flex items-center gap-2">
            <span
              className={cn('size-2.5 rounded-full bg-red-600')}
              aria-hidden="true"
            />
            SERVICE META LABEL
          </span>
        </DetailRow>

        <DetailRow icon={CalendarDays} label="Dia">
          DAY OFFSET
        </DetailRow>

        <DetailRow icon={Clock} label="Horário">
          DURATION
        </DetailRow>

        <DetailRow icon={User} label="Tutor(a)">
          OWNER
        </DetailRow>

        <DetailRow icon={Scissors} label="Profissional">
          GROOMER
        </DetailRow>

        <DetailRow icon={StickyNote} label="Observações">
          NOTES
        </DetailRow>
      </div>

      <footer className="flex gap-3 border-t border-border p-5">
        <button
          type="button"
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Reagendar
        </button>
        <button
          type="button"
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          Confirmar
        </button>
      </footer>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-border/60 py-3 last:border-0">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{children}</p>
      </div>
    </div>
  );
}
