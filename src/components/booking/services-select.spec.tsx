import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

type SelectItem = {label: string; value: string | null};
type QueryOptions = {
  queryKey: unknown[];
  queryFn: () => Promise<unknown[]>;
  select: (items: Array<{id: string; name: string}>) => SelectItem[];
};

const mocks = vi.hoisted(() => ({
  data: undefined as SelectItem[] | undefined,
  fetch: vi.fn(),
  isLoading: false,
  onValueChange: undefined as ((value: string) => void) | undefined,
  options: undefined as QueryOptions | undefined,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: (options: QueryOptions) => {
    mocks.options = options;
    return {data: mocks.data, isLoading: mocks.isLoading};
  },
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: ReactNode;
    onValueChange: (value: string) => void;
  }) => {
    mocks.onValueChange = onValueChange;
    return <div data-testid="select">{children}</div>;
  },
  SelectContent: ({children}: {children: ReactNode}) => <div>{children}</div>,
  SelectGroup: ({children}: {children: ReactNode}) => <div>{children}</div>,
  SelectItem: ({
    children,
    disabled,
    value,
  }: {
    children: ReactNode;
    disabled?: boolean;
    value: string | null;
  }) => (
    <button data-value={value ?? ''} disabled={disabled} type="button">
      {children}
    </button>
  ),
  SelectLabel: ({children}: {children: ReactNode}) => <span>{children}</span>,
  SelectTrigger: ({children}: {children: ReactNode}) => <div>{children}</div>,
  SelectValue: () => <span data-testid="select-value" />,
}));

import {ServicesSelect} from './services-select';

function getQueryOptions() {
  expect(mocks.options).toBeDefined();
  return mocks.options as QueryOptions;
}

describe('ServicesSelect', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mocks.fetch);
  });

  afterEach(() => {
    mocks.data = undefined;
    mocks.fetch.mockReset();
    mocks.isLoading = false;
    mocks.onValueChange = undefined;
    mocks.options = undefined;
    vi.unstubAllGlobals();
  });

  it('loads services for the requested business', async () => {
    const services = [{id: 'service-1', name: 'Banho'}];
    mocks.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(services),
    });
    renderToStaticMarkup(
      <ServicesSelect businessId="business-1" onChange={vi.fn()} />,
    );

    await expect(getQueryOptions().queryFn()).resolves.toEqual(services);
    expect(getQueryOptions().queryKey).toEqual(['services', 'business-1']);
    expect(mocks.fetch).toHaveBeenCalledWith(
      '/api/services?businessId=business-1',
    );
  });

  it('rejects unsuccessful service requests', async () => {
    mocks.fetch.mockResolvedValue({ok: false});
    renderToStaticMarkup(
      <ServicesSelect businessId="business-1" onChange={vi.fn()} />,
    );

    await expect(getQueryOptions().queryFn()).rejects.toThrow(
      'Failed to fetch services',
    );
  });

  it('maps services to select items with a prompt', () => {
    renderToStaticMarkup(
      <ServicesSelect businessId="business-1" onChange={vi.fn()} />,
    );

    expect(
      getQueryOptions().select([
        {id: 'service-1', name: 'Banho'},
        {id: 'service-2', name: 'Tosa'},
      ]),
    ).toEqual([
      {label: 'Escolha um serviço', value: null},
      {label: 'Banho', value: 'service-1'},
      {label: 'Tosa', value: 'service-2'},
    ]);
    expect(getQueryOptions().select([])).toEqual([
      {label: 'Nenhum serviço disponível', value: null},
    ]);
  });

  it('renders a skeleton while loading', () => {
    mocks.isLoading = true;

    const html = renderToStaticMarkup(
      <ServicesSelect businessId="business-1" onChange={vi.fn()} />,
    );

    expect(html).toContain('data-slot="skeleton"');
  });

  it('renders service options and forwards selection changes', () => {
    const onChange = vi.fn();
    mocks.data = [
      {label: 'Escolha um serviço', value: null},
      {label: 'Banho', value: 'service-1'},
    ];

    const html = renderToStaticMarkup(
      <ServicesSelect businessId="business-1" onChange={onChange} />,
    );
    mocks.onValueChange?.('service-1');

    expect(html).toContain('Serviços disponíveis');
    expect(html).toContain('Escolha um serviço');
    expect(html).toContain('Banho');
    expect(html).toContain('data-value="service-1"');
    expect(onChange).toHaveBeenCalledWith('service-1');
  });
});
