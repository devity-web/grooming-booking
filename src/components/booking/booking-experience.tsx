'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Mail,
  MailCheck,
  PawPrint,
  Phone,
  User,
  UserPen,
} from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';
import {createOrGetUser} from '@/actions/create-or-get-user';
import {BookingCalendar} from '@/components/booking/booking-calendar';
import {TimeSlots} from '@/components/booking/time-slots';
import {Button} from '@/components/ui/button';
import {Field, FieldDescription, FieldError, FieldLabel} from '../ui/field';
import {Form, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';

type FormData = {
  name: string;
  email: string;
  phone: string;
};

const EMPTY_FORM: FormData = {name: '', email: '', phone: ''};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.email().min(1, 'Email é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
});

export function BookingExperience() {
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const user = await createOrGetUser(data);

      console.log(user);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmed(true);
      setLoading(false);
      form.reset();
    }
  };

  function resetBooking() {
    setDate(null);
    setSlot(null);
    setConfirmed(false);
  }

  if (confirmed && date && slot) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="size-9 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground text-balance">
            Agendamento confirmado!
          </h2>
          <p className="mt-2 text-muted-foreground text-pretty">
            {form.getValues('name').split(' ')[0]}, a sessão de banho e tosa do
            seu pet está reservada. Enviamos os detalhes para{' '}
            {form.getValues('email')}.
          </p>
          <div className="mt-6 space-y-3 rounded-2xl bg-secondary p-4 text-left">
            <div className="flex items-center gap-3">
              <CalendarDays className="size-5 shrink-0 text-primary" />
              <span className="text-sm font-medium capitalize text-foreground">
                {formatDate(date)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-5 shrink-0 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {slot} · sessão de 1 hora
              </span>
            </div>
          </div>
          <Button onClick={resetBooking} className="mt-6 w-full" size="lg">
            Fazer novo agendamento
          </Button>
        </div>
      </div>
    );
  }

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
            PetSpa · Banho & Tosa
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
              <BookingCalendar
                selected={date}
                onSelect={d => {
                  setDate(d);
                  setSlot(null);
                }}
              />
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  2. Escolha o horário
                </h2>
              </div>
              <TimeSlots
                selected={slot}
                onSelect={setSlot}
                disabled={date === null}
              />
            </section>
          </div>

          {/* Right column: form */}
          <section className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="size-5 text-primary" />
              <h2 className="font-heading text-lg font-semibold text-foreground">
                3. Seus dados
              </h2>
            </div>

            <div className="flex flex-col gap-4">
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
                        className="py-2.5 pl-9 pr-3"
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
              {/* <Controller
              name="name"
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Provide a concise title for your bug report.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /> */}
              {/* {FIELDS.map(field => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={field.key}
                    className="text-sm font-medium text-foreground"
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id={field.key}
                      name={field.key}
                      type={field.type}
                      required
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e =>
                        setForm(prev => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              );
            })} */}
            </div>

            {/* Summary */}
            <div className="mt-5 rounded-2xl bg-secondary p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Resumo
              </p>
              <p className="mt-1 text-sm font-medium capitalize text-foreground">
                {date ? formatDate(date) : 'Data não selecionada'}
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
              isLoading={loading}
            >
              Confirmar agendamento
            </Button>
          </section>
        </Form>
      </form>
    </div>
  );
}
