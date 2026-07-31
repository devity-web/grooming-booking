'use client';

import {ChevronLeft, ChevronRight, PawPrint, Plus} from 'lucide-react';
import {useMemo, useState} from 'react';
import {
  APPOINTMENTS,
  type Appointment,
  addDays,
  DAY_END_HOUR,
  DAY_START_HOUR,
  formatMinutes,
  formatMonthRange,
  isSameDay,
  SERVICE_META,
  type ServiceType,
  SLOT_HEIGHT,
  startOfWeek,
  WEEKDAY_LABELS,
} from '@/lib/appointments';
import {cn} from '@/lib/utils';
import {AppointmentBlock, serviceStyles} from './appointment-block';
import {AppointmentDetailSheet} from './appointment-detail-sheet';

const HOURS = Array.from(
  {length: DAY_END_HOUR - DAY_START_HOUR + 1},
  (_, i) => DAY_START_HOUR + i,
);
const GRID_HEIGHT = (DAY_END_HOUR - DAY_START_HOUR) * SLOT_HEIGHT;

export function WeekCalendar() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selected, setSelected] = useState<Appointment | null>(null);
  const today = new Date();

  const days = useMemo(
    () => Array.from({length: 7}, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const byDay = useMemo(() => {
    const map: Record<number, Appointment[]> = {};
    for (const appt of APPOINTMENTS) {
      (map[appt.dayOffset] ??= []).push(appt);
    }
    return map;
  }, []);

  const totalWeek = APPOINTMENTS.length;

  function goToday() {
    setWeekStart(startOfWeek(new Date()));
  }

  // Current time indicator position (only relevant on today's column)
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const showNowLine =
    nowMinutes >= DAY_START_HOUR * 60 && nowMinutes <= DAY_END_HOUR * 60;
  const nowTop = ((nowMinutes - DAY_START_HOUR * 60) / 60) * SLOT_HEIGHT;

  return (
    <div className="flex h-dvh flex-col bg-background">
      <Header
        weekStart={weekStart}
        totalWeek={totalWeek}
        onPrev={() => setWeekStart(w => addDays(w, -7))}
        onNext={() => setWeekStart(w => addDays(w, 7))}
        onToday={goToday}
      />

      {/* Day headers */}
      <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] border-b border-border bg-card">
        <div className="border-r border-border" />
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={i}
              className={cn(
                'flex flex-col items-center gap-0.5 border-r border-border py-2 last:border-r-0',
                isToday && 'bg-primary/5',
              )}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {WEEKDAY_LABELS[i]}
              </span>
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full font-display text-sm font-bold',
                  isToday
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground',
                )}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]">
          {/* Time gutter */}
          <div
            className="relative border-r border-border"
            style={{height: GRID_HEIGHT}}
          >
            {HOURS.slice(0, -1).map((hour, i) => (
              <div
                key={hour}
                className="absolute right-2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground"
                style={{top: i * SLOT_HEIGHT}}
              >
                {formatMinutes(hour * 60)}
              </div>
            ))}
            <div
              className="absolute right-2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground"
              style={{top: GRID_HEIGHT}}
            >
              {formatMinutes(DAY_END_HOUR * 60)}
            </div>
          </div>

          {/* Day columns */}
          {days.map((day, dayIndex) => {
            const isToday = isSameDay(day, today);
            const appts = byDay[dayIndex] ?? [];
            return (
              <div
                key={dayIndex}
                className={cn(
                  'relative border-r border-border last:border-r-0',
                  isToday && 'bg-primary/[0.03]',
                )}
                style={{height: GRID_HEIGHT}}
              >
                {/* Hour grid lines */}
                {HOURS.slice(0, -1).map((hour, i) => (
                  <div
                    key={hour}
                    className="absolute inset-x-0 border-t border-border/60"
                    style={{top: i * SLOT_HEIGHT, height: SLOT_HEIGHT}}
                  >
                    <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/40" />
                  </div>
                ))}

                {/* Current time indicator */}
                {isToday && showNowLine && (
                  <div
                    className="pointer-events-none absolute inset-x-0 z-30 flex items-center"
                    style={{top: nowTop}}
                  >
                    <span className="-ml-1 size-2 rounded-full bg-destructive" />
                    <span className="h-px flex-1 bg-destructive" />
                  </div>
                )}

                {/* Appointments */}
                {appts.map(appt => (
                  <AppointmentBlock
                    key={appt.id}
                    appointment={appt}
                    onSelect={setSelected}
                    isActive={selected?.id === appt.id}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <AppointmentDetailSheet
        appointment={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function Header({
  weekStart,
  totalWeek,
  onPrev,
  onNext,
  onToday,
}: {
  weekStart: Date;
  totalWeek: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex justify-between items-center gap-2 pb-4">
      <span className="mr-1 hidden min-w-40 text-right font-display text-sm font-bold capitalize text-foreground sm:inline">
        {formatMonthRange(weekStart)}
      </span>
      <div className="flex items-center rounded-lg border border-border bg-card">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Semana anterior"
          className="rounded-l-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="border-x border-border px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Hoje
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Próxima semana"
          className="rounded-r-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
