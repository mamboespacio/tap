import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop(); // o usar regex si prefieres más precisión

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug inválido' }), { status: 400 });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: { vendor: true },
        },
      },
    });

    if (!category) {
      return new Response(JSON.stringify({ error: 'Categoría no encontrada' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
    });
  }
}
