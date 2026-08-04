'use server';

import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma';

export async function createService(data: {
  name: string;
  description: string;
  price: number;
}) {
  try {
    const service = await prisma.service.create({data});

    revalidatePath('/dashboard/services');

    return service;
  } catch (error) {
    console.error(error);
  }
}
