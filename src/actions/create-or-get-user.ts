'use server';

import prisma from '@/lib/prisma';

export type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
};

export async function createOrGetUser(data: CreateUserInput) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      console.log('[create-or-get-user] Getting existing user', existingUser);
      return {success: true, user: existingUser};
    }

    console.log('[create-or-get-user] Creating user with data', data);
    const newUser = await prisma.user.create({
      data,
    });

    return {success: true, user: newUser};
  } catch (error) {
    console.error('[create-or-get-user] Error creating user', error);
    return {success: false, error: 'Falha ao criar usuário. Tente novamente.'};
  }
}
