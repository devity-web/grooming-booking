'use server';

import prisma from "@/lib/prisma";

type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
};

export async function createUserAction(data: CreateUserInput) {
  try {
    const newUser = await prisma.user.create({
      data
    });

    return {success: true, user: newUser};
  } catch (error) {
    console.error('Database error:', error);
    return {success: false, error: 'Falha ao criar usuário. Tente novamente.'};
  }
}
