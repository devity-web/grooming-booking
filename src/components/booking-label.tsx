import {CheckCircle, Clock} from 'lucide-react';
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
          <Clock /> Pending
        </Badge>
      )}

      {status === AppointmentStatus.CONFIRMED && (
        <Badge className="font-bold" variant="secondary">
          <CheckCircle /> Confirmed
        </Badge>
      )}
    </>
  );
}
