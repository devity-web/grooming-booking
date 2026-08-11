import {
  IconCalendar,
  IconCalendarTime,
  IconCircleCheck,
  IconClock,
} from '@tabler/icons-react';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import prisma from '@/lib/prisma';
import {AppointmentStatus, formatDate, formatTime} from '@/lib/utils';

export type AppointmentDetailsPageProps = {
  params: Promise<{id: string; business: string}>;
};

export default function AppointmentDetailsPage(
  props: AppointmentDetailsPageProps,
) {
  return (
    <Suspense fallback={<AppointmentDetailsSkeleton />}>
      <AppointmentDetailsWrapper {...props} />
    </Suspense>
  );
}

function AppointmentDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <Skeleton className="mx-auto mb-5 size-16 rounded-full" />

        <Skeleton className="mx-auto h-8 w-72 max-w-full" />

        <div className="mt-3 space-y-2">
          <Skeleton className="mx-auto h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-11/12" />
          <Skeleton className="mx-auto h-4 w-3/4" />
        </div>

        <div className="mt-6 space-y-3 rounded-2xl bg-secondary p-4 text-left">
          <div className="flex items-center gap-3">
            <Skeleton className="size-5 shrink-0 rounded-md" />
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="size-5 shrink-0 rounded-md" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <Skeleton className="mt-6 h-11 w-full rounded-md" />
      </div>
    </div>
  );
}

async function AppointmentDetailsWrapper({
  params,
}: AppointmentDetailsPageProps) {
  const {id, business} = await params;

  if (!id) {
    return notFound();
  }

  const appointment = await prisma.appointment.findUnique({
    where: {id},
    select: {customer: true, date: true, status: true},
  });

  if (!appointment) {
    return notFound();
  }

  if (appointment.status === AppointmentStatus.PENDING) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <IconCalendarTime className="size-9 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground text-balance">
            Sua reserva está pendente
          </h2>
          <p className="mt-2 text-muted-foreground text-pretty">
            {appointment.customer.name.split(' ')[0]}, a sessão de banho e tosa
            do seu pet está reservada. Enviaremos os detalhes para{' '}
            <span className="font-bold">{appointment.customer.email}</span>{' '}
            assim que for confirmada pelo groomer.
          </p>
          <div className="mt-6 space-y-3 rounded-2xl bg-secondary p-4 text-left">
            <div className="flex items-center gap-3">
              <IconCalendar className="size-5 shrink-0 text-primary" />
              <span className="text-sm font-medium capitalize text-foreground">
                {formatDate(appointment.date, false)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <IconClock className="size-5 shrink-0 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {formatTime(appointment.date)} · sessão de 1 hora
              </span>
            </div>
          </div>
          <Link href={`/${business}/appointment`}>
            <Button className="mt-6 w-full" size="lg">
              Fazer novo agendamento
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <IconCircleCheck className="size-9 text-primary" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground text-balance">
          Sua agenda foi confirmada!
        </h2>
        <p className="mt-2 text-muted-foreground text-pretty">
          {appointment.customer.name.split(' ')[0]}, a sessão de banho e tosa do
          seu pet está reservada. Enviamos os detalhes para{' '}
          <span className="font-bold">{appointment.customer.email}</span>.
        </p>
        <div className="mt-6 space-y-3 rounded-2xl bg-secondary p-4 text-left">
          <div className="flex items-center gap-3">
            <IconCalendar className="size-5 shrink-0 text-primary" />
            <span className="text-sm font-medium capitalize text-foreground">
              {formatDate(appointment.date, false)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <IconClock className="size-5 shrink-0 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {formatTime(appointment.date)} · sessão de 1 hora
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <Link href={`/${business}/appointment`}>
            <Button className="w-full" size="lg">
              Fazer novo agendamento
            </Button>
          </Link>

          <Link href="/">
            <Button className="w-full" size="lg" variant="outline">Alterar data ou hora</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
