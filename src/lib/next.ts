import {NextResponse} from 'next/server';

export function badRequest(message: string) {
  return NextResponse.json(
    {
      message,
    },
    {status: 400},
  );
}

export function conflict(message: string) {
  return NextResponse.json(
    {
      message,
    },
    {status: 409},
  );
}

export function ok(body: unknown) {
  return NextResponse.json(body, {status: 200});
}

export function internalServerError(error: Error) {
  console.error(error);
  return NextResponse.json({message: error.message}, {status: 500});
}
