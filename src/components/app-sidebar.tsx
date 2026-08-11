import {
  IconCalendar,
  IconDog,
  IconGauge,
  IconScissors,
  IconSettings,
} from '@tabler/icons-react';
import Link from 'next/link';
import {Suspense} from 'react';
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
import {Logo} from './logo';

const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <IconGauge />,
  },
  {
    title: 'Calendar',
    url: '/dashboard/calendar',
    icon: <IconCalendar />,
  },
  {
    title: 'Services',
    url: '/dashboard/services',
    icon: <IconScissors />,
  },
  {
    title: 'Appointments',
    url: '/dashboard/appointments',
    icon: <IconDog />,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: <IconSettings />,
  },
];

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <Logo className="size-8" />
              <span className="text-base font-bold">toskio.app</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={null}>
          <NavMain items={items} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
