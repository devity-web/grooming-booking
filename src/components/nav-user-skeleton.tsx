import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from './ui/sidebar';
import {Skeleton} from './ui/skeleton';

export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" disabled className="pointer-events-none">
          {/* Avatar Skeleton */}
          <Skeleton className="size-8 rounded-lg" />

          {/* User Details Skeleton */}
          <div className="grid flex-1 text-left text-sm leading-tight gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>

          {/* Icon Skeleton */}
          <Skeleton className="ml-auto size-4 rounded-md" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
