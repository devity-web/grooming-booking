'use client';

import {Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {Button} from './ui/button';

export function SiteHeader() {
  const {setTheme, theme} = useTheme();

  const handleClick = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Button onClick={handleClick} variant="outline" size="icon">
          {theme === 'light' && <Moon />}
          {theme === 'dark' && <Sun />}
        </Button>
      </div>
    </header>
  );
}
