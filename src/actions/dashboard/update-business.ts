'use server';

import prisma from '@/lib/prisma';

interface UpdateBusinessData {
  name: string;
  url: string;
  address: string;
}

export async function updateBusiness(id: string, data: UpdateBusinessData) {
  try {
    console.log('[update-business] updating business', data);
    const business = await prisma.business.update({
      where: {
        id,
      },
      data,
    });

    if (!business) {
      throw new Error('Business with id not found');
    }

    return business;
  } catch (error) {
    console.error('[update-business] failed to update', error);
    throw error;
  }
}
