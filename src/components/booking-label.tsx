import {IconCircleCheck, IconClock} from '@tabler/icons-react';
import {AppointmentStatus} from '@/lib/utils';
import {Badge} from './ui/badge';

interface BookingLabelProps {
  status: string;
}

export function BookingLabel({status}: BookingLabelProps) {
  return (
    <>
      {status === AppointmentStatus.PENDING && (
        <Badge className="font-bold" variant="destructive">
          <IconClock /> Pending
        </Badge>
      )}

      {status === AppointmentStatus.CONFIRMED && (
        <Badge className="font-bold" variant="secondary">
          <IconCircleCheck /> Confirmed
        </Badge>
      )}
    </>
  );
}
