'use server';

import prisma from '@/lib/prisma';
import type {SignUpFormData} from '@/lib/schemas/sign-up.schema';
import {createClient} from '@/lib/supabase/server';

export async function signUp(data: SignUpFormData) {
  const client = await createClient();
  const {
    data: {user},
    error,
  } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.APP_URL}/auth/verify`,
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error('Something went wrong when creating user.');
  }

  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
    },
  });

  await prisma.business.create({
    data: {
      profileId: profile.id,
      meta: {},
      name: data.company,
      url: data.company.toLowerCase().split(' ').join('-'),
      address: 'Test',
    },
  });
}
