'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {IconPaw} from '@tabler/icons-react';
import {useMutation} from '@tanstack/react-query';
import {
  CalendarDays,
  Clock,
  Mail,
  PawPrint,
  Scissors,
  User,
  UserPen,
} from 'lucide-react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {Suspense, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {createAppointment} from '@/actions/create-appointment';
import type {Business} from '@/app/generated/prisma/client';
import {BookingCalendar} from '@/components/booking/booking-calendar';
import {TimeSlots} from '@/components/booking/time-slots';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {formatDate} from '@/lib/utils';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {ServicesSelect} from './services-select';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.email('Email inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  service: z.uuid('Escolha um serviço'),
  petName: z.string().min(1, 'O nome do PET é obrigatório'),
});

export function BookingExperienceSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-10 flex flex-col items-center gap-5 sm:flex-row">
        <Skeleton className="size-24 shrink-0 rounded-3xl sm:size-28" />
        <div className="flex w-full flex-col items-center gap-2 sm:items-start">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-9 w-full max-w-md sm:h-10" />
          <Skeleton className="h-5 w-full max-w-sm" />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="h-6 w-44" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({length: 9}).map((_, index) => (
                <Skeleton
                  className="h-11.5 rounded-xl"
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items have no identity
                  key={index}
                />
              ))}
            </div>
          </section>
        </div>

        <section className="flex h-fit flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="flex flex-col gap-4">
            {['service', 'name', 'email', 'phone'].map(field => (
              <div className="space-y-2" key={field}>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 rounded-2xl bg-secondary p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>

          <Skeleton className="mt-5 h-11 w-full rounded-md" />
        </section>
      </div>
    </div>
  );
}

export function BookingExperience({business}: {business: Business}) {
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<string>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      petName: '',
    },
  });

  const {mutate, isPending} = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (!date || !slot) {
        return;
      }

      return await createAppointment(business.id, {
        form: {
          email: data.email,
          name: data.name,
          phone: data.phone,
        },
        date: date,
        slot: slot,
        service: data.service,
        petName: data.petName,
      });
    },
    onSuccess: data => {
      if (data) {
        router.push(`/${business.url}/appointment/${data.appointment.id}`);
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutate(data);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      {/* Header */}
      <header className="mb-10 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border border-border shadow-sm sm:size-28">
          <Image
            src="/images/groomed-pet.png"
            alt="Cachorro fofo recém tosado"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <PawPrint className="size-3.5" />
            {business.name} · {business.address}
          </span>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground text-balance sm:text-4xl">
            Agende o cuidado do seu pet
          </h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            Escolha a data e o horário, preencha seus dados e pronto!
          </p>
        </div>
      </header>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 lg:grid-cols-2"
      >
        <Form {...form}>
          <div className="flex flex-col gap-6">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" />
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  1. Escolha a data
                </h2>
              </div>
              <Suspense>
                <BookingCalendar
                  selected={date}
                  onSelect={d => {
                    setDate(d);
                    setSlot(undefined);
                  }}
                />
              </Suspense>
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  2. Escolha o horário
                </h2>
              </div>
              <TimeSlots selected={slot} onSelect={setSlot} date={date} />
            </section>
          </div>

          {/* Right column: form */}
          <section className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 h-fit">
            <div className="mb-4 flex items-center gap-2">
              <User className="size-5 text-primary" />
              <h2 className="font-heading text-lg font-semibold text-foreground">
                3. Seus dados
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="service"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Serviço
                    </FormLabel>
                    <div className="relative">
                      <Scissors className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <ServicesSelect
                        businessId={business.id}
                        onChange={field.onChange}
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Nome
                    </FormLabel>
                    <div className="relative">
                      <UserPen className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="O teu nome aqui"
                        {...field}
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Email
                    </FormLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="py-2.5 pl-9 pr-3"
                        placeholder="O teu email aqui"
                        {...field}
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="petName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Nome do PET
                    </FormLabel>
                    <div className="relative">
                      <IconPaw className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="O nome do teu pet"
                        {...field}
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-right font-medium text-foreground">
                      Telefone
                    </FormLabel>
                    <div className="relative">
                      <UserPen className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="py-2.5 pl-9 pr-3"
                        placeholder="O teu telefone aqui"
                        {...field}
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Summary */}
            <div className="mt-5 rounded-2xl bg-secondary p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Resumo
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {date ? formatDate(date, false) : 'Data não selecionada'}
              </p>
              <p className="text-sm text-muted-foreground">
                {slot
                  ? `${slot} · sessão de 1 hora`
                  : 'Horário não selecionado'}
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-5 w-full"
              isLoading={isPending}
              disabled={!date || !slot}
            >
              Confirmar agendamento
            </Button>
          </section>
        </Form>
      </form>
    </div>
  );
}
