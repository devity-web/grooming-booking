import {randomBytes} from 'node:crypto';
import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';
import {createGoogleAuth} from '@/lib/integrations/calendar';

export async function GET() {
  const oauth = createGoogleAuth();

  const state = randomBytes(32).toString('hex');
  const cookieStore = await cookies();

  cookieStore.set('google-calendar-oauth-state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/integrations/google-calendar',
    maxAge: 10 * 60,
  });

  const url = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    state,
  });

  return NextResponse.redirect(url);
}
