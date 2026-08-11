import {IconChevronLeft} from '@tabler/icons-react';
import Link from 'next/link';
import type {PropsWithChildren} from 'react';
import {Logo} from '@/components/logo';

export default function AuthLayout({children}: PropsWithChildren) {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* Top nav */}
      <header className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm">
          <IconChevronLeft className="size-4" />
          Início
        </Link>
      </header>

      {/* Center content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-24">
        <div className="flex w-full max-w-110 flex-col items-center">
          <Logo />

          <h1 className="mt-6 text-pretty text-center text-3xl font-semibold tracking-tight">
            Entrar no Toskio
          </h1>

          <p className="mt-2 text-center text-sm">
            Não tem uma conta?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-foreground hover:underline"
            >
              Cadastre-se
            </Link>
            .
          </p>

          <div className="mt-8 w-full">{children}</div>

          <p className="mt-6 text-balance text-center text-xs leading-relaxed text-muted-foreground">
            Ao entrar, você concorda com nossos{' '}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Termos
            </Link>{' '}
            e{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
