import { prisma } from '@/lib/prisma';
import { withCors, handleOptions } from '@/lib/withCors';
import { NextResponse } from 'next/server';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params }: Params) {
  const vendorId = parseInt(params.id);

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        products: {
          include: {
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!vendor) {
      return new Response('Vendor no encontrado', { status: 404 });
    }
    return withCors(NextResponse.json(vendor));
  } catch (error) {
    console.error('Error al obtener vendor:', error);
    return withCors(
      NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    );
  }
}
export function OPTIONS() {
  return handleOptions();
}
