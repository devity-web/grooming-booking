import {IconArrowLeft, IconMail} from '@tabler/icons-react';
import Link from 'next/link';
import type {ReactNode} from 'react';
import {Logo} from '@/components/logo';
import {Separator} from '@/components/ui/separator';

type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export function LegalPage({
  eyebrow,
  title,
  description,
  updatedAt,
  sections,
}: LegalPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf5] text-[#342a25]">
      <div
        className="absolute -top-36 -right-40 size-112 rounded-full bg-[#f7dcc5]/55 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative z-20 border-b border-[#342a25]/8 bg-[#fffaf5]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Toskio — página inicial"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#f7d8bc] text-[#8a4329]">
              <Logo className="size-8" />
            </span>
            <span className="text-xl font-bold tracking-[-0.04em]">
              toskio.app
            </span>
          </Link>

          <nav
            className="flex items-center gap-4 text-sm font-medium text-[#655a53] sm:gap-6"
            aria-label="Páginas legais"
          >
            <Link
              href="/terms"
              className="transition-colors hover:text-[#9c4e2f]"
            >
              Termos
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#9c4e2f]"
            >
              Privacidade
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-5 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#8f482f] transition-colors hover:text-[#70351f]"
        >
          <IconArrowLeft className="size-4" aria-hidden="true" />
          Voltar ao início
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-bold tracking-[0.16em] text-[#a75536] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-balance text-4xl leading-[1.02] font-bold tracking-[-0.05em] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-[#6d6159]">
            {description}
          </p>
          <p className="mt-5 text-sm font-medium text-[#8a7a70]">
            Última atualização: {updatedAt}
          </p>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 sm:px-6 sm:pb-28 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16 lg:px-8">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-xs font-bold tracking-[0.14em] text-[#a75536] uppercase">
            Nesta página
          </p>
          <nav className="mt-4 flex flex-col gap-3" aria-label="Nesta página">
            {sections.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm leading-5 text-[#75685f] transition-colors hover:text-[#9c4e2f]"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="rounded-[1.75rem] border border-[#342a25]/8 bg-white/75 px-6 py-2 shadow-sm shadow-[#80462d]/5 sm:px-10">
          {sections.map((section, index) => (
            <div key={section.id}>
              {index > 0 && <Separator />}
              <section id={section.id} className="scroll-mt-8 py-8 sm:py-10">
                <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-[1rem] leading-7 text-[#655a53] [&_a]:font-semibold [&_a]:text-[#93482f] [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:text-[#3f342e] [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
                  {section.content}
                </div>
              </section>
            </div>
          ))}
        </article>
      </section>

      <footer className="relative border-t border-[#342a25]/8 bg-white/35">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-[#786c64] sm:flex-row sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-[#3b302a]"
          >
            <Logo className="size-6" /> toskio
          </Link>
          <p>Transparência também faz parte do cuidado.</p>
          <a
            href="mailto:ola@toskio.com"
            className="flex items-center gap-2 transition-colors hover:text-[#9c4e2f]"
          >
            <IconMail className="size-4" aria-hidden="true" />
            ola@toskio.com
          </a>
        </div>
      </footer>
    </main>
  );
}
