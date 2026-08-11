'use server';

import type {Business} from '@/app/generated/prisma/client';
import prisma from '@/lib/prisma';

export type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
};

export async function createOrGetUser(
  data: CreateUserInput,
  business: Business,
) {
  try {
    const existingUser = await prisma.customer.findFirst({
      where: {
        email: data.email,
        businessId: business.id,
      },
    });

    if (existingUser) {
      console.log('[create-or-get-user] Getting existing user', existingUser);
      return {success: true, user: existingUser};
    }

    console.log('[create-or-get-user] Creating user with data', data);
    const newUser = await prisma.customer.create({
      data: {
        ...data,
        businessId: business.id,
      },
    });

    return {success: true, user: newUser};
  } catch (error) {
    console.error('[create-or-get-user] Error creating user', error);
    return {success: false, error: 'Falha ao criar usuário. Tente novamente.'};
  }
}
