'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Zap, 
  Coins, 
  Layers, 
  Gift, 
  HelpCircle, 
  ChevronDown, 
  Check, 
  ShoppingBag,
  Sparkles,
  MessageSquare,
  Award,
  MousePointerClick,
  ClipboardList,
  Send,
  Clock,
  ArrowRight,
  Package
} from 'lucide-react';
import FadeIn from '@/app/components/FadeIn';
import { useCart } from '@/app/context/cart-context';
import { motion, type Transition } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardsVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 } as Transition,
  },
};

type StoreProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number | null;
  featured: boolean;
};

type HowToOrderItem = {
  title: string;
  desc: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type TestimonialItem = {
  name: string;
  date: string;
  item: string;
  review: string;
  avatarText: string;
};

const DEFAULT_HOW_TO_ORDER: HowToOrderItem[] = [
  { title: 'Pilih Produk', desc: 'Buka katalog lalu pilih item 8 Ball Pool yang ingin Anda beli.' },
  { title: 'Masuk Keranjang', desc: 'Klik tombol beli pada produk agar item masuk ke keranjang belanja.' },
  { title: 'Lanjut Checkout', desc: 'Dari halaman keranjang, klik lanjutkan ke checkout untuk proses pembayaran.' },
  { title: 'Isi Data Pemesan', desc: 'Masukkan nama, nomor WhatsApp aktif, UID game, dan catatan bila perlu.' },
  { title: 'Pilih Pembayaran', desc: 'Pilih QRIS atau transfer bank, lakukan pembayaran, lalu upload bukti transfer.' },
  { title: 'Kirim Konfirmasi', desc: 'Klik kirim konfirmasi, lalu Anda otomatis diarahkan ke WhatsApp admin untuk verifikasi.' },
];

const DEFAULT_FAQS: FaqItem[] = [
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

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
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

function parseJsonSafely<T>(input: string | undefined, fallback: T): T {
  if (!input) return fallback;
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

function normalizeHowToOrder(input: unknown[]): HowToOrderItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((entry) => {
      if (typeof entry === 'string') {
        return { title: 'Langkah', desc: entry };
      }
      const obj = entry as Partial<HowToOrderItem>;
      if (typeof obj.title === 'string' && typeof obj.desc === 'string') {
        return { title: obj.title, desc: obj.desc };
      }
      return null;
    })
    .filter((entry): entry is HowToOrderItem => Boolean(entry));
}

function normalizeFaqs(input: unknown[]): FaqItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((entry) => {
      const obj = entry as Partial<FaqItem> & { q?: string; a?: string };
      const question = typeof obj.question === 'string' ? obj.question : typeof obj.q === 'string' ? obj.q : '';
      const answer = typeof obj.answer === 'string' ? obj.answer : typeof obj.a === 'string' ? obj.a : '';
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((entry): entry is FaqItem => Boolean(entry));
}

function normalizeTestimonials(input: unknown[]): TestimonialItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((entry) => {
      const obj = entry as Partial<TestimonialItem> & { content?: string };
      const review = typeof obj.review === 'string' ? obj.review : typeof obj.content === 'string' ? obj.content : '';
      if (!obj.name || !review) return null;
      return {
        name: obj.name,
        review,
        date: obj.date || 'Baru saja',
        item: obj.item || 'Pembelian item',
        avatarText: obj.avatarText || obj.name.slice(0, 2).toUpperCase(),
      };
    })
    .filter((entry): entry is TestimonialItem => Boolean(entry));
}

interface HomeClientProps {
  initialProducts: StoreProduct[];
  initialSettings: Record<string, string>;
  initialCategories: any[];
}

export default function HomeClient({ initialProducts, initialSettings, initialCategories }: HomeClientProps) {
  const { addToCart } = useCart();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [swapped, setSwapped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Evaluate isMobile ONCE on mount to avoid layout calculation overhead on continuous resize events
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
  }, []);

  const bestSellers = initialProducts.filter(product => product.featured).slice(0, 4);

  const heroBadgeText = initialSettings.hero_badgeText || initialSettings.heroBadgeText || 'Toko Koin & Cues Terpercaya No. 1';
  const heroTitle = initialSettings.hero_title || initialSettings.heroTitle || 'Jual Item 8 Ball Pool Terpercaya';
  const heroSubtitle =
    initialSettings.hero_subtitle ||
    initialSettings.heroSubtitle ||
    'Dapatkan Coins, Cash, Legendary Cue, Cue Pieces, dan item premium 8 Ball Pool dengan harga terbaik and proses secepat kilat.';
  const heroButtonText = initialSettings.hero_buttonText || initialSettings.heroButtonText || 'Lihat Produk';

  const getSafeImageSrc = (src?: string | null, fallback = '/hero-cues.png') => {
    const value = (src ?? '').trim();
    if (!value) return fallback;
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `/${value.replace(/^\.?\//, '')}`;
  };

  const howToOrderSteps = (() => {
    const parsed = parseJsonSafely<unknown[]>(initialSettings.how_to_order, DEFAULT_HOW_TO_ORDER);
    const normalized = normalizeHowToOrder(parsed);
    return normalized.length > 0 ? normalized : DEFAULT_HOW_TO_ORDER;
  })();

  const faqItems = (() => {
    const parsed = parseJsonSafely<unknown[]>(initialSettings.faqs, DEFAULT_FAQS);
    const normalized = normalizeFaqs(parsed);
    return normalized.length > 0 ? normalized : DEFAULT_FAQS;
  })();

  const testimonialItems = (() => {
    const parsed = parseJsonSafely<unknown[]>(initialSettings.testimonials, DEFAULT_TESTIMONIALS);
    const normalized = normalizeTestimonials(parsed);
    return normalized.length > 0 ? normalized : DEFAULT_TESTIMONIALS;
  })();

  const getCategoryIcon = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('coin')) return Coins;
    if (s.includes('cash')) return Sparkles;
    if (s.includes('cue')) return Award;
    if (s.includes('piece')) return Layers;
    if (s.includes('event')) return ShieldCheck;
    if (s.includes('bundle')) return Gift;
    return Package;
  };

  const categories = initialCategories.map((cat) => {
    const catNameLower = cat.name.toLowerCase();
    const catSlugLower = cat.slug.toLowerCase();
    
    const productCount = initialProducts.filter(p => {
      const pCatLower = p.category.toLowerCase();
      return pCatLower === catNameLower || 
             pCatLower === catSlugLower || 
             pCatLower.replace(/[^a-z0-9]/g, '-') === catSlugLower;
    }).length;

    return {
      id: cat.slug,
      name: cat.name,
      icon: getCategoryIcon(cat.slug),
      count: `${productCount} Item${productCount !== 1 ? 's' : ''}`
    };
  });

  const handleAddToCart = (product: StoreProduct) => {
    addToCart(product, 1);
    setSuccessToast(`${product.name} telah ditambahkan ke keranjang!`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const toggleSwap = () => setSwapped((prev) => !prev);

  return (
    <div className="flex flex-col flex-1 w-full relative">

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border border-dark-purple bg-[#13111b] shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-purple/10 text-neon-purple">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-semibold text-white">{successToast}</p>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-[#09080e] text-white pt-24 pb-20 md:pt-32 md:pb-32 border-b border-dark-purple/30">
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(124, 58, 237, 0.15) 1px, transparent 1px), linear-gradient(to right, rgba(124, 58, 237, 0.15) 1px, transparent 1px)', backgroundSize: '3rem 3rem' }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#09080e] via-transparent to-[#09080e]" />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-glow/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto flex min-h-[60vh] items-center justify-between px-4 sm:px-6 lg:px-8 flex-col lg:flex-row gap-16 lg:gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left: Text Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/2">
            
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#13111b]/80 backdrop-blur-sm border border-neon-purple/40 w-max mb-6 shadow-[0_0_15px_rgba(157,78,221,0.2)]">
              <Sparkles className="w-4 h-4 text-cyan-glow" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                {heroBadgeText}
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]"
              variants={itemVariants}
            >
              {heroTitle}
            </motion.h1>
            
            <motion.p
              className="mt-6 max-w-xl text-sm md:text-base text-gray-text leading-relaxed"
              variants={itemVariants}
            >
              {heroSubtitle}
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/catalog"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-neon-purple hover:bg-violet text-sm font-bold text-white transition-all duration-300 shadow-[0_0_20px_rgba(157,78,221,0.3)] hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] hover:-translate-y-1 active:scale-95"
              >
                {heroButtonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={initialSettings.whatsapp ? `https://wa.me/${initialSettings.whatsapp}` : "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#13111b]/80 backdrop-blur-md border border-dark-purple hover:border-neon-purple/50 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-neon-purple" />
                Hubungi Admin
              </a>
            </motion.div>
          </div>

          {/* Right: Floating Cards */}
          <motion.div
            className="relative lg:w-1/2 h-full min-h-[400px] md:min-h-[500px] w-full flex items-center justify-center mt-10 lg:mt-0"
            variants={cardsVariants}
          >
            {/* Card 2 (Previously Back) */}
            <motion.div
              onClick={toggleSwap}
              animate={{
                zIndex: swapped ? 30 : 10,
                x: swapped ? (isMobile ? -20 : -40) : (isMobile ? 40 : 80),
                rotate: swapped ? 6 : -8,
                scale: swapped ? 1.05 : 0.85,
              }}
              whileHover={isMobile ? undefined : { y: -15, transition: { duration: 0.3, ease: "easeOut" } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute h-[280px] md:h-[380px] w-[280px] md:w-[380px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-dark-purple/70 bg-gradient-to-b from-[#1a1725] to-[#09080e] overflow-hidden group flex items-center justify-center cursor-pointer select-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#09080e] via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              <Image
                src={getSafeImageSrc(initialSettings.hero_image2_url, '/cues/firestorm.png')}
                alt="Hero Card 2"
                fill
                sizes="(max-width: 768px) 280px, 380px"
                style={{ objectFit: 'cover' }}
                className="z-0 transition-transform duration-500 rounded-3xl"
              />
              <div className="absolute bottom-5 left-5 z-20 flex flex-col pointer-events-none">
                <span className="text-sm font-black tracking-widest text-white uppercase drop-shadow-lg">
                  {initialSettings.hero_image2_label || 'Firestorm'}
                </span>
              </div>
              {swapped && (
                <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-cyan-glow animate-pulse shadow-[0_0_12px_#00E5FF] pointer-events-none"></div>
              )}
            </motion.div>
            
            {/* Card 1 (Previously Front) */}
            <motion.div
              onClick={toggleSwap}
              animate={{
                zIndex: swapped ? 10 : 30,
                x: swapped ? (isMobile ? 40 : 80) : (isMobile ? -20 : -40),
                rotate: swapped ? -8 : 6,
                scale: swapped ? 0.85 : 1.05,
              }}
              whileHover={isMobile ? undefined : { y: -15, transition: { duration: 0.3, ease: "easeOut" } }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute h-[280px] md:h-[380px] w-[280px] md:w-[380px] rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-neon-purple/40 bg-gradient-to-b from-[#1f1935] to-[#0d0a14] overflow-hidden group flex items-center justify-center cursor-pointer select-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/30 via-[#0d0a14]/60 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              <Image
                src={getSafeImageSrc(initialSettings.hero_image1_url, '/cues/archangel.png')}
                alt="Hero Card 1"
                fill
                priority
                sizes="(max-width: 768px) 280px, 380px"
                style={{ objectFit: 'cover' }}
                className="z-0 transition-transform duration-500 rounded-3xl drop-shadow-[0_0_15px_rgba(157,78,221,0.4)]"
              />
              <div className="absolute bottom-5 left-5 z-20 flex flex-col pointer-events-none">
                <span className="text-[9px] font-bold text-cyan-glow uppercase tracking-wider mb-0.5 drop-shadow-md">
                  {initialSettings.hero_image1_sublabel || 'Mythic Tier'}
                </span>
                <span className="text-sm font-black tracking-widest text-white uppercase drop-shadow-lg">
                  {initialSettings.hero_image1_label || 'Archangel'}
                </span>
              </div>
              {!swapped && (
                <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-cyan-glow animate-pulse shadow-[0_0_12px_#00E5FF] pointer-events-none"></div>
              )}
            </motion.div>
          </motion.div>

        </motion.div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-dark-purple/30">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">Kategori Produk</h2>
            <p className="text-gray-text text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              Jelajahi berbagai item premium 8 Ball Pool yang kami sediakan untuk menaikkan reputasi dan persentase menang Anda.
            </p>
          </div>
          
          {/* Grouped all category cards into a single FadeIn wrapper to save CPU cycles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link 
                  key={cat.id}
                  href={`/catalog?category=${cat.id}`}
                  className="premium-card premium-card-hover rounded-xl p-5 flex flex-col items-center text-center gap-3.5 group cursor-pointer h-full"
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#09080e] border border-dark-purple group-hover:border-neon-purple transition-all duration-300">
                    <IconComponent className="w-5 h-5 text-neon-purple group-hover:text-cyan-glow transition-colors duration-300" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white group-hover:text-neon-purple transition-colors duration-200">
                      {cat.name}
                    </span>
                    <span className="text-[9px] text-gray-text font-medium uppercase tracking-wider">
                      {cat.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </section>

      {/* BEST SELLERS SECTION */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-dark-purple/30">
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <div className="text-[9px] font-bold text-neon-purple uppercase tracking-widest mb-1">Terlaris Saat Ini</div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Produk Paling Populer</h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-bold text-neon-purple hover:text-white transition-colors duration-200"
            >
              Lihat Semua Produk &rarr;
            </Link>
          </div>

          {/* Grouped all bestseller products under a single FadeIn component to reduce scroll tracking overhead */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="premium-card premium-card-hover rounded-xl overflow-hidden p-4 flex flex-col gap-4 group h-full">
                {/* Product Thumbnail */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-[#09080e] border border-dark-purple/35 flex items-center justify-center p-2">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={160}
                    height={90}
                    style={{ objectFit: 'contain' }}
                    className="scale-95 group-hover:scale-100 transition-transform duration-500"
                  />
                  
                  {/* Category tag */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-[#13111b]/90 border border-dark-purple text-white">
                    {product.category}
                  </span>

                  {/* Best seller badge */}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-neon-purple text-white">
                    Bestseller
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-1.5 flex-1 text-left">
                  <Link href={`/product/${product.id}`} className="text-sm font-bold text-white hover:text-neon-purple transition-colors duration-200 line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="text-gray-text text-[11px] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Price and Action Row */}
                <div className="flex items-center justify-between pt-3.5 border-t border-dark-purple/35 mt-auto">
                  <div className="flex flex-col text-left">
                    {product.originalPrice && (
                      <span className="text-[9px] text-gray-text line-through mb-0.5">
                        Rp{product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="text-sm font-extrabold text-white">
                      Rp{product.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-neon-purple hover:bg-violet text-[11px] font-bold text-white transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Beli
                  </button>
                </div>

              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-dark-purple/30">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">Mengapa Memilih Kami?</h2>
            <p className="text-gray-text text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              Kami berkomitmen memberikan layanan top up dan penjualan koin billiard terbaik demi kenyamanan permainan Anda.
            </p>
          </div>

          {/* Grouped items to replace 5 independent scroll observers with 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <div className="premium-card rounded-xl p-5 flex flex-col gap-3 text-left h-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/15">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-white font-bold text-xs">Fast Response</h3>
              <p className="text-gray-text text-[11px] leading-relaxed">
                Admin sigap membalas setiap pesan dan pertanyaan pesanan Anda secepat mungkin.
              </p>
            </div>

            <div className="premium-card rounded-xl p-5 flex flex-col gap-3 text-left h-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/15">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-white font-bold text-xs">Trusted Seller</h3>
              <p className="text-gray-text text-[11px] leading-relaxed">
                Telah dipercaya melayani ratusan transaksi billiard gamers dari seluruh Indonesia.
              </p>
            </div>

            <div className="premium-card rounded-xl p-5 flex flex-col gap-3 text-left h-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/15">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-white font-bold text-xs">Secure Transaction</h3>
              <p className="text-gray-text text-[11px] leading-relaxed">
                Metode transfer legal dan teraman menjamin akun Anda 100% aman bebas resiko banned.
              </p>
            </div>

            <div className="premium-card rounded-xl p-5 flex flex-col gap-3 text-left h-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/15">
                <Coins className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-white font-bold text-xs">Competitive Pricing</h3>
              <p className="text-gray-text text-[11px] leading-relaxed">
                Harga termurah untuk koin billiard berkualitas tinggi yang ramah di kantong Anda.
              </p>
            </div>

            <div className="premium-card rounded-xl p-5 flex flex-col gap-3 text-left h-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/15">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-white font-bold text-xs">Friendly Support</h3>
              <p className="text-gray-text text-[11px] leading-relaxed">
                Layanan bantuan admin ramah siap memandu Anda dari mulai order hingga pesanan masuk.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* HOW TO ORDER SECTION */}
      <section id="cara-order" className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-dark-purple/30 scroll-mt-[72px]">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 mb-4">
              <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest">Tutorial Belanja</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">Cara Mudah Memesan</h2>
            <p className="text-gray-text text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Dapatkan item 8 Ball Pool impian Anda hanya dalam hitungan menit dengan mengikuti {howToOrderSteps.length} langkah praktis di bawah ini.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden xl:block absolute top-[44px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-transparent via-dark-purple to-transparent z-0"></div>

            {/* Grouped steps to cut 6 scroll trackers down to 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-8 xl:gap-4 relative z-10">
              {howToOrderSteps.map((stepObj, idx, arr) => {
                const stepNumber = String(idx + 1);
                const stepIcons = [MousePointerClick, ShoppingBag, ArrowRight, ClipboardList, ShieldCheck, Send];
                const IconComponent = stepIcons[idx % stepIcons.length];

                return (
                  <div key={`${stepObj.title}-${idx}`} className="flex flex-col items-center text-center gap-5 group relative">
                    <div className="relative">
                      {/* Step Number Circle */}
                      <div className="flex items-center justify-center w-22 h-22 rounded-2xl border-2 border-dark-purple bg-[#13111b] group-hover:border-neon-purple group-hover:shadow-[0_0_20px_rgba(157,78,221,0.2)] transition-all duration-500 relative z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <IconComponent className="w-9 h-9 text-gray-text group-hover:text-neon-purple transition-all duration-500 transform group-hover:scale-110" />

                        {/* Mobile Step Badge */}
                        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg bg-neon-purple flex items-center justify-center text-[11px] font-black text-white shadow-lg xl:hidden">
                          {stepNumber}
                        </div>
                      </div>

                      {/* Desktop Step Badge (Centered below) */}
                      <div className="hidden xl:flex absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#13111b] border-2 border-dark-purple items-center justify-center text-[12px] font-black text-white group-hover:border-neon-purple transition-colors duration-500 z-20">
                        {stepNumber}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-neon-purple transition-colors duration-300">
                        {stepObj.title}
                      </h3>
                      <p className="text-gray-text text-xs leading-relaxed max-w-[22ch] mx-auto group-hover:text-white/80 transition-colors duration-300">
                        {stepObj.desc}
                      </p>
                    </div>

                    {/* Desktop Arrows */}
                    {idx < arr.length - 1 && (
                      <div className="hidden xl:flex absolute top-[44px] -right-[15%] translate-x-1/2 items-center justify-center w-8 h-8 text-dark-purple group-hover:text-neon-purple transition-colors duration-500 z-0">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Pro Tip Box */}
        <FadeIn delay={0.2} direction="up">
          <div className="mt-16 max-w-3xl mx-auto p-6 rounded-2xl border border-neon-purple/20 bg-neon-purple/5 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neon-purple/20 text-neon-purple">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Pro Tip: Gunakan QRIS untuk Proses Tercepat</h4>
              <p className="text-[11px] text-gray-text leading-relaxed">
                Pembayaran via QRIS terverifikasi secara otomatis oleh sistem kami, sehingga admin dapat memproses koin atau cash Anda jauh lebih cepat dibandingkan transfer manual.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CUSTOMER TESTIMONIALS SECTION */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-dark-purple/30">
        <FadeIn direction="up">
          <div className="text-center mb-12">
            <div className="text-[9px] font-bold text-neon-purple uppercase tracking-widest mb-1">Ulasan Pelanggan</div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">Apa Kata Gamers?</h2>
            <p className="text-gray-text text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              Kepuasan pelanggan adalah motivasi terbesar bagi kami. Berikut ulasan nyata dari pembeli setia kami.
            </p>
          </div>

          {/* Grouped testimonial cards under 1 observer to avoid viewport paint calls on mobile scroll */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialItems.map((test, index) => (
              <div key={index} className="premium-card rounded-xl p-5 flex flex-col gap-4 text-left h-full">
                <p className="text-gray-text text-[11px] leading-relaxed italic flex-1">
                  &ldquo;{test.review}&rdquo;
                </p>

                <div className="h-px bg-dark-purple/35"></div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neon-purple/10 border border-dark-purple text-[11px] font-extrabold text-white">
                    {test.avatarText}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white">{test.name}</span>
                    <span className="text-[9px] text-gray-text uppercase tracking-wider font-semibold">
                      Beli: {test.item} &bull; {test.date}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-16 border-t border-dark-purple/30 scroll-mt-[72px]">
        <FadeIn direction="up" fullWidth>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-neon-purple" />
              Frequently Asked Questions
            </h2>
            <p className="text-gray-text text-xs md:text-sm leading-relaxed">
              Temukan jawaban cepat untuk beberapa pertanyaan umum mengenai toko dan pemesanan kami.
            </p>
          </div>

          {/* Grouped accordions to replace 4 independent scroll observers with 1 */}
          <div className="flex flex-col gap-3.5">
            {faqItems.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="premium-card rounded-xl overflow-hidden border-dark-purple/35 w-full">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full p-4.5 text-left text-xs md:text-sm font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-neon-purple transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-4.5 pb-4.5 pt-0.5 border-t border-t-dark-purple/20 text-[11px] text-gray-text leading-relaxed bg-[#09080e]/40 animate-in fade-in duration-200 text-left">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
