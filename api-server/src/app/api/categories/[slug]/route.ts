import { prisma } from '@/lib/prisma';
import { withCors, handleOptions } from '@/lib/withCors';
import { NextResponse } from 'next/server';

type Params = {
  params: {
    slug: string;
  };
};

export async function GET(req: Request, { params }: Params) {
  const productId = parseInt(params.slug);

  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
      include: {
        products: {
          include: { vendor: true },
        },
      },
    });

    if (!category) {
      return new Response('Categoría no encontrada', { status: 404 });
    }

    return withCors(NextResponse.json(category));
  } catch (error) {
    console.error('Error al obtener la categoria:', error);
    return withCors(
      NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return handleOptions();
}