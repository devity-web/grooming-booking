'use client';

import {useMutation, useQuery} from '@tanstack/react-query';
import {EllipsisVerticalIcon, LogOutIcon} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {createClient} from '@/lib/supabase/client';
import {NavUserSkeleton} from './nav-user-skeleton';

export function NavUser() {
  const client = createClient();
  const {isMobile} = useSidebar();
  const router = useRouter();

  const {data, isLoading} = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const {data, error} = await client.auth.getSession();

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const {mutate} = useMutation({
    mutationFn: async () => {
      const {error} = await client.auth.signOut();

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      router.push('/auth');
    },
  });

  const user = data?.session?.user;

  if (isLoading || !user) {
    return <NavUserSkeleton />;
  }

  const firstName = user.user_metadata.first_name;
  const lastName = user.user_metadata.last_name;
  const email = user.email;

  const getName = () => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    return '';
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }

    return '';
  };

  return (
    user && (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="aria-expanded:bg-muted"
                />
              }
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback className="rounded-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{getName()}</span>
                <span className="truncate text-xs text-foreground/70">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8">
                      <AvatarImage src={user.user_metadata.avatar_url} />
                      <AvatarFallback className="rounded-lg">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{getName()}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => mutate()}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  );
}
