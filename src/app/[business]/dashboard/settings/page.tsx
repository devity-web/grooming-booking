import {IconDog, IconUser} from '@tabler/icons-react';
import {SettingsAccount} from '@/components/dashboard/settings-account';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

export default function SettingsPage() {
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
      </Tabs>
    </div>
  );
}
