import {IconRocket} from '@tabler/icons-react';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Clock,
  PawPrint,
  Scissors,
  Sparkles,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

const features = [
  {
    icon: CalendarDays,
    title: 'Calendário vivo',
    body: 'Veja o dia inteiro num relance, arraste horários e evite sobreposições.',
  },
  {
    icon: Users,
    title: 'Ficha de cliente',
    body: 'Histórico do pet, preferências de tosquia e contactos sempre à mão.',
  },
  {
    icon: Scissors,
    title: 'Serviços e preços',
    body: 'Defina banho, tosquia e extras com duração e valor próprios.',
  },
  {
    icon: Bell,
    title: 'Lembretes automáticos',
    body: 'Menos faltas: o cliente recebe aviso antes da marcação.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Crie os seus serviços',
    body: 'Duração, preço e porte do animal.',
  },
  {
    n: '02',
    title: 'Partilhe o link',
    body: 'O cliente marca sozinho, sem telefonemas.',
  },
  {
    n: '03',
    title: 'Trabalhe tranquilo',
    body: 'A agenda enche-se e os avisos saem sozinhos.',
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Image
                alt="Logo"
                src="/images/logo-bg.png"
                width={32}
                height={32}
              />
            </span>
            <span className="font-display text-lg font-bold">Toskio</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a
              className="transition-colors hover:text-foreground"
              href="#funcionalidades"
            >
              Funcionalidades
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="#como-funciona"
            >
              Como funciona
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="#precos"
            >
              Preços
            </a>
          </nav>
          <Link href="/auth">
            <Button className="h-11">
              <IconRocket />
              Testa grátis
            </Button>
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="surface-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="size-3 text-primary" />
                Feito para salões de banho e tosquia
              </span>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] md:text-6xl">
                A agenda do seu{' '}
                <span className="text-gradient-warm">pet grooming</span>,
                finalmente arrumada.
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">
                Marcações, clientes e serviços num painel só. O Toskio trata da
                agenda enquanto você trata dos animais.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button className="h-11">
                  Experimentar grátis <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" className="h-11">
                  Ver como funciona
                </Button>
              </div>
              <div className="mt-10 flex gap-8 text-sm text-muted-foreground">
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    -38%
                  </p>
                  faltas de clientes
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    4h
                  </p>
                  poupadas por semana
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-border shadow-warm">
                <Image
                  src="/images/hero-grooming.jpg"
                  alt="Ilustração de um corgi feliz numa mesa de tosquia num salão de grooming"
                  width={1280}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-border bg-card p-4 shadow-warm sm:block">
                <p className="text-xs text-muted-foreground">
                  Próxima marcação
                </p>
                <p className="mt-1 flex items-center gap-2 font-display font-semibold">
                  <Clock className="size-4 text-primary" /> 14:30 · Banho +
                  tosquia
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="funcionalidades" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-xl text-3xl font-bold md:text-4xl">
            Tudo o que um salão precisa, sem folhas de cálculo.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(f => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="como-funciona"
          className="border-y border-border bg-card/40"
        >
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-3xl font-bold md:text-4xl">
              Em funcionamento numa tarde
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map(s => (
                <div key={s.n} className="border-t border-border pt-5">
                  <span className="font-display text-sm font-bold text-primary">
                    {s.n}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="precos"
          className="mx-auto max-w-4xl px-6 py-24 text-center"
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Um preço, sem surpresas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Marcações ilimitadas, clientes ilimitados, lembretes incluídos.
          </p>
          <div className="mx-auto mt-10 max-w-sm rounded-3xl border border-border bg-card p-8 shadow-warm">
            <p className="font-display text-5xl font-extrabold">
              19€
              <span className="text-base font-medium text-muted-foreground">
                /mês
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              14 dias grátis, sem cartão.
            </p>

            <Link href="/auth/signup">
              <Button className="h-11 mt-2">
                Criar conta <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <PawPrint className="size-4 text-primary" /> Toskio
          </span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  );
}
