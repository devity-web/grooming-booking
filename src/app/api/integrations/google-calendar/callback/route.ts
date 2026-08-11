import {connection, type NextRequest, NextResponse} from 'next/server';
import type {Business} from '@/app/generated/prisma/client';
import {createGoogleAuth} from '@/lib/integrations/calendar';
import {badRequest, internalServerError} from '@/lib/next';
import prisma from '@/lib/prisma';
import {getContextFromSlug} from '@/lib/tenant';

export async function GET(request: NextRequest) {
  await connection();

  try {
    const code = request.nextUrl.searchParams.get('code');
    // const state = request.nextUrl.searchParams.get('state');
    const error = request.nextUrl.searchParams.get('error');

    if (!code) {
      return badRequest('Missing code');
    }

    if (error) {
      return internalServerError(new Error(error));
    }

    const oauth = createGoogleAuth();
    const {tokens} = await oauth.getToken(code);
    const {business} = await getContextFromSlug();

    if (!tokens.refresh_token) {
      return internalServerError(
        new Error('Could not retrieve a refresh token from oauth'),
      );
    }

    await upsertIntegration(business, tokens.refresh_token);

    return NextResponse.redirect(
      `${process.env.APP_URL}/${business.url}/dashboard/settings?success=google-calendar`,
    );
  } catch (error) {
    console.error(error);
    return internalServerError(
      new Error('Failed to create session with google calendar'),
    );
  }
}

async function upsertIntegration(business: Business, token: string) {
  const currentIntegration = await prisma.integration.findFirst({
    where: {
      profileId: business.profileId,
      type: 'google-calendar',
    },
  });

  const data = {
    token,
    type: 'google-calendar',
    profileId: business.profileId,
  };

  if (currentIntegration) {
    return prisma.integration.update({
      where: {
        id: currentIntegration.id,
      },
      data,
    });
  }

  return prisma.integration.create({data});
}
