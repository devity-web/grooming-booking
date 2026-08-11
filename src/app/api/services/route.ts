import type {NextRequest} from 'next/server';
import {badRequest, internalServerError, ok} from '@/lib/next';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('businessId');

    if (!id) {
      return badRequest('businessId is required');
    }

    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        business: {
          id,
        },
      },
    });

    return ok(services);
  } catch (error) {
    return internalServerError(error as Error);
  }
}
