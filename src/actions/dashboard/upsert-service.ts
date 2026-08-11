'use server';

import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma';
import {getContextFromSlug} from '@/lib/tenant';

export async function upsertService(data: {
  id?: string;
  name: string;
  description: string;
  price: number;
}) {
  try {
    const {business} = await getContextFromSlug();
    const service = await prisma.service.upsert({
      where: {id: data.id ?? ''},
      create: {
        ...data,
        businessId: business.id,
      },
      update: data,
    });

    revalidatePath('/dashboard/services');

    return service;
  } catch (error) {
    console.error(error);
  }
}
