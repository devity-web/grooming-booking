'use server';

import {cookies} from 'next/headers';
import prisma from '@/lib/prisma';
import {createClient} from '@/lib/supabase/server';

export async function signIn(data: {email: string; password: string}) {
  const client = await createClient();
  const {
    data: {user},
    error,
  } = await client.auth.signInWithPassword(data);

  if (error) {
    return {error};
  }

  if (!user) {
    return {error: 'Something went wrong.'};
  }

  const cookieStore = await cookies();

  const business = await prisma.business.findFirst({
    where: {
      profile: {
        userId: user.id,
      },
    },
  });

  if (!business) {
    return {error: 'Missing business'};
  }

  cookieStore.set('business-url', business.url, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return {user, business};
}
