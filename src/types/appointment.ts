import type {Prisma} from '@/app/generated/prisma/client';

export type Appointment = Prisma.AppointmentGetPayload<{
  include: {user: true; service: true};
}>;
