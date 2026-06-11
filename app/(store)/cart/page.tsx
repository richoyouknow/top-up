'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, ShieldCheck, ArrowRight } from 'lucide-react';
import FadeIn from '@/app/components/FadeIn';
import { useCart } from '@/app/context/cart-context';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  const getSafeImageSrc = (src?: string | null) => {
    const value = (src ?? '').trim();
    if (!value) return '/hero-cues.png';
    
    // Convert old full URLs from championshop.id to relative paths for dev/prod compatibility
    if (value.includes('championshop.id/uploads/')) {
      return '/' + value.split('championshop.id/uploads/')[1];
    }
    
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;

    return `/${value.replace(/^\.?\//, '')}`;
  };

  return (
    <div className="flex flex-col flex-1 w-full relative">

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pt-32 relative z-10 overflow-hidden">
        
        {/* Breadcrumb back navigation */}
        <FadeIn direction="up">
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-text hover:text-white transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Katalog
          </Link>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-8 uppercase text-left">Keranjang Belanja</h1>
        </FadeIn>

        {cartItems.length > 0 ? (
          /* CART CONTENT: Split 2 Columns Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ITEMS TABLE LIST */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {cartItems.map((item, idx) => (
                <FadeIn key={item.product.id} delay={0.1 * idx} direction="up" fullWidth>
                  <div
                    className="premium-card rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full"
                  >
                    
                    {/* Left Side: Thumbnail & Title Info */}
                    <div className="flex items-center gap-4 text-left">
                      <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-[#09080e] border border-dark-purple/35 flex items-center justify-center p-1.5">
                        <Image
                          src={getSafeImageSrc((item.product as any).imageUrl || (item.product as any).image)}
                          alt={item.product.name}
                          width={60}
                          height={60}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-neon-purple uppercase tracking-wider">
                          {item.product.categoryLabel}
                        </span>
                        <Link 
                          href={`/product/${item.product.id}`}
                          className="text-sm font-bold text-white hover:text-neon-purple transition-colors duration-200"
                        >
                          {item.product.name}
                        </Link>
                        <span className="text-xs text-gray-text">
                          Rp{item.product.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Quantity selectors & Delete trigger & Subtotals */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3.5 sm:pt-0 border-t sm:border-t-0 border-dark-purple/35">
                      
                      {/* Quantity selectors */}
                      <div className="flex items-center rounded-lg bg-[#09080e] border border-dark-purple p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-gray-text hover:text-white rounded focus:outline-none cursor-pointer"
                          aria-label="Decrease Quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-gray-text hover:text-white rounded focus:outline-none cursor-pointer"
                          aria-label="Increase Quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Subtotal calculation */}
                      <div className="flex flex-col text-right w-24">
                        <span className="text-[10px] text-gray-text mb-0.5">Subtotal</span>
                        <span className="text-sm font-bold text-white">
                          Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Delete item button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 rounded-lg bg-[#09080e] text-gray-text hover:text-red-500 border border-dark-purple hover:border-red-500/30 transition-all duration-200 cursor-pointer"
                        aria-label="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                </FadeIn>
              ))}
            </div>

            {/* RIGHT COLUMN: CART SUMMARY CARD */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <FadeIn direction="left" delay={0.2} fullWidth>
                <div className="premium-card rounded-xl p-6 flex flex-col gap-6 text-left w-full">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wide pb-3.5 border-b border-dark-purple/35">
                    Ringkasan Belanja
                  </h2>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-gray-text">
                      <span>Total Item</span>
                      <span className="font-semibold text-white">{cartCount} Pcs</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-text">
                      <span>Estimasi Pengiriman</span>
                      <span className="font-semibold text-emerald-500 uppercase tracking-wider">Instant 5-15 Menit</span>
                    </div>
                  </div>

                  <div className="h-px bg-dark-purple/35"></div>

                  <div className="flex items-end justify-between">
                    <span className="text-xs text-gray-text">Total Harga</span>
                    <span className="text-lg font-extrabold text-white">
                      Rp{cartTotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Checkout Primary CTA Button */}
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-neon-purple hover:bg-violet text-xs md:text-sm font-bold text-white transition-all duration-200 cursor-pointer"
                  >
                    Lanjutkan Ke Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>

              {/* Secure Transaction Guarantee Box */}
              <FadeIn direction="left" delay={0.3} fullWidth>
                <div className="rounded-xl border border-dark-purple/35 bg-[#13111b] p-4 flex items-start gap-3 text-left w-full">
                  <ShieldCheck className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Transaksi Dijamin Aman</span>
                    <span className="text-[9px] text-gray-text leading-relaxed">
                      Data akun UID aman & garansi uang kembali apabila pesanan gagal diproses oleh admin.
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        ) : (
          /* EMPTY CART VIEW */
          <FadeIn direction="up">
            <div className="premium-card rounded-xl py-20 px-4 flex flex-col items-center justify-center text-center gap-5 max-w-2xl mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple">
                <ShoppingBag className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-base font-bold text-white uppercase tracking-wide">Keranjang Belanja Kosong</h2>
                <p className="text-gray-text text-xs max-w-sm mx-auto leading-relaxed">
                  Anda belum menambahkan item 8 Ball Pool apapun ke dalam keranjang. Mulai jelajahi katalog kami dan temukan item favorit Anda.
                </p>
              </div>

              <Link
                href="/catalog"
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-neon-purple hover:bg-violet text-xs font-bold text-white transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Belanja Sekarang
              </Link>
            </div>
          </FadeIn>
        )}

      </main>

    </div>
  );
}
