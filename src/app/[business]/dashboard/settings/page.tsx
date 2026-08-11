import {IconDog, IconUser} from '@tabler/icons-react';
import {Suspense} from 'react';
import {SettingsAccount} from '@/components/dashboard/settings-account';
import {SettingsBusiness} from '@/components/dashboard/settings-business';
import {Skeleton} from '@/components/ui/skeleton';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {getTenantContext, type TenantPageProps} from '@/lib/tenant';

export default function SettingsPage({params}: TenantPageProps) {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPageWrapper params={params} />
    </Suspense>
  );
}

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-28" />

      <div className="flex flex-col">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        <div className="mt-4 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>

            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function SettingsPageWrapper({params}: TenantPageProps) {
  const {business} = await getTenantContext(params);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <Tabs defaultValue="account" className="flex flex-col">
        <TabsList>
          <TabsTrigger value="account">
            <IconUser />
            Account
          </TabsTrigger>
          <TabsTrigger value="business">
            <IconDog />
            Business
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <SettingsAccount />
        </TabsContent>
        <TabsContent value="business">
          <SettingsBusiness business={business} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
