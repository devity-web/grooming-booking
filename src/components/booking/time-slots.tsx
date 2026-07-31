'use client';

import {useQuery} from '@tanstack/react-query';
import {cn} from '@/lib/utils';
import {Skeleton} from '../ui/skeleton';

// 1-hour slots from 09:00 to 18:00
const SLOTS = Array.from({length: 9}, (_, i) => {
  const start = 9 + i;
  const end = start + 1;
  const label = `${String(start).padStart(2, '0')}:00`;
  return {
    value: label,
    label,
    range: `${String(start).padStart(2, '0')}:00 – ${String(end).padStart(2, '0')}:00`,
  };
});

type TimeSlotsProps = {
  selected?: string;
  onSelect: (slot: string) => void;
  date?: Date;
};

export function TimeSlots({selected, onSelect, date}: TimeSlotsProps) {
  const {data, isLoading} = useQuery({
    queryKey: ['time-slots', date?.toISOString()],
    queryFn: async (): Promise<string[]> => {
      const response = await fetch(
        `/api/time-slots?date=${
          // biome-ignore lint/style/noNonNullAssertion: date is not null
          encodeURIComponent(date!.toISOString())
        }`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch time slots');
      }

      return response.json();
    },
    enabled: !!date,
  });

  if (!date) {
    return (
      <p className="rounded-xl bg-secondary px-4 py-6 text-center text-sm text-muted-foreground">
        Selecione uma data para ver os horários disponíveis.
      </p>
    );
  }

  if (isLoading) {
    return <TimeSlotsSkeleton />;
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
      {data &&
        SLOTS.map(slot => {
          const isSelected = selected === slot.value;
          const isDisabled = !data.includes(slot.value);

          return (
            <button
              key={slot.value}
              type="button"
              onClick={() => onSelect(slot.value)}
              aria-pressed={isSelected}
              title={slot.range}
              disabled={isDisabled}
              className={cn(
                'rounded-xl border px-2 py-3 text-sm font-semibold transition-colors',
                isDisabled && 'cursor-not-allowed opacity-50',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary',
              )}
            >
              {slot.label}
            </button>
          );
        })}
    </div>
  );
}

function TimeSlotsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
      {/* Render 9 empty grey blocks to match the 9 time slots */}
      {Array.from({length: 9}).map((_, i) => (
        <Skeleton
          className="h-11.5 rounded-xl bg-muted/50 border border-border/50"
          // biome-ignore lint/suspicious/noArrayIndexKey: No data
          key={i}
        />
      ))}
    </div>
  );
}
