'use server';

import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma';

export async function upsertService(data: {
  id?: string;
  name: string;
  description: string;
  price: number;
}) {
  try {
    const service = await prisma.service.upsert({
      where: {id: data.id ?? ''},
      create: data,
      update: data,
    });

    revalidatePath('/dashboard/services');

    return service;
  } catch (error) {
    console.error(error);
  }
}
