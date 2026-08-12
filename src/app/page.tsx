import {
  IconImageGeneration,
  IconScissors,
  IconShare,
} from '@tabler/icons-react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  Link2,
  PawPrint,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Logo} from '@/components/logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {cn} from '@/lib/utils';

const features = [
  {
    icon: CalendarDays,
    title: 'Agenda sem confusão',
    description:
      'Visualize o dia inteiro, confirme horários e mantenha sua equipe sempre em sintonia.',
  },
  {
    icon: Link2,
    title: 'Seu link de agendamento',
    description:
      'Compartilhe no Instagram e WhatsApp para seus clientes agendarem a qualquer hora.',
  },
  {
    icon: Clock3,
    title: 'Menos mensagens, mais cuidado',
    description:
      'Receba os dados do pet e do tutor organizados antes mesmo do atendimento começar.',
  },
];

const steps = [
  {
    icon: <IconImageGeneration />,
    title: 'Crie sua página',
    description:
      'Adicione o nome do seu espaço, horários e identidade em poucos minutos.',
  },
  {
    icon: <IconScissors />,
    title: 'Cadastre seus serviços',
    description:
      'Defina duração, valor e disponibilidade para cada tipo de cuidado.',
  },
  {
    icon: <IconShare />,
    title: 'Compartilhe e pronto',
    description:
      'Envie seu link e veja os novos agendamentos entrarem sozinhos na agenda.',
  },
];

const faqs = [
  {
    question: 'Preciso instalar algum aplicativo?',
    answer:
      'Não. A Toskio funciona direto no navegador, no computador ou celular. Seus clientes também agendam pelo link, sem baixar nada.',
  },
  {
    question: 'Consigo usar com mais pessoas da equipe?',
    answer:
      'Sim. Você organiza a rotina do negócio em um só lugar e mantém os atendimentos visíveis para toda a equipe.',
  },
  {
    question: 'Posso testar antes de pagar?',
    answer:
      'Pode. Você começa gratuitamente, sem cartão, e conhece o fluxo completo antes de escolher um plano.',
  },
  {
    question: 'Meus clientes precisam criar uma conta?',
    answer:
      'Não. Eles escolhem o serviço e o horário e preenchem apenas os dados necessários para o atendimento.',
  },
];

const pricingPlans = [
  {
    name: 'Ninho',
    tier: 'Starter',
    price: '4,99',
    description: 'Um cantinho simples para começar a organizar seus cuidados.',
    features: [
      'Agenda online sempre disponível',
      'Página de agendamento personalizada',
      'Cadastro de serviços e clientes',
    ],
    cta: 'Começar no Ninho',
  },
  {
    name: 'Aconchego',
    tier: 'Pro',
    price: '9,99',
    description: 'Mais tranquilidade para uma rotina que já está crescendo.',
    features: [
      'Tudo do plano Ninho',
      'Agendamentos ilimitados',
      'Integração com Google Calendar',
      'Visão completa da rotina',
    ],
    cta: 'Escolher Aconchego',
    featured: true,
  },
  {
    name: 'Matilha',
    tier: 'Equipe',
    price: '19,99',
    description: 'Para dividir o cuidado e manter toda a equipe em sintonia.',
    features: [
      'Tudo do plano Aconchego',
      'Rotina compartilhada com a equipe',
      'Organização de vários profissionais',
      'Atendimento prioritário',
    ],
    cta: 'Crescer com a Matilha',
  },
];

const starLabels = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5'];

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf5] text-[#342a25]">
      <header className="relative z-20 border-b border-[#342a25]/8 bg-[#fffaf5]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <a
            href="#inicio"
            className="flex items-center gap-2.5"
            aria-label="Toskio — início"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#f7d8bc] text-[#8a4329]">
              <Logo className="size-8" />
            </span>
            <span className="text-xl font-bold tracking-[-0.04em]">
              toskio.app
            </span>
          </a>

          <nav
            className="hidden items-center gap-7 text-sm font-medium text-[#655a53] md:flex"
            aria-label="Navegação principal"
          >
            <a
              className="transition-colors hover:text-[#9c4e2f]"
              href="#recursos"
            >
              Recursos
            </a>
            <a
              className="transition-colors hover:text-[#9c4e2f]"
              href="#como-funciona"
            >
              Como funciona
            </a>
            <a
              className="transition-colors hover:text-[#9c4e2f]"
              href="#duvidas"
            >
              Dúvidas
            </a>
            <a
              className="transition-colors hover:text-[#9c4e2f]"
              href="#planos"
            >
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              nativeButton={false}
              className="h-10 rounded-full bg-[#9c4e2f] px-5 text-white shadow-sm hover:bg-[#813d25]"
              render={<Link href="/auth" />}
            >
              Começar grátis
            </Button>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative">
        <div
          className="absolute -top-20 -right-56 size-128 rounded-full bg-[#f8dfca]/50 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8 lg:py-24">
          <div className="relative z-10 text-center lg:text-left">
            <h1 className="text-balance text-[2.8rem] leading-[0.98] font-bold tracking-[-0.055em] sm:text-6xl lg:text-[4.5rem]">
              Sua agenda em ordem. Mais tempo para{' '}
              <span className="text-[#b75d3d]">cuidar.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-8 text-[#675b53] lg:mx-0">
              Agendamentos online simples para pet shops e groomers. Menos
              mensagens, menos furos e uma rotina muito mais leve.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                nativeButton={false}
                className="h-13 w-full rounded-full bg-[#9c4e2f] px-6 text-base text-white shadow-lg shadow-[#9c4e2f]/15 hover:bg-[#813d25] sm:w-auto"
                render={<a href="/auth/signup" />}
              >
                Criar minha agenda <ArrowRight className="size-4" />
              </Button>
              <span className="flex items-center gap-2 text-sm text-[#746860]">
                <Check className="size-4 text-[#6c7b46]" /> Grátis para começar
                · sem cartão
              </span>
            </div>
            <div className="mt-9 flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex -space-x-2" aria-hidden="true">
                {['bg-[#efd1b3]', 'bg-[#d9b89d]', 'bg-[#f2c6b7]'].map(color => (
                  <span
                    key={color}
                    className={`flex size-8 items-center justify-center rounded-full border-2 border-[#fffaf5] ${color}`}
                  >
                    <PawPrint className="size-3.5 text-[#774c38]" />
                  </span>
                ))}
              </div>
              <p className="text-sm text-[#6d625b]">
                <strong className="text-[#3c312b]">Rotinas mais leves</strong>{' '}
                para quem cuida
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            <div className="absolute -left-5 top-10 hidden rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-[#7c4b35]/10 sm:flex sm:items-center sm:gap-3 lg:-left-10">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#e7edda] text-[#5e7138]">
                <Check className="size-5" />
              </span>
              <div>
                <p className="text-xs text-[#756a63]">Novo agendamento</p>
                <p className="text-sm font-semibold">Bento · Banho & tosa</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-4xl border-[6px] border-white bg-[#f2c6a8] shadow-2xl shadow-[#80462d]/15">
              <Image
                src="/images/hero-grooming.jpg"
                alt="Corgi feliz em um espaço de banho e tosa acolhedor"
                width={1280}
                height={1024}
                className="aspect-5/4 h-auto w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-5 right-4 flex items-center gap-2 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-xl shadow-[#7c4b35]/10 sm:right-8">
              <div
                className="flex gap-0.5 text-[#d87947]"
                role="img"
                aria-label="5 de 5 estrelas"
              >
                {starLabels.map(star => (
                  <Star key={star} className="size-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold">Tutoria feliz</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y border-[#342a25]/8 bg-white/55 py-7"
        aria-label="Benefícios rápidos"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-10 gap-y-3 px-5 text-sm font-medium text-[#655a53]">
          {[
            'Agenda online 24h',
            'Configuração em minutos',
            'Feito para banho & tosa',
          ].map(item => (
            <span key={item} className="flex items-center gap-2">
              <Check className="size-4 text-[#7b8a51]" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section
        id="recursos"
        className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-[0.16em] text-[#a75536] uppercase">
            Sua rotina, simplificada
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
            Tudo o que você precisa. Nada que complique.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#6e625b]">
            Uma ferramenta acolhedora por fora e poderosa por dentro, pensada
            para o dia a dia corrido do seu negócio.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map(({icon: Icon, title, description}) => (
            <Card
              key={title}
              className="text-muted border-0 bg-white py-6 shadow-sm ring-[#342a25]/8 transition-transform duration-300 hover:-translate-y-1"
            >
              <CardContent className="px-6">
                <span className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-[#f9e4d4] text-[#a45132]">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-xl font-bold tracking-tight">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-[#6f645c]">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="como-funciona"
        className="bg-[#3e332d] py-20 text-[#fffaf5] sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <h2 className="mt-5 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
                Do cadastro ao primeiro agendamento em três passos.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-8 text-[#d8cec8]">
                Sem planilhas, treinamentos longos ou configurações difíceis.
                Você entra e já sabe o que fazer.
              </p>
            </div>
            <ol className="space-y-2">
              {steps.map(step => (
                <li
                  key={step.title}
                  className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/12 py-6 first:pt-0 last:border-0"
                >
                  <span className="font-mono text-sm text-[#e9a77e]">
                    {step.icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 leading-7 text-[#cfc4bd]">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid items-center gap-12 rounded-4xl bg-[#f4e3d3] p-7 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-14">
          <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-[1.75rem] bg-[#e6b68f]">
            <Image
              src="/images/groomed-pet.png"
              alt="Pet bem cuidado após o atendimento"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 320px, 360px"
            />
          </div>
          <blockquote>
            <div
              className="mb-5 flex gap-1 text-[#bf6842]"
              role="img"
              aria-label="5 de 5 estrelas"
            >
              {starLabels.map(star => (
                <Star key={star} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-balance text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">
              “A Toskio devolveu minhas manhãs. Hoje os clientes agendam
              sozinhos e eu começo o dia sabendo exatamente quem vou receber.”
            </p>
            <footer className="mt-7">
              <p className="font-bold">Marina Costa</p>
              <p className="mt-1 text-sm text-[#716158]">
                Fundadora, Banho de Afeto
              </p>
            </footer>
          </blockquote>
        </div>
      </section>

      <section
        id="duvidas"
        className="border-t border-[#342a25]/8 bg-white/50 py-20 sm:py-28"
      >
        <div className="mx-auto grid max-w-5xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.65fr_1.35fr] lg:px-8">
          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-[#a75536] uppercase">
              Dúvidas frequentes
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Antes de começar, talvez você queira saber.
            </h2>
          </div>
          <Accordion className="border-t border-[#342a25]/12">
            {faqs.map(faq => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border-[#342a25]/12"
              >
                <AccordionTrigger className="py-5 text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-xl pb-5 leading-7 text-[#6c6059]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section
        id="planos"
        className="bg-[#fffaf5] px-5 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold tracking-[0.16em] text-[#a75536] uppercase">
              Planos para cada fase
            </p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
              Escolha o cantinho ideal para o seu negócio crescer.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#6e625b]">
              Comece leve e mude de plano quando precisar. Sem compromisso e sem
              complicação.
            </p>
          </div>

          <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
            {pricingPlans.map(plan => (
              <Card
                key={plan.name}
                className={cn(
                  'relative gap-0 rounded-[1.75rem] py-0 shadow-sm',
                  plan.featured
                    ? 'border-[#b75d3d] bg-[#fff7f0] ring-2 ring-[#b75d3d] lg:-translate-y-3'
                    : 'border-[#342a25]/8 bg-white ring-[#342a25]/8',
                )}
              >
                {plan.featured && (
                  <Badge className="absolute top-3 left-1/2 h-7 -translate-x-1/2 bg-[#9c4e2f] px-3 text-white">
                    Mais escolhido
                  </Badge>
                )}

                <CardHeader className="gap-3 px-7 pt-8 pb-6">
                  <CardTitle
                    className={cn(
                      'text-muted text-2xl font-bold tracking-[-0.03em]',
                      plan.featured && 'mt-4'
                    )}
                  >
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="min-h-12 leading-6 text-[#74675f]">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col px-7 pb-7">
                  <div className="flex items-end gap-1 border-y border-[#342a25]/10 py-6">
                    <span className="mb-1 text-lg font-semibold text-[#6d5f57]">
                      €
                    </span>
                    <span className="text-5xl text-muted leading-none font-bold tracking-[-0.055em]">
                      {plan.price}
                    </span>
                    <span className="mb-1 text-sm text-[#74675f]">/mês</span>
                  </div>

                  <ul className="mt-7 flex flex-col gap-4">
                    {plan.features.map(feature => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-[#5f544d]"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e6ecd7] text-[#62733d]">
                          <Check className="size-3.5" aria-hidden="true" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="border-0 bg-transparent px-7 pt-0 pb-7">
                  <Button
                    nativeButton={false}
                    variant={plan.featured ? 'default' : 'outline'}
                    className={cn(
                      'h-12 w-full rounded-full text-base',
                      plan.featured
                        ? 'bg-[#9c4e2f] text-white hover:bg-[#813d25]'
                        : 'border-[#bda99c] bg-transparent text-[#4d4039] hover:bg-[#f7eade]',
                    )}
                    render={<Link href="/auth/signup" />}
                  >
                    {plan.cta}
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <p className="mt-7 text-center text-sm text-[#74675f]">
            Todos os planos incluem teste grátis. Cancele quando quiser.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-4xl bg-[#eaa67b] px-6 py-14 text-center sm:px-12 sm:py-18">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/35">
            <Heart className="size-5 fill-white/40" />
          </span>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-[-0.04em] text-[#3a2c25] sm:text-5xl">
            Uma rotina mais leve começa no próximo agendamento.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#5f4538]">
            Crie sua agenda grátis e deixe a Toskio cuidar da organização
            enquanto você cuida deles.
          </p>
          <Button
            nativeButton={false}
            className="mt-8 h-13 rounded-full bg-[#3d322c] px-7 text-base text-white hover:bg-[#2d2521]"
            render={<a href="/auth/signup" />}
          >
            Começar agora <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-[#342a25]/8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-[#786c64] sm:flex-row sm:px-6 lg:px-8">
          <a
            href="#inicio"
            className="flex items-center gap-2 font-bold text-[#3b302a]"
          >
            <PawPrint className="size-4 text-[#a65334]" /> toskio
          </a>
          <p>Feito com carinho para quem cuida.</p>
          <div className="flex gap-5">
            <a href="#duvidas" className="hover:text-[#9c4e2f]">
              Ajuda
            </a>
            <a href="mailto:ola@toskio.com" className="hover:text-[#9c4e2f]">
              Contato
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
