/** biome-ignore-all lint/performance/noImgElement: Next Image test mock */
import type {ReactNode} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';
import type {Business} from '@/app/generated/prisma/client';

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  petName: string;
};

type MutationOptions = {
  mutationFn: (data: FormData) => Promise<unknown>;
  onSuccess: (data?: {appointment: {id: string}}) => unknown;
};

const mocks = vi.hoisted(() => ({
  bookingCalendarProps: undefined as
    | {selected?: Date; onSelect: (date: Date) => void}
    | undefined,
  createAppointment: vi.fn(),
  date: undefined as Date | undefined,
  fieldOnChange: vi.fn(),
  handleSubmit: vi.fn(),
  isPending: false,
  mutate: vi.fn(),
  mutationOptions: undefined as MutationOptions | undefined,
  push: vi.fn(),
  servicesSelectProps: undefined as
    | {businessId: string; onChange: (value: string) => void}
    | undefined,
  setDate: vi.fn(),
  setSlot: vi.fn(),
  slot: undefined as string | undefined,
  stateCall: 0,
  submit: undefined as ((data: FormData) => Promise<void>) | undefined,
  timeSlotsProps: undefined as
    | {
        date?: Date;
        selected?: string;
        onSelect: (slot: string) => void;
      }
    | undefined,
}));

vi.mock('react', async importOriginal => {
  const actual = await importOriginal<typeof import('react')>();

  return {
    ...actual,
    useState: () => {
      const call = mocks.stateCall++;
      return call === 0
        ? [mocks.date, mocks.setDate]
        : [mocks.slot, mocks.setSlot];
    },
  };
});

vi.mock('@tanstack/react-query', () => ({
  useMutation: (options: MutationOptions) => {
    mocks.mutationOptions = options;
    return {isPending: mocks.isPending, mutate: mocks.mutate};
  },
}));

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (submit: (data: FormData) => Promise<void>) => {
      mocks.submit = submit;
      mocks.handleSubmit(submit);
      return vi.fn();
    },
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({push: mocks.push}),
}));

vi.mock('next/image', () => ({
  default: ({alt, src}: {alt: string; src: string}) => (
    <img alt={alt} src={src} />
  ),
}));

vi.mock('@/actions/create-appointment', () => ({
  createAppointment: mocks.createAppointment,
}));

vi.mock('@/components/booking/booking-calendar', () => ({
  BookingCalendar: (props: NonNullable<typeof mocks.bookingCalendarProps>) => {
    mocks.bookingCalendarProps = props;
    return <div data-testid="booking-calendar" />;
  },
}));

vi.mock('@/components/booking/time-slots', () => ({
  TimeSlots: (props: NonNullable<typeof mocks.timeSlotsProps>) => {
    mocks.timeSlotsProps = props;
    return <div data-testid="time-slots" />;
  },
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    disabled,
    isLoading,
    type,
  }: {
    children: ReactNode;
    disabled?: boolean;
    isLoading?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }) => (
    <button
      data-loading={isLoading ? 'true' : 'false'}
      disabled={disabled}
      type={type}
    >
      {isLoading ? 'Loading' : children}
    </button>
  ),
}));

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-slot="skeleton" />,
}));

vi.mock('@/components/ui/form', () => ({
  Form: ({children}: {children: ReactNode}) => <>{children}</>,
  FormField: ({
    name,
    render,
  }: {
    name: string;
    render: (props: {
      field: {
        name: string;
        onChange: typeof mocks.fieldOnChange;
        value: string;
      };
    }) => ReactNode;
  }) =>
    render({
      field: {name, onChange: mocks.fieldOnChange, value: ''},
    }),
  FormItem: ({children}: {children: ReactNode}) => <div>{children}</div>,
  FormLabel: ({children}: {children: ReactNode}) => <span>{children}</span>,
  FormMessage: () => null,
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: {name?: string; placeholder?: string}) => <input {...props} />,
}));

vi.mock('./services-select', () => ({
  ServicesSelect: (props: NonNullable<typeof mocks.servicesSelectProps>) => {
    mocks.servicesSelectProps = props;
    return <div data-testid="services-select" />;
  },
}));

import {
  BookingExperience,
  BookingExperienceSkeleton,
} from './booking-experience';

const business = {
  id: 'business-1',
  name: 'Happy Paws',
  url: 'happy-paws',
  address: 'Rua dos Animais, 10',
  profileId: 'profile-1',
  meta: {},
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
} as Business;

const formData: FormData = {
  name: 'Taylor Smith',
  email: 'taylor@example.com',
  phone: '910000000',
  service: 'service-1',
  petName: 'Toby',
};

function renderExperience() {
  mocks.stateCall = 0;
  return renderToStaticMarkup(<BookingExperience business={business} />);
}

function getMutationOptions() {
  expect(mocks.mutationOptions).toBeDefined();
  return mocks.mutationOptions as MutationOptions;
}

describe('BookingExperienceSkeleton', () => {
  it('renders placeholders for the full booking layout', () => {
    const html = renderToStaticMarkup(<BookingExperienceSkeleton />);

    expect(html.match(/data-slot="skeleton"/g)).toHaveLength(32);
  });
});

describe('BookingExperience', () => {
  afterEach(() => {
    mocks.bookingCalendarProps = undefined;
    mocks.createAppointment.mockReset();
    mocks.date = undefined;
    mocks.fieldOnChange.mockReset();
    mocks.handleSubmit.mockReset();
    mocks.isPending = false;
    mocks.mutate.mockReset();
    mocks.mutationOptions = undefined;
    mocks.push.mockReset();
    mocks.servicesSelectProps = undefined;
    mocks.setDate.mockReset();
    mocks.setSlot.mockReset();
    mocks.slot = undefined;
    mocks.stateCall = 0;
    mocks.submit = undefined;
    mocks.timeSlotsProps = undefined;
  });

  it('renders the business and all booking steps', () => {
    const html = renderExperience();

    expect(html).toContain('Happy Paws · Rua dos Animais, 10');
    expect(html).toContain('Agende o cuidado do seu pet');
    expect(html).toContain('1. Escolha a data');
    expect(html).toContain('2. Escolha o horário');
    expect(html).toContain('3. Seus dados');
    expect(html).toContain('Serviço');
    expect(html).toContain('Nome do PET');
    expect(html).toContain('Data não selecionada');
    expect(html).toContain('Horário não selecionado');
    expect(html).toContain('disabled=""');
    expect(mocks.servicesSelectProps?.businessId).toBe('business-1');
  });

  it('selects a date and clears the previous time slot', () => {
    const selectedDate = new Date('2026-08-20T00:00:00.000Z');
    renderExperience();

    mocks.bookingCalendarProps?.onSelect(selectedDate);

    expect(mocks.setDate).toHaveBeenCalledWith(selectedDate);
    expect(mocks.setSlot).toHaveBeenCalledWith(undefined);
  });

  it('creates an appointment using the selected date and slot', async () => {
    const selectedDate = new Date('2026-08-20T00:00:00.000Z');
    mocks.date = selectedDate;
    mocks.slot = '10:00';
    mocks.createAppointment.mockResolvedValue({
      success: true,
      appointment: {id: 'appointment-1'},
    });
    renderExperience();

    await getMutationOptions().mutationFn(formData);

    expect(mocks.createAppointment).toHaveBeenCalledWith('business-1', {
      form: {
        email: 'taylor@example.com',
        name: 'Taylor Smith',
        phone: '910000000',
      },
      date: selectedDate,
      slot: '10:00',
      service: 'service-1',
      petName: 'Toby',
    });
  });

  it('does not create an appointment without both date and slot', async () => {
    renderExperience();

    await expect(
      getMutationOptions().mutationFn(formData),
    ).resolves.toBeUndefined();
    expect(mocks.createAppointment).not.toHaveBeenCalled();
  });

  it('forwards valid form submissions to the mutation', async () => {
    renderExperience();

    await mocks.submit?.(formData);

    expect(mocks.mutate).toHaveBeenCalledWith(formData);
  });

  it('redirects to the appointment after creation', () => {
    renderExperience();

    getMutationOptions().onSuccess({appointment: {id: 'appointment-1'}});

    expect(mocks.push).toHaveBeenCalledWith(
      '/happy-paws/appointment/appointment-1',
    );
  });

  it('keeps the confirmation disabled until date and slot are selected', () => {
    const emptyHtml = renderExperience();
    mocks.date = new Date('2026-08-20T00:00:00.000Z');
    mocks.slot = '10:00';
    const readyHtml = renderExperience();

    expect(emptyHtml).toMatch(/<button[^>]*disabled=""[^>]*>/);
    expect(readyHtml).not.toMatch(/<button[^>]*disabled=""[^>]*>/);
    expect(readyHtml).toContain('10:00 · sessão de 1 hora');
  });

  it('shows the pending state on the confirmation button', () => {
    mocks.date = new Date('2026-08-20T00:00:00.000Z');
    mocks.slot = '10:00';
    mocks.isPending = true;

    const html = renderExperience();

    expect(html).toContain('data-loading="true"');
    expect(html).toContain('Loading');
  });
});
