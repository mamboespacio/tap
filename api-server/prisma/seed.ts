import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Asegurate de tener esto arriba del todo

const prisma = new PrismaClient();

async function main() {
  // 1. Crear categorías
  const categories = [
    { name: 'Comidas', slug: 'comidas' },
    { name: 'Bebidas', slug: 'bebidas' },
    { name: 'Snacks', slug: 'snacks' },
    { name: 'Postres', slug: 'postres' },
    { name: 'Promociones', slug: 'promociones' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // 2. Crear vendors
  const vendors = [
    { name: 'Cafetería El Gato', openingHours: new Date('2023-10-01T08:00:00Z'), closingHours: new Date('2023-10-01T20:00:00Z'), address: 'Calle Falsa 123' },
    { name: 'Pizzería Don Queso', openingHours: new Date('2023-10-01T10:00:00Z'), closingHours: new Date('2023-10-01T22:00:00Z'), address: 'Avenida Siempre Viva 456' },
    { name: 'Taco Tóxico', openingHours: new Date('2023-10-01T11:00:00Z'), closingHours: new Date('2023-10-01T23:00:00Z'), address: 'Plaza Mayor 789' },
  ];

  for (const vendor of vendors) {
    await prisma.vendor.upsert({
      where: { name: vendor.name },
      update: {},
      create: vendor,
    });
  }

  // 3. Crear productos conectados a vendor y categoría
  const categoriaComidas = await prisma.category.findUnique({ where: { slug: 'comidas' } });
  const categoriaBebidas = await prisma.category.findUnique({ where: { slug: 'bebidas' } });
  const categoriaSnacks = await prisma.category.findUnique({ where: { slug: 'snacks' } });

  const vendorGato = await prisma.vendor.findUnique({ where: { name: 'Cafetería El Gato' } });
  const vendorQueso = await prisma.vendor.findUnique({ where: { name: 'Pizzería Don Queso' } });

  if (!categoriaComidas || !categoriaBebidas || !categoriaSnacks || !vendorGato || !vendorQueso) {
    throw new Error('Faltan categorías o vendors para asignar productos.');
  }

  const products = [
    {
      name: 'Café con leche',
      price: 1500,
      vendorId: vendorGato.id,
      categoryId: categoriaBebidas.id,
    },
    {
      name: 'Empanada de jamón y queso',
      price: 2000,
      vendorId: vendorQueso.id,
      categoryId: categoriaComidas.id,
    },
    {
      name: 'Alfajor artesanal',
      price: 1200,
      vendorId: vendorGato.id,
      categoryId: categoriaSnacks.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log('✅ Categorías, vendors y productos cargados correctamente.');
  // 4. Crear usuario demo
  const email = 'client@demo.com';
  const plainPassword = 'client123';

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    console.log('✅ Usuario client@demo.com creado (password: client123)');
  } else {
    console.log('ℹ️ Usuario demo ya existe');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error al hacer seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
