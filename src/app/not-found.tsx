import {IconArrowLeft, IconCalendar, IconUnlink} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import {Logo} from '@/components/logo';
import {Button} from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#fffaf5] px-5 py-12 text-[#342a25] sm:px-6 lg:px-8">
      <div
        className="absolute -top-28 -left-28 size-96 rounded-full bg-[#f7dcc5]/55 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-36 -bottom-36 size-120 rounded-full bg-[#efd2bb]/45 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="text-center lg:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="Toskio — página inicial"
          >
            <Logo className="size-10" />
            <span className="text-xl font-bold tracking-[-0.04em]">
              toskio.app
            </span>
          </Link>

          <div className="mt-10 flex items-center justify-center gap-3 lg:justify-start">
            <span className="font-mono text-sm font-semibold tracking-[0.2em] text-[#a75536] uppercase">
              Erro 404
            </span>
            <span className="h-px w-12 bg-[#d6b39d]" aria-hidden="true" />
            <IconUnlink className="size-6 text-[#b75d3d]" aria-hidden="true" />
          </div>

          <h1 className="mt-5 text-balance text-4xl leading-[1.05] font-bold tracking-tighter sm:text-6xl">
            Essa página saiu para{' '}
            <span className="text-[#b75d3d]">passear.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-8 text-[#6d6159] lg:mx-0">
            Parece que seguimos a trilha errada. Não se preocupe — sua agenda e
            todos os pets continuam seguros por aqui.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" render={<Link href="/" />}>
              <IconArrowLeft />
              Voltar ao início
            </Button>
            <Button
              size="lg"
              variant="secondary"
              render={<Link href="/auth" />}
            >
              <IconCalendar />
              Abrir minha agenda
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <span
            className="absolute top-2 left-4 text-[7rem] leading-none font-black tracking-[-0.08em] text-[#a75536]/8 sm:text-[10rem]"
            aria-hidden="true"
          >
            404
          </span>

          <div className="relative mt-10 overflow-hidden rounded-4xl border-[6px] border-white bg-[#f1cfb5] shadow-2xl shadow-[#80462d]/12 sm:mt-16">
            <Image
              src="/images/dog-hike.png"
              alt="Pet bem cuidado esperando você voltar"
              width={720}
              height={720}
              quality={100}
              className="aspect-square w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
