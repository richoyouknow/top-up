export interface Product {
  id: string;
  name: string;
  category: 'coins' | 'cash' | 'cues' | 'pieces' | 'events' | 'bundles';
  categoryLabel: string;
  description: string;
  benefits: string[];
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  isBestSeller?: boolean;
}

export const PRODUCTS: Product[] = [
  // COINS CATEGORY
  {
    id: 'coins-100m',
    name: '100 Million Coins',
    category: 'coins',
    categoryLabel: 'Coins',
    description: 'Koin 8 Ball Pool sebesar 100 Juta untuk bermain di meja taruhan tinggi seperti Cairo atau Shanghai.',
    benefits: [
      'Proses transfer koin super cepat (5-10 menit)',
      '100% aman dan bergaransi anti-banned',
      'Cocok untuk pemain pemula yang ingin naik kelas',
      'Dipandu langsung oleh admin ahli'
    ],
    price: 15000,
    originalPrice: 20000,
    image: '/coins.png',
    inStock: true,
    isBestSeller: false
  },
  {
    id: 'coins-500m',
    name: '500 Million Coins',
    category: 'coins',
    categoryLabel: 'Coins',
    description: 'Koin 8 Ball Pool sebesar 500 Juta untuk mendominasi meja Paris dan London.',
    benefits: [
      'Proses transfer koin super cepat (10-15 menit)',
      'Garansi aman tanpa resiko banned akun',
      'Persiapan terbaik untuk berpartisipasi di turnamen besar',
      'Harga promo hemat dibanding beli satuan'
    ],
    price: 50000,
    originalPrice: 70000,
    image: '/coins.png',
    inStock: true,
    isBestSeller: true
  },
  {
    id: 'coins-1b',
    name: '1 Billion Coins',
    category: 'coins',
    categoryLabel: 'Coins',
    description: 'Koin 8 Ball Pool sebesar 1 Miliar (1 Billion). Akses penuh ke meja taruhan eksklusif seperti Rome atau Berlin.',
    benefits: [
      'Transfer koin via sistem koin teraman',
      'Diproses instant 15-20 menit saja',
      'Bebas bermain di meja taruhan tertinggi',
      'Bonus tips menjaga koin dari admin'
    ],
    price: 90000,
    originalPrice: 125000,
    image: '/coins.png',
    inStock: true,
    isBestSeller: true
  },
  {
    id: 'coins-5b',
    name: '5 Billion Coins',
    category: 'coins',
    categoryLabel: 'Coins',
    description: 'Paket Sultan Koin 8 Ball Pool sebesar 5 Miliar. Jadilah legenda billiard sesungguhnya tanpa takut bangkrut.',
    benefits: [
      'Layanan transfer koin prioritas utama',
      'Garansi VIP full recovery jika terjadi kendala',
      'Stok melimpah dan harga paling kompetitif',
      'Bonus konsultasi eksklusif dengan pro player'
    ],
    price: 400000,
    originalPrice: 550000,
    image: '/coins.png',
    inStock: false,
    isBestSeller: false
  },

  // CASH CATEGORY
  {
    id: 'cash-1k',
    name: '1.000 Cash',
    category: 'cash',
    categoryLabel: 'Cash',
    description: 'Cash 8 Ball Pool sebanyak 1.000 untuk membeli cue premium, membuka kotak legendaris, atau berpartisipasi dalam event.',
    benefits: [
      'Top up via login akun terpercaya',
      'Proses cepat maksimal 30 menit',
      'Bisa digunakan untuk membeli Legendary Boxes',
      '100% legal dan bersumber dari Google Play'
    ],
    price: 35000,
    originalPrice: 45000,
    image: '/cash.png',
    inStock: true,
    isBestSeller: false
  },
  {
    id: 'cash-5k',
    name: '5.000 Cash',
    category: 'cash',
    categoryLabel: 'Cash',
    description: 'Cash 8 Ball Pool sebanyak 5.000. Paket terbaik untuk melengkapi koleksi Legendary Cue Anda secara instant.',
    benefits: [
      'Top up legal aman tanpa resiko refund',
      'Buka hingga 50+ Legendary Boxes',
      'Proses cepat dan dipandu oleh admin',
      'Bonus koin tambahan secara gratis'
    ],
    price: 150000,
    originalPrice: 200000,
    image: '/cash.png',
    inStock: true,
    isBestSeller: true
  },
  {
    id: 'cash-10k',
    name: '10.000 Cash',
    category: 'cash',
    categoryLabel: 'Cash',
    description: 'Paket Sultan Cash 8 Ball Pool sebesar 10.000. Miliki semua item premium di dalam game dan maksimalkan level VIP Anda.',
    benefits: [
      'Harga terbaik per unit cash',
      'Top up prioritas VIP super kilat',
      'Buka ratusan kotak legendaris secara bebas',
      'Dukungan penuh dari admin sampai proses tuntas'
    ],
    price: 280000,
    originalPrice: 380000,
    image: '/cash.png',
    inStock: true,
    isBestSeller: false
  },

  // LEGENDARY CUES CATEGORY
  {
    id: 'cue-archangel',
    name: 'Archangel Legendary Cue',
    category: 'cues',
    categoryLabel: 'Legendary Cue',
    description: 'Cue Legendaris Archangel. Memiliki stat maksimal dan efek animasi cahaya surgawi yang menakjubkan.',
    benefits: [
      'Stats maksimal: Force, Aim, Spin, dan Time',
      'Bonus EXP hingga 100% per game',
      'Gratis biaya isi ulang (Recharge) selamanya',
      'Meningkatkan reputasi di mata lawan main'
    ],
    price: 120000,
    originalPrice: 180000,
    image: '/cue-archangel.png',
    inStock: true,
    isBestSeller: true
  },
  {
    id: 'cue-firestorm',
    name: 'Firestorm Legendary Cue',
    category: 'cues',
    categoryLabel: 'Legendary Cue',
    description: 'Cue Legendaris Firestorm. Membakar meja billiard dengan efek api kosmis dan kekuatan pukulan luar biasa.',
    benefits: [
      'Kekuatan pukulan (Force) tingkat tinggi',
      'Dapatkan cashback koin hingga 40% jika kalah',
      'Gratis biaya isi ulang selamanya',
      'Visual api bergerak yang sangat dinamis'
    ],
    price: 95000,
    originalPrice: 140000,
    image: '/cue-firestorm.png',
    inStock: true,
    isBestSeller: false
  },
  {
    id: 'cue-valkyrie',
    name: 'Valkyrie Legendary Cue',
    category: 'cues',
    categoryLabel: 'Legendary Cue',
    description: 'Cue Legendaris Valkyrie dengan desain nordic bersayap yang elegan dan akurasi aim presisi tinggi.',
    benefits: [
      'Akurasi Aim super panjang untuk pantulan sempurna',
      'Mendapatkan bonus koin tambahan setiap kemenangan',
      'Gratis biaya isi ulang selamanya',
      'Desain premium bergaya viking futuristik'
    ],
    price: 110000,
    originalPrice: 160000,
    image: '/cue-archangel.png', // Fallback to archangel or render custom css
    inStock: true,
    isBestSeller: false
  },

  // CUE PIECES CATEGORY
  {
    id: 'cue-pieces-archangel',
    name: 'Archangel Pieces Bundle x10',
    category: 'pieces',
    categoryLabel: 'Cue Pieces',
    description: 'Kumpulan 10 kepingan (Pieces) untuk meng-unlock atau melakukan upgrade level pada Archangel Cue.',
    benefits: [
      'Mempercepat proses unlock Archangel Cue',
      'Meningkatkan level dan statistik cue legendaris Anda',
      'Proses suntik pieces aman via admin profesional',
      'Harga terjangkau dibanding membuka kotak acak'
    ],
    price: 40000,
    originalPrice: 60000,
    image: '/cue-pieces.png',
    inStock: true,
    isBestSeller: false
  },
  {
    id: 'cue-pieces-firestorm',
    name: 'Firestorm Pieces Bundle x10',
    category: 'pieces',
    categoryLabel: 'Cue Pieces',
    description: 'Kumpulan 10 kepingan (Pieces) untuk meng-unlock atau menaikkan level Firestorm Cue Anda.',
    benefits: [
      'Proses instant langsung masuk ke tab senjata',
      'Meningkatkan persentase cashback koin saat kalah',
      'Sangat direkomendasikan untuk menaikkan level cue legendaris',
      'Aman dan bergaransi resmi toko'
    ],
    price: 30000,
    originalPrice: 45000,
    image: '/cue-pieces.png',
    inStock: true,
    isBestSeller: false
  },

  // EVENT ITEMS CATEGORY
  {
    id: 'event-cyber-ring',
    name: 'Cyber Ring Event Pack',
    category: 'events',
    categoryLabel: 'Event Items',
    description: 'Miliki cincin event terbatas Cyber Arena tanpa perlu repot bermain berhari-hari. Admin kami yang akan menyelesaikannya.',
    benefits: [
      'Jasa joki cincin event terpercaya',
      'Dikerjakan oleh pemain profesional bersertifikat',
      'Akun aman 100%, dikerjakan dengan sangat rapi',
      'Cincin langsung terpajang gagah di profil Anda'
    ],
    price: 45000,
    originalPrice: 65000,
    image: '/event-items.png',
    inStock: true,
    isBestSeller: false
  },
  {
    id: 'event-golden-avatar',
    name: 'Golden Glow Avatar Frame',
    category: 'events',
    categoryLabel: 'Event Items',
    description: 'Frame Avatar emas bercahaya premium untuk menghiasi foto profil 8 Ball Pool Anda di lobi.',
    benefits: [
      'Menampilkan status sosial tinggi di dalam permainan',
      'Bingkai bercahaya emas eksklusif',
      'Proses aktifasi cepat tanpa repot',
      'Berlaku permanen di akun Anda'
    ],
    price: 25000,
    originalPrice: 35000,
    image: '/event-items.png',
    inStock: true,
    isBestSeller: false
  },

  // SPECIAL BUNDLES CATEGORY
  {
    id: 'bundle-starter',
    name: 'Champion Starter Pack',
    category: 'bundles',
    categoryLabel: 'Special Bundles',
    description: 'Paket Pemula Juara berisi kombinasi Koin, Cash, dan kotak item legendaris acak untuk langsung melesat maju.',
    benefits: [
      'Berisi: 100 Juta Koin + 500 Cash + 3x Legendary Boxes',
      'Sangat direkomendasikan untuk akun baru',
      'Hemat lebih dari 40% dibanding membeli terpisah',
      'Layanan panduan eksklusif dari admin toko'
    ],
    price: 60000,
    originalPrice: 100000,
    image: '/special-bundle.png',
    inStock: true,
    isBestSeller: true
  },
  {
    id: 'bundle-ultimate',
    name: 'Ultimate Pro Bundle',
    category: 'bundles',
    categoryLabel: 'Special Bundles',
    description: 'Paket terlengkap untuk pemain profesional billiard. Berisi Koin melimpah, Cash melimpah, dan jaminan Legendary Cue.',
    benefits: [
      'Berisi: 1 Miliar Koin + 5.000 Cash + 1x Random Legendary Cue Unlock',
      'Hemat luar biasa dengan harga grosir',
      'Proses prioritas VIP super cepat',
      'Mendapatkan status prioritas di chat WhatsApp admin'
    ],
    price: 300000,
    originalPrice: 450000,
    image: '/special-bundle.png',
    inStock: true,
    isBestSeller: true
  }
];
