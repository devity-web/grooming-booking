'use client';

import {
  Calendar,
  Dog,
  LayoutDashboardIcon,
  PawPrint,
  TowelRack,
} from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import {NavMain} from '@/components/nav-main';
import {NavUser} from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'Calendar',
      url: '/dashboard/calendar',
      icon: <Calendar />,
    },
    {
      title: 'Services',
      url: '/dashboard/services',
      icon: <TowelRack />,
    },
    {
      title: 'Bookings',
      url: '/dashboard/bookings',
      icon: <Dog />,
    },
  ],
};
export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <PawPrint className="size-5!" />
              <span className="text-base font-semibold">Grooming Booking</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
