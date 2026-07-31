'use server';

import {Suspense} from 'react';
import {PendingTable} from '@/components/pending-table';
import {SectionCards} from '@/components/section-cards';
import {Spinner} from '@/components/ui/spinner';
import prisma from '@/lib/prisma';

async function SectionCardsWrapper() {
  const appointments = await prisma.appointment.count();
  const services = await prisma.service.count();
  const customers = await prisma.user.count();

  return (
    <SectionCards
      appointments={appointments}
      customers={customers}
      services={services}
    />
  );
}

async function PendingTableWrapper() {
  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'pending',
    },
    include: {
      user: true,
      service: true,
    },
  });

  return <PendingTable appointments={appointments} />;
}

function SectionCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-pulse">
      <div className="h-28 rounded-xl bg-muted" />
      <div className="h-28 rounded-xl bg-muted" />
      <div className="h-28 rounded-xl bg-muted" />
    </div>
  );
}

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Suspense fallback={<SectionCardsSkeleton />}>
        <SectionCardsWrapper />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex justify-center">
            <Spinner className="size-10" />
          </div>
        }
      >
        <PendingTableWrapper />
      </Suspense>
    </div>
  );
}
