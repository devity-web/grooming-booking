'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {PropsWithChildren} from 'react';
import {AppSidebar} from '@/components/app-sidebar';
import {SiteHeader} from '@/components/site-header';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';

const queryClient = new QueryClient();

export default function DashboardLayout({children}: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="mx-auto w-full max-w-full p-6 md:max-w-6xl">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
