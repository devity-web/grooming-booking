import {CheckCircle, Clock} from 'lucide-react';
import {Badge} from './ui/badge';

interface BookingLabelProps {
  status: string;
}

export function BookingLabel({status}: BookingLabelProps) {
  return (
    <>
      {status === 'pending' && (
        <Badge className="font-bold" variant="destructive">
          <Clock /> Pending
        </Badge>
      )}

      {status === 'confirmed' && (
        <Badge className="font-bold" variant="secondary">
          <CheckCircle /> Confirmed
        </Badge>
      )}
    </>
  );
}
