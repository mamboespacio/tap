import db from '@/lib/prisma';

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { name: 'asc' },
      include: {
        category: { select: { id: true, name: true } },
        vendor: { select: { id: true, name: true } },
      },
    });

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
