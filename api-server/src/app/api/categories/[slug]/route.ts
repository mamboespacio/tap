import { prisma } from '@/lib/prisma';
import { withCors, handleOptions } from '@/lib/withCors';

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
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
      return withCors(
        new Response(JSON.stringify({ error: 'Categoría no encontrada' }), {
          status: 404,
        })
      );
    }

    return withCors(
      new Response(JSON.stringify(category), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return withCors(
      new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  }
}

// Soporte para preflight CORS
export function OPTIONS() {
  return handleOptions();
}
