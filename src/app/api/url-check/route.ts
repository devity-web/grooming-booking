import type {NextRequest} from 'next/server';
import {badRequest, conflict, ok} from '@/lib/next';
import prisma from '@/lib/prisma';
import { delay } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  if (!slug) {
    return badRequest('Missing business slug');
  }

  await delay(1000);

  const business = await prisma.business.findFirst({
    where: {
      url: slug,
    },
    select: {
      id: true,
    },
  });

  if (business) {
    return conflict('This url slug is not valid');
  }

  return ok({message: 'This is a valid business url'});
}
