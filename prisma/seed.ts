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

  const defaultHowToOrder = [
    { title: 'Pilih Produk', desc: 'Buka katalog lalu pilih item 8 Ball Pool yang ingin Anda beli.' },
    { title: 'Masuk Keranjang', desc: 'Klik tombol beli pada produk agar item masuk ke keranjang belanja.' },
    { title: 'Lanjut Checkout', desc: 'Dari halaman keranjang, klik lanjutkan ke checkout untuk proses pembayaran.' },
    { title: 'Isi Data Pemesan', desc: 'Masukkan nama, nomor WhatsApp aktif, UID game, dan catatan bila perlu.' },
    { title: 'Pilih Pembayaran', desc: 'Pilih QRIS atau transfer bank, lakukan pembayaran, lalu upload bukti transfer.' },
    { title: 'Kirim Konfirmasi', desc: 'Klik kirim konfirmasi, lalu Anda otomatis diarahkan ke WhatsApp admin untuk verifikasi.' },
  ];

  const defaultFaqs = [
    {
      question: 'Apakah pembelian item di sini aman dari resiko banned?',
      answer:
        'Ya, 100% aman. Kami menggunakan metode transfer koin teraman dan legal via Google Play untuk Cash. Kami juga memberikan garansi penuh untuk setiap transaksi Anda.'
    },
    {
      question: 'Berapa lama waktu proses setelah pengiriman data?',
      answer:
        'Rata-rata waktu proses kami berkisar antara 5 sampai 15 menit setelah data pemesanan diterima admin kami di WhatsApp. Untuk paket cash sultan paling lambat adalah 30 menit.'
    },
    {
      question: 'Apakah saya perlu memberikan login akun 8 Ball Pool saya?',
      answer:
        'Untuk koin (transfer koin), kami HANYA membutuhkan ID Unik (UID) akun Anda. Sedangkan untuk Top Up Cash atau suntik pieces tertentu, terkadang dibutuhkan detail login akun (Miniclip/Facebook/Google) demi kelancaran proses inject.'
    },
    {
      question: 'Metode pembayaran apa saja yang didukung?',
      answer:
        'Pembayaran dilakukan dengan cara transfer manual yang akan dikonfirmasi langsung oleh admin via WhatsApp. Kami mendukung transfer Bank lokal (BCA, Mandiri, BRI, BNI), QRIS, Gopay, OVO, Dana, dan ShopeePay.'
    }
  ];

  const defaultTestimonials = [
    {
      name: 'Muhammad Richo',
      date: 'Kemarin',
      review: 'Beli 1 Miliar Koin prosesnya super cepat, cuma nunggu 10 menit koin langsung masuk akun. Pelayanannya ramah banget, recommended seller!',
      avatarText: 'MR',
      item: '1 Billion Coins'
    },
    {
      name: 'Ahmad Fauzi',
      date: '2 hari lalu',
      review: 'Awalnya ragu beli Archangel Cue pieces di sini. Ternyata transaksinya sangat aman dan dipandu admin step-by-step. Keren store ini!',
      avatarText: 'AF',
      item: 'Archangel Pieces'
    },
    {
      name: 'Christian Wijaya',
      date: '5 hari lalu',
      review: 'Top up 5.000 cash sukses masuk akun tanpa kendala. Buka legendary boxes langsung unlock 2 cue baru. Terima kasih ChampionStore!',
      avatarText: 'CW',
      item: '5.000 Cash'
    }
  ];

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
      { key: 'how_to_order', value: JSON.stringify(defaultHowToOrder) },
      { key: 'faqs', value: JSON.stringify(defaultFaqs) },
      { key: 'testimonials', value: JSON.stringify(defaultTestimonials) },
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
