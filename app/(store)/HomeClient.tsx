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
  Check, 
  ShoppingBag,
  Sparkles,
  MessageSquare,
  Award,
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
  hidden: { opacity: 0, x: 25 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } as Transition,
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

interface HomeClientProps {
  initialProducts: StoreProduct[];
  initialSettings: Record<string, string>;
  initialCategories: any[];
}

export default function HomeClient({ initialProducts, initialSettings, initialCategories }: HomeClientProps) {
  const { addToCart } = useCart();
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [swapped, setSwapped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [image1Loaded, setImage1Loaded] = useState(false);
  const [image2Loaded, setImage2Loaded] = useState(false);

  // Evaluate isMobile ONCE on mount to avoid layout calculation overhead on continuous resize events
  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));
  }, []);

  // Derived values from settings and products
  const bestSellers = Array.isArray(initialProducts) ? initialProducts.filter(p => p.featured).slice(0, 4) : [];

  const heroBadgeText = (initialSettings && (initialSettings.hero_badgeText || initialSettings.heroBadgeText)) || 'Toko Koin & Cues Terpercaya No. 1';
  const heroTitle = (initialSettings && (initialSettings.hero_title || initialSettings.heroTitle)) || 'Jual Item 8 Ball Pool Terpercaya';
  const heroSubtitle = (initialSettings && (initialSettings.hero_subtitle || initialSettings.heroSubtitle)) || 'Dapatkan Coins, Cash, Legendary Cue, Cue Pieces, dan item premium 8 Ball Pool dengan harga terbaik dan proses secepat kilat.';
  const heroButtonText = (initialSettings && (initialSettings.hero_buttonText || initialSettings.heroButtonText)) || 'Lihat Produk';

  const getSafeImageSrc = (src?: string | null, fallback = '/hero-cues.png') => {
    const value = (src ?? '').trim();
    if (!value) return fallback;
    
    // Convert old full URLs from championshop.id to relative paths for dev/prod compatibility
    if (value.includes('championshop.id/uploads/')) {
      return '/uploads/' + value.split('championshop.id/uploads/')[1];
    }
    
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `/${value.replace(/^\.?\//, '')}`;
  };

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
          <div className="no-mobile-animate flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/2">
            
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
            variants={
              isMobile
                ? {
                    hidden: { opacity: 1, x: 0 },
                    visible: { opacity: 1, x: 0 },
                  }
                : cardsVariants
            }
          >
            {/* Card 2 (Previously Back) */}
            <div
              onClick={toggleSwap}
              className={`absolute h-[280px] md:h-[380px] w-[280px] md:w-[380px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-dark-purple/70 bg-gradient-to-b from-[#1a1725] to-[#09080e] overflow-hidden group flex items-center justify-center cursor-pointer select-none transition-all duration-300 ease-out hover:-translate-y-2 md:hover:-translate-y-4 ${
                swapped
                  ? 'translate-x-[-20px] rotate-[6deg] scale-[1.05] z-30 md:translate-x-[-40px]'
                  : 'translate-x-[40px] rotate-[-8deg] scale-[0.85] z-10 md:translate-x-[80px]'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#09080e] via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              <Image
                src={getSafeImageSrc(initialSettings.hero_image2_url, '/cues/firestorm.png')}
                alt="Hero Card 2"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 280px, 380px"
                style={{ objectFit: 'cover' }}
                onLoad={() => setImage2Loaded(true)}
                className={`z-0 rounded-3xl transition-opacity duration-300 ${
                  image2Loaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <div className="absolute bottom-5 left-5 z-20 flex flex-col pointer-events-none">
                <span className="text-sm font-black tracking-widest text-white uppercase drop-shadow-lg">
                  {initialSettings.hero_image2_label || 'Firestorm'}
                </span>
              </div>
              {swapped && (
                <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-cyan-glow animate-pulse shadow-[0_0_12px_#00E5FF] pointer-events-none"></div>
              )}
            </div>
            
            {/* Card 1 (Previously Front) */}
            <div
              onClick={toggleSwap}
              className={`absolute h-[280px] md:h-[380px] w-[280px] md:w-[380px] rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-neon-purple/40 bg-gradient-to-b from-[#1f1935] to-[#0d0a14] overflow-hidden group flex items-center justify-center cursor-pointer select-none transition-all duration-300 ease-out hover:-translate-y-2 md:hover:-translate-y-4 ${
                swapped
                  ? 'translate-x-[40px] rotate-[-8deg] scale-[0.85] z-10 md:translate-x-[80px]'
                  : 'translate-x-[-20px] rotate-[6deg] scale-[1.05] z-30 md:translate-x-[-40px]'
              }`}
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
                onLoad={() => setImage1Loaded(true)}
                className={`z-0 rounded-3xl drop-shadow-[0_0_15px_rgba(157,78,221,0.4)] transition-opacity duration-300 ${
                  image1Loaded ? 'opacity-100' : 'opacity-0'
                }`}
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
            </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product) => (
              <div key={product.id} className="premium-card premium-card-hover rounded-xl overflow-hidden p-3 sm:p-4 flex flex-col gap-3.5 sm:gap-4 group h-full">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-[#09080e] border border-dark-purple/35">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-500"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3.5 border-t border-dark-purple/35 mt-auto">
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
                    className="flex items-center justify-center gap-1 py-2 px-3 sm:px-3.5 rounded-lg bg-neon-purple hover:bg-violet text-[11px] font-bold text-white transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto"
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
    </div>
  );
}
