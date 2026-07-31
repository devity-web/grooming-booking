import {NextResponse} from 'next/server';
import prisma from '@/lib/prisma';
import { delay } from '@/lib/utils';

export async function GET() {
  try {
    await delay(1500);
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: 'Failed to fetch services'},
      {status: 500},
    );
  }
}
