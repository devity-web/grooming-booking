'use client';

import {useSearchParams} from 'next/navigation';
import type {ReactNode} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

const settingsTabs = ['account', 'business', 'integrations'] as const;

type SettingsTab = (typeof settingsTabs)[number];

function isSettingsTab(value: string | null): value is SettingsTab {
  return settingsTabs.some(tab => tab === value);
}

interface Tab {
  key: string;
  label: string;
  component: ReactNode;
  icon: ReactNode;
}

export function SettingsTabs({tabs}: {tabs: Tab[]}) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const currentTab = isSettingsTab(tabParam) ? tabParam : 'account';

  const handleTabChange = (tab: SettingsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="flex flex-col"
    >
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.key} value={tab.key}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
