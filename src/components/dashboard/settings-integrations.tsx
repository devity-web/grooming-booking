import {
  IconApiAppOff,
  IconBarrierBlock,
  IconSparkles,
} from '@tabler/icons-react';
import Link from 'next/link';
import {Suspense} from 'react';
import type {Business} from '@/app/generated/prisma/client';
import prisma from '@/lib/prisma';
import {GoogleCalendarIcon} from '../icons/logos-google-calendar';
import {Button} from '../ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '../ui/card';
import {Skeleton} from '../ui/skeleton';

export function SettingsIntegrationsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-44" />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsIntegrations({business}: {business: Business}) {
  return (
    <Suspense fallback={<SettingsIntegrationsSkeleton />}>
      <SettingsIntegrationsWrapper business={business} />
    </Suspense>
  );
}

const currentIntegrations = [
  {
    type: 'google-calendar',
    title: 'Google Calendar',
    icon: <GoogleCalendarIcon />,
    description:
      'Integrate your appointments with your google calendar account.',
  },
];

async function SettingsIntegrationsWrapper({business}: {business: Business}) {
  const integrations = await prisma.integration.findMany({
    where: {
      profileId: business.profileId,
    },
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {currentIntegrations.map(integration => (
        <Card key={integration.type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {integration.icon}
              {integration.title}
            </CardTitle>
          </CardHeader>
          <CardContent>{integration.description}</CardContent>
          <CardFooter>
            {integrations.some(i => i.type === integration.type) ? (
              <Button variant="destructive">
                <IconApiAppOff />
                Remove integration
              </Button>
            ) : (
              <Link href="/api/integrations/google-calendar/connect">
                <Button>
                  <IconSparkles />
                  Connect your account
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBarrierBlock />
            Other integrations
          </CardTitle>
        </CardHeader>
        <CardContent> Coming soon...</CardContent>
      </Card>
    </div>
  );
}
