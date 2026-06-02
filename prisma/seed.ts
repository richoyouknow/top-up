import { PrismaClient } from '@prisma/client';
import { PRODUCTS } from './seed-products';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  // Clear existing data
  await prisma.admin.deleteMany();
  await prisma.product.deleteMany();
  await prisma.order.deleteMany();
  await prisma.setting.deleteMany();

  // Seed Admin
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'admin123',
      name: 'Administrator'
    }
  });
  console.log('Seeded admin.');

  // Seed Products
  for (const p of PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice || null,
        description: p.description || '',
        imageUrl: p.image || '',
        stockStatus: p.inStock ? 'In Stock' : 'Out of Stock',
        featured: p.isBestSeller || false,
      }
    });
    console.log(`Created product with id: ${product.id}`);
  }

  // Seed Default Settings
  await prisma.setting.createMany({
    data: [
      { key: 'storeName', value: 'ChampionStore.id' },
      { key: 'storeDescription', value: 'Toko Item 8 Ball Pool Terpercaya No.1' },
      { key: 'whatsapp', value: '6281234567890' },
      { key: 'heroTitle', value: 'Jual Item 8 Ball Pool Terpercaya' },
      { key: 'heroSubtitle', value: 'Dapatkan Coins, Cash, Legendary Cue, Cue Pieces, dan item premium 8 Ball Pool dengan harga terbaik dan proses secepat kilat.' },
      { key: 'paymentQrisImageUrl', value: '' },
      { key: 'bankName', value: 'BCA' },
      { key: 'bankAccountNumber', value: '1234567890' },
      { key: 'bankAccountHolder', value: 'ChampionStore.id' },
      { key: 'bankTransferNotes', value: 'Gunakan nominal transfer yang sesuai total pesanan agar verifikasi lebih cepat.' },
    ]
  });
  console.log('Seeded settings.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
