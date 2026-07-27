'use client';

import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useState} from 'react';
import {cn} from '@/lib/utils';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

type BookingCalendarProps = {
  selected?: Date;
  onSelect: (date: Date) => void;
};

export function BookingCalendar({selected, onSelect}: BookingCalendarProps) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  function changeMonth(delta: number) {
    setViewMonth(new Date(year, month + delta, 1));
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Mês anterior"
          className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>
        <h3 className="font-heading text-base font-semibold text-foreground">
          {MONTHS[month]} {year}
        </h3>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Próximo mês"
          className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map(wd => (
          <div
            key={wd}
            className="flex h-8 items-center justify-center text-xs font-semibold text-muted-foreground"
          >
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map(date => {
          if (!date) return <div key={`empty-${date}`} />;

          const isPast = date < today;
          const isSelected = selected ? isSameDay(date, selected) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(date)}
              aria-pressed={isSelected}
              className={cn(
                'flex aspect-square items-center justify-center rounded-xl text-sm font-medium transition-colors',
                isPast && 'cursor-not-allowed text-muted-foreground/40',
                !isPast && !isSelected && 'text-foreground hover:bg-secondary',
                isSelected &&
                  'bg-primary text-primary-foreground hover:bg-primary',
                isToday && !isSelected && 'ring-1 ring-inset ring-primary/40',
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
