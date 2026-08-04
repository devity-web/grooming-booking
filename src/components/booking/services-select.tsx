'use client';

import {useQuery} from '@tanstack/react-query';
import type {Service} from '@/app/generated/prisma/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {Skeleton} from '../ui/skeleton';

interface ServiceSelectProps {
  onChange: (value: string) => void;
}

export function ServicesSelect({onChange}: ServiceSelectProps) {
  const {data, isLoading} = useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      const response = await fetch('/api/services');

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      return response.json();
    },
    select: items => {
      const placeholder = {
        label:
          items.length > 0 ? 'Escolha um serviço' : 'Nenhum serviço disponível',
        value: null,
      };

      const toSelectItem = items.map(item => ({
        label: item.name,
        value: item.id,
      }));

      return [placeholder, ...toSelectItem];
    },
  });

  if (isLoading) {
    return (
      <Skeleton className="h-11 w-full rounded-md border border-input bg-background px-3 py-2" />
    );
  }

  return (
    data && (
      <Select onValueChange={v => onChange(v as string)} items={data}>
        <SelectTrigger className="w-full pl-9 h-11!">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Serviços disponíveis</SelectLabel>
            {data.map(item => (
              <SelectItem
                disabled={item.value === null}
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  );
}
