'use server';

import {revalidatePath} from 'next/cache';
import prisma from '@/lib/prisma';

export async function toggleService(id: string, isActive: boolean) {
  try {
    const service = await prisma.service.update({
      where: {id},
      data: {
        isActive: !isActive,
      },
    });

    if (!service) {
      return {
        message: 'Service not found',
      };
    }

    revalidatePath('/dashboard/services');

    return {
      message: `Service successfully ${service.isActive ? 'enabled' : 'disabled'}`,
    };
  } catch (error) {
    console.error(error);
  }
}
