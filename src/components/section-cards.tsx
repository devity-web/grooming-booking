import {Calendar, Scissors, Users} from 'lucide-react';
import {Card, CardContent, CardHeader} from './ui/card';

interface SectionCardsProps {
  bookings: number;
  services: number;
  customers: number;
}

export function SectionCards({
  bookings,
  customers,
  services,
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm">
            <Calendar />
          </div>
          <span className="text-2xl">{bookings}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <span className="text-base font-semibold">Bookings</span>
          {/* <p className="space-x-2">
            <span>{changePercentage}</span>
            <span className="text-muted-foreground">than last week</span>
          </p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm">
            <Users />
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
            <Scissors />
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
