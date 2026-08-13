import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

type QueryOptions = {
  queryKey: unknown[];
  queryFn: () => Promise<string[]>;
  enabled: boolean;
};

const mocks = vi.hoisted(() => ({
  data: undefined as string[] | undefined,
  fetch: vi.fn(),
  isLoading: false,
  options: undefined as QueryOptions | undefined,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: QueryOptions) => {
    mocks.options = options;
    return {data: mocks.data, isLoading: mocks.isLoading};
  },
}));

import {TimeSlots} from './time-slots';

function getQueryOptions() {
  expect(mocks.options).toBeDefined();
  return mocks.options as QueryOptions;
}

describe('TimeSlots', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mocks.fetch);
  });

  afterEach(() => {
    mocks.data = undefined;
    mocks.fetch.mockReset();
    mocks.isLoading = false;
    mocks.options = undefined;
    vi.unstubAllGlobals();
  });

  it('prompts for a date and disables the query when none is selected', () => {
    const html = renderToStaticMarkup(
      <TimeSlots onSelect={vi.fn()} date={undefined} />,
    );

    expect(html).toContain(
      'Selecione uma data para ver os horários disponíveis.',
    );
    expect(getQueryOptions().queryKey).toEqual(['time-slots', undefined]);
    expect(getQueryOptions().enabled).toBe(false);
  });

  it('fetches slots for the selected date', async () => {
    const date = new Date('2026-08-20T00:00:00.000Z');
    mocks.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(['09:00', '10:00']),
    });
    renderToStaticMarkup(<TimeSlots date={date} onSelect={vi.fn()} />);

    await expect(getQueryOptions().queryFn()).resolves.toEqual([
      '09:00',
      '10:00',
    ]);
    expect(mocks.fetch).toHaveBeenCalledWith(
      `/api/time-slots?date=${encodeURIComponent(date.toISOString())}`,
    );
    expect(getQueryOptions().enabled).toBe(true);
  });

  it('rejects unsuccessful slot requests', async () => {
    mocks.fetch.mockResolvedValue({ok: false});
    renderToStaticMarkup(
      <TimeSlots
        date={new Date('2026-08-20T00:00:00.000Z')}
        onSelect={vi.fn()}
      />,
    );

    await expect(getQueryOptions().queryFn()).rejects.toThrow(
      'Failed to fetch time slots',
    );
  });

  it('renders nine skeletons while loading', () => {
    mocks.isLoading = true;

    const html = renderToStaticMarkup(
      <TimeSlots
        date={new Date('2026-08-20T00:00:00.000Z')}
        onSelect={vi.fn()}
      />,
    );

    expect(html.match(/data-slot="skeleton"/g)).toHaveLength(9);
  });

  it('renders availability and selection state for every slot', () => {
    mocks.data = ['09:00', '10:00'];

    const html = renderToStaticMarkup(
      <TimeSlots
        date={new Date('2026-08-20T00:00:00.000Z')}
        selected="10:00"
        onSelect={vi.fn()}
      />,
    );

    expect(html.match(/<button/g)).toHaveLength(9);
    expect(html).toMatch(
      /<button[^>]*aria-pressed="true"[^>]*title="10:00 – 11:00"[^>]*>10:00<\/button>/,
    );
    expect(html).toMatch(
      /<button[^>]*title="11:00 – 12:00"[^>]*disabled=""[^>]*>11:00<\/button>/,
    );
  });
});
