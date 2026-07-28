'use server';

import prisma from '@/lib/prisma';

export async function getServices() {
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
    },
  });

  return services;
}
