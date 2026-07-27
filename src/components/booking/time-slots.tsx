'use client';

import {cn} from '@/lib/utils';

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
  selected: string | null;
  onSelect: (slot: string) => void;
  disabled?: boolean;
};

export function TimeSlots({selected, onSelect, disabled}: TimeSlotsProps) {
  if (disabled) {
    return (
      <p className="rounded-xl bg-secondary px-4 py-6 text-center text-sm text-muted-foreground">
        Selecione uma data para ver os horários disponíveis.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
      {SLOTS.map(slot => {
        const isSelected = selected === slot.value;
        return (
          <button
            key={slot.value}
            type="button"
            onClick={() => onSelect(slot.value)}
            aria-pressed={isSelected}
            title={slot.range}
            className={cn(
              'rounded-xl border px-2 py-3 text-sm font-semibold transition-colors',
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
