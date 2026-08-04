'use client';

import {IconMoon, IconRefresh, IconSun} from '@tabler/icons-react';
import {useRouter} from 'next/navigation';
import {useTheme} from 'next-themes';
import {useTransition} from 'react';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {Button} from './ui/button';

export function SiteHeader() {
  const [isPending, startTransition] = useTransition();
  const {setTheme, theme} = useTheme();
  const router = useRouter();

  const handleClick = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex gap-2">
          <Button onClick={handleClick} variant="outline" size="icon">
            {theme === 'light' && <IconMoon />}
            {theme === 'dark' && <IconSun />}
          </Button>

          <Button onClick={handleRefresh} size="icon">
            <IconRefresh className={isPending ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>
    </header>
  );
}
