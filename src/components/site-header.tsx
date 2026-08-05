'use client';

import {IconLink, IconMoon, IconRefresh, IconSun} from '@tabler/icons-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useTheme} from 'next-themes';
import {useTransition} from 'react';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {Button} from './ui/button';

export function SiteHeader() {
  const [isPending, startTransition] = useTransition();
  const {theme, setTheme} = useTheme();
  const router = useRouter();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex gap-2">
          <Button onClick={toggleTheme} variant="outline" size="icon">
            {/* Sun icon: shown in dark mode, hidden in light mode */}
            <IconSun className="h-4 w-4 hidden dark:block" />

            {/* Moon icon: shown in light mode, hidden in dark mode */}
            <IconMoon className="h-4 w-4 block dark:hidden" />

            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="outline" onClick={handleRefresh} size="icon">
            <IconRefresh className={isPending ? 'animate-spin' : ''} />
          </Button>

          <Link target="_blank" href="/appointment">
            <Button variant="secondary">
              <IconLink />
              Página de Agendamento
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
