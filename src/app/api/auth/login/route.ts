import {NextResponse} from 'next/server';
import {signIn} from '@/actions/sign-in';
import {signInFormSchema} from '@/lib/schemas/sign-in.schema';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(request: Request) {
  const parsed = signInFormSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({message: 'Invalid credentials'}, {status: 400});
  }

  try {
    const {business, error} = await signIn(parsed.data);

    if (error || !business) {
      return NextResponse.json(
        {message: getErrorMessage(error ?? 'Unable to sign in')},
        {status: 401},
      );
    }

    return NextResponse.json({business: {url: business.url}});
  } catch (error) {
    return NextResponse.json({message: getErrorMessage(error)}, {status: 500});
  }
}
