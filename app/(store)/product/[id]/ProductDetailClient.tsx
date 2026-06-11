'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  ShieldCheck, 
  Zap, 
  Info,
  MousePointerClick,
  ClipboardList
} from 'lucide-react';
import FadeIn from '@/app/components/FadeIn';
import { useCart } from '@/app/context/cart-context';
interface ClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const getSafeImageSrc = (src?: string | null) => {
    const value = (src ?? '').trim();
    if (!value) return '/hero-cues.png';
    
    // Convert old full URLs from championshop.id to relative paths for dev/prod compatibility
    if (value.includes('championshop.id/uploads/')) {
      return '/uploads/' + value.split('championshop.id/uploads/')[1];
    }
    
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;

    return `/${value.replace(/^\.?\//, '')}`;
  };

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    
    // Trigger toast notification
    setSuccessToast(`${quantity}x ${product.name} telah ditambahkan ke keranjang!`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

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

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pt-32 relative z-10 overflow-hidden">
        
        {/* Breadcrumb Navigation */}
        <FadeIn direction="up">
          <div className="flex items-center gap-2 mb-8 text-xs font-semibold text-gray-text text-left">
            <Link href="/" className="hover:text-white transition-colors duration-200">
              Home
            </Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-white transition-colors duration-200">
              Catalog
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-[20ch]">{product.name}</span>
          </div>
        </FadeIn>

        {/* PRODUCT DETAILS SPLIT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-20 items-start">
          
          {/* LEFT COLUMN: LARGE CARD IMAGE */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <FadeIn direction="left" delay={0.1}>
              <div className="relative aspect-square w-full rounded-2xl border border-dark-purple/45 bg-[#13111b] p-6 flex items-center justify-center shadow-2xl">
                <Image
                  src={getSafeImageSrc(product.imageUrl)}
                  alt={product.name}
                  width={300}
                  height={300}
                  style={{ objectFit: 'contain' }}
                  priority
                  className="relative z-10 scale-95 hover:scale-100 transition-transform duration-500 ease-out"
                />
              </div>
            </FadeIn>
            
            {/* Quick specifications helper box */}
            <FadeIn direction="left" delay={0.2}>
              <div className="rounded-xl border border-dark-purple/35 bg-[#13111b] p-4 flex items-start gap-3 text-left">
                <Info className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-text leading-relaxed">
                  Semua item diproses secara manual oleh admin kami yang berpengalaman untuk memastikan keamanan akun Anda sepenuhnya.
                </p>
              </div>
            </FadeIn>

            {/* Simplified Step Guide */}
            <FadeIn direction="left" delay={0.3}>
              <div className="rounded-xl border border-dark-purple/35 bg-[#13111b] p-5 flex flex-col gap-4 text-left">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-wider border-b border-dark-purple/30 pb-2">
                  Langkah Pemesanan
                </h3>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-neon-purple/20 text-neon-purple text-[9px] font-bold">1</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-white">Klik Beli & Checkout</span>
                      <span className="text-[10px] text-gray-text">Masukkan produk ke keranjang dan isi data UID game Anda.</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-neon-purple/20 text-neon-purple text-[9px] font-bold">2</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-white">Hubungi WhatsApp</span>
                      <span className="text-[10px] text-gray-text">Konfirmasi pesanan Anda secara otomatis melalui WhatsApp admin.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-neon-purple/20 text-neon-purple text-[9px] font-bold">3</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-white">Item Masuk Akun</span>
                      <span className="text-[10px] text-gray-text">Admin memproses dan mengirimkan item ke akun Anda (5-15 menit).</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT COLUMN: DETAILED INFO */}
          <div className="md:col-span-7 flex flex-col gap-6 text-left">
            <FadeIn direction="right" delay={0.1}>
              <div className="flex flex-col gap-6 text-left">
                {/* Category tag & stock status */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#13111b] border border-dark-purple text-white">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${product.stockStatus !== 'Out of Stock' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider">
                      {product.stockStatus !== 'Out of Stock' ? 'Tersedia' : 'Stok Habis'}
                    </span>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase leading-tight">
                  {product.name}
                </h1>

                {/* Pricing Section */}
                <div className="flex items-baseline gap-3 py-3 border-y border-dark-purple/35">
                  <span className="text-2xl font-extrabold text-white tracking-tight">
                    Rp{product.price.toLocaleString('id-ID')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-text line-through font-semibold">
                      Rp{product.originalPrice.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">Deskripsi Item</h3>
                  <p className="text-gray-text text-xs md:text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Key Benefits/Features */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider">Keuntungan Pembelian</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <li className="flex items-start gap-2.5 text-xs text-gray-text leading-relaxed">
                        <Check className="w-4 h-4 text-neon-purple shrink-0 mt-0.5" />
                        <span>Harga terbaik dan termurah</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-gray-text leading-relaxed">
                        <Check className="w-4 h-4 text-neon-purple shrink-0 mt-0.5" />
                        <span>Pengiriman sangat cepat</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-gray-text leading-relaxed">
                        <Check className="w-4 h-4 text-neon-purple shrink-0 mt-0.5" />
                        <span>100% aman dan legal</span>
                      </li>
                  </ul>
                </div>

                {/* QUANTITY CONTROL & ADD TO CART ACTION */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-dark-purple/35 mt-2">
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between rounded-lg bg-[#09080e] border border-dark-purple p-1.5 sm:w-36">
                    <button
                      onClick={handleDecrement}
                      disabled={product.stockStatus === 'Out of Stock'}
                      className="p-1.5 text-gray-text hover:text-white rounded focus:outline-none cursor-pointer disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={product.stockStatus === 'Out of Stock'}
                      className="p-1.5 text-gray-text hover:text-white rounded focus:outline-none cursor-pointer disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-1 items-center gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stockStatus === 'Out of Stock'}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-lg bg-[#13111b] border border-dark-purple hover:border-neutral-700/60 text-xs md:text-sm font-bold text-white transition-all duration-200 active:scale-97 cursor-pointer disabled:opacity-50"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Keranjang
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={product.stockStatus === 'Out of Stock'}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-lg bg-neon-purple hover:bg-violet text-xs md:text-sm font-bold text-white transition-all duration-200 active:scale-97 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4" />
                      Beli Langsung
                    </button>
                  </div>

                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        <section className="border-t border-dark-purple/35 pt-16 mb-10">
          <FadeIn direction="up">
            <div className="text-left mb-10">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white uppercase mb-2">Rekomendasi Item Lainnya</h2>
              <p className="text-gray-text text-xs md:text-sm">
                Mungkin Anda juga tertarik dengan item 8 Ball Pool berikut yang memiliki harga promo menarik.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p, idx) => (
              <FadeIn key={p.id} delay={0.1 * idx} direction="up" fullWidth>
                <div className="premium-card premium-card-hover rounded-xl overflow-hidden p-3 sm:p-4 flex flex-col gap-3.5 sm:gap-4 group h-full">
                  
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-[#09080e] border border-dark-purple/35">
                    <Image
                      src={getSafeImageSrc(p.imageUrl)}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-[#13111b]/90 border border-dark-purple text-white">
                      {p.category}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-1.5 flex-1 text-left">
                    <Link 
                      href={`/product/${p.id}`} 
                      className="text-sm font-bold text-white hover:text-neon-purple transition-colors duration-200 line-clamp-1"
                    >
                      {p.name}
                    </Link>
                    <p className="text-gray-text text-[11px] leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  {/* Pricing & quick button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3.5 border-t border-dark-purple/35 mt-auto">
                    <span className="text-sm font-extrabold text-white text-left">
                      Rp{p.price.toLocaleString('id-ID')}
                    </span>

                    <Link
                      href={`/product/${p.id}`}
                      className="w-full sm:w-auto text-center px-4 py-2 rounded bg-[#13111b] border border-dark-purple text-[10px] font-bold text-white hover:border-neutral-700/60 transition-all duration-200"
                    >
                      Detail
                    </Link>
                  </div>

                </div>
              </FadeIn>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
