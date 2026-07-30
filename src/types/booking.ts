import type {Prisma} from '@/app/generated/prisma/client';

export type Booking = Prisma.BookingGetPayload<{
  include: {user: true};
}>;
