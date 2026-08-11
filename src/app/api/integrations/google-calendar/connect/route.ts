import {NextResponse} from 'next/server';
import {createGoogleAuth} from '@/lib/integrations/calendar';

export async function GET() {
  const oauth = createGoogleAuth();
  const url = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    // state: securelyGeneratedState,
  });

  return NextResponse.redirect(url);
}
