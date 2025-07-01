// app/api/vendors/[slug]/route.ts
import { prisma } from '@/lib/prisma';
import { withCors, handleOptions } from '@/lib/withCors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.pathname.split('/').pop();
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        products: {
          some: {
            category: {
              slug: slug,
            },
          },
        },
      },
      include: {
        products: {
          where: {
            category: {
              slug: slug,
            },
          },
          include: {
            category: true,
          },
        },
      },
    });

    return withCors(NextResponse.json(vendors));
  } catch (error) {
    console.error('Error:', error);
    return withCors(
      NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return handleOptions();
}
