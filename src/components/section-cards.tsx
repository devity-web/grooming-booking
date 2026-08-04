import {IconCalendar, IconScissors, IconUsers} from '@tabler/icons-react';
import {Card, CardContent, CardHeader} from './ui/card';

interface SectionCardsProps {
  appointments: number;
  services: number;
  customers: number;
}

export function SectionCards({
  appointments,
  customers,
  services,
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm">
            <IconCalendar />
          </div>
          <span className="text-2xl">{appointments}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <span className="text-base font-semibold">Appointments</span>
          {/* <p className="space-x-2">
            <span>{changePercentage}</span>
            <span className="text-muted-foreground">than last week</span>
          </p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm">
            <IconUsers />
          </div>
          <span className="text-2xl">{customers}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <span className="text-base font-semibold">Customers</span>
          {/* <p className="space-x-2">
            <span>{changePercentage}</span>
            <span className="text-muted-foreground">than last week</span>
          </p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm">
            <IconScissors />
          </div>
          <span className="text-2xl">{services}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <span className="text-base font-semibold">Services</span>
          {/* <p className="space-x-2">
            <span>{changePercentage}</span>
            <span className="text-muted-foreground">than last week</span>
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
}
