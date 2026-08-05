import {
  IconCalendar,
  IconDog,
  IconGauge,
  IconScissors,
  IconSettings,
} from '@tabler/icons-react';
import Image from 'next/image';
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
              <Image
                alt="Logo"
                src="/images/logo.png"
                width={32}
                height={32}
              />
              <span className="text-base font-semibold">Toskio</span>
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
