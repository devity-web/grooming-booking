import {NextResponse} from 'next/server';
import {signUp} from '@/actions/sign-up';
import {signUpFormSchema} from '@/lib/schemas/sign-up.schema';

export async function POST(request: Request) {
  const parsed = signUpFormSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      {message: 'Invalid registration details'},
      {status: 400},
    );
  }

  try {
    await signUp(parsed.data);
    return NextResponse.json({success: true});
  } catch (error) {
    return NextResponse.json(
      {message: error instanceof Error ? error.message : String(error)},
      {status: 500},
    );
  }
}
