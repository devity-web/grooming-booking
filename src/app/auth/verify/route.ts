import {cookies} from 'next/headers';
import {type NextRequest, NextResponse} from 'next/server';
import {getServerEnv} from '@/lib/env';
import {badRequest, internalServerError} from '@/lib/next';
import prisma from '@/lib/prisma';
import {createClient} from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const token_hash = req.nextUrl.searchParams.get('token_hash');
  const type = req.nextUrl.searchParams.get('type');

  if (!token_hash) {
    return badRequest('token_hash is required');
  }

  if (!type) {
    return badRequest('type is required');
  }

  const client = await createClient();

  const {
    data: {user},
    error,
  } = await client.auth.verifyOtp({
    token_hash,
    type,
  });

  if (error || !user) {
    console.error('[auth-verify] failed to verifyOtp', error);
    return internalServerError(new Error('Something went wrong.'));
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
    return internalServerError(
      new Error('Unabel to find business for account'),
    );
  }

  const env = getServerEnv();

  cookieStore.set('business-url', business.url, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(`${env.APP_URL}/${business.url}/dashboard`);
}
