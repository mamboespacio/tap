import { prisma } from '@/lib/prisma';
import { withCors, handleOptions } from '@/lib/withCors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  const psrsedId = id ? parseInt(id, 10) : undefined;

  if (!psrsedId || isNaN(psrsedId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: psrsedId },
      include: {
        category: { select: { id: true, name: true } },
        vendor: { select: { id: true, name: true, address: true, openingHours: true, closingHours: true  } },
      },
    });

    if (!product) {
      return new Response('Producto no encontrado', { status: 404 });
    }

    return withCors(NextResponse.json(product));
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return withCors(
      NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return handleOptions();
}