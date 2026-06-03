'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, Check, ArrowLeft, Plus, Minus } from 'lucide-react';
import FadeIn from '@/app/components/FadeIn';
import { useCart } from '@/app/context/cart-context';

interface CatalogClientProps {
  initialProducts: any[];
  initialCategories: any[];
}

export default function CatalogClient({ initialProducts, initialCategories }: CatalogClientProps) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Pre-filter category if present in query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Categories metadata
  const filterCategories = [
    { id: 'all', name: 'Semua Produk' },
    ...initialCategories.map((cat: any) => ({
      id: cat.slug,
      name: cat.name
    }))
  ];

  const getSafeImageSrc = (src?: string | null) => {
    const value = (src ?? '').trim();
    if (!value) return '/hero-cues.png';
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `/${value.replace(/^\.?\//, '')}`;
  };

  // Filter products based on search and category
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (() => {
      const pCatLower = product.category.toLowerCase();
      const selCatLower = selectedCategory.toLowerCase();
      return pCatLower === selCatLower || 
             pCatLower.replace(/[^a-z0-9]/g, '-') === selCatLower ||
             pCatLower.includes(selCatLower);
    })();
    return matchesSearch && matchesCategory;
  });

  const handleQuantityChange = (productId: string, val: number) => {
    if (val < 1) return;
    setQuantities(prev => ({
      ...prev,
      [productId]: val
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    
    // Trigger visual toast feedback
    setSuccessToast(`${quantity}x ${product.name} telah ditambahkan!`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);

    // Reset quantities state for this product
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      router.push('/catalog');
    } else {
      router.push(`/catalog?category=${categoryId}`);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pt-32 relative z-10">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border border-dark-purple bg-[#13111b] shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-purple/10 text-neon-purple">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-semibold text-white">{successToast}</p>
        </div>
      )}

      {/* Breadcrumbs & Header */}
      <FadeIn direction="up">
        <div className="flex flex-col gap-4 mb-8">
          <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold text-gray-text hover:text-white transition-colors duration-200 w-max">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Home
          </Link>
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 uppercase">Katalog Produk</h1>
            <p className="text-gray-text text-xs md:text-sm max-w-xl leading-relaxed">
              Pilih dan sesuaikan item 8 Ball Pool pilihan Anda. Masukkan jumlah pesanan dan lanjutkan langsung ke keranjang belanja.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* FILTER & SEARCH BAR */}
      <FadeIn direction="up" delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-5 mb-10 items-stretch">
          
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-text pointer-events-none" />
            <input
              type="text"
              placeholder="Cari item koin, cash, cues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#13111b] border border-dark-purple rounded-xl text-xs md:text-sm text-white placeholder-gray-text focus:outline-none focus:border-neon-purple transition-all duration-200"
            />
          </div>

          {/* Categories Filter list */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar lg:max-w-2xl">
            <div className="flex gap-2">
              {filterCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-4.5 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-neon-purple border-neon-purple text-white' 
                        : 'bg-[#13111b] border-dark-purple text-gray-text hover:text-white hover:border-neutral-700/60'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </FadeIn>

      {/* PRODUCT GRID SECTION */}
      {filteredProducts.length > 0 ? (
        <FadeIn direction="up" delay={0.2}>
          {/* Grouped all filtered cards into one FadeIn block to avoid Intersection Observer layout thrashing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const qty = quantities[product.id] || 1;
              return (
                <div key={product.id} className="premium-card premium-card-hover rounded-xl overflow-hidden p-4 flex flex-col gap-4 group h-full">
                  
                  {/* Product Image Frame */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#09080e] border border-dark-purple/35 flex items-center justify-center p-2">
                    <Image
                      src={getSafeImageSrc(product.imageUrl)}
                      alt={product.name}
                      width={160}
                      height={90}
                      style={{ objectFit: 'contain' }}
                      className="scale-95 group-hover:scale-100 transition-transform duration-500"
                    />
                    
                    {/* Category label badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-[#13111b]/90 border border-dark-purple text-white">
                      {product.category}
                    </span>

                    {/* Stock banner check */}
                    {product.stockStatus === 'Out of Stock' && (
                      <div className="absolute inset-0 bg-[#09080e]/90 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                          Habis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Text */}
                  <div className="flex flex-col gap-1.5 flex-1 text-left">
                    <Link 
                      href={`/product/${product.id}`} 
                      className="text-sm font-bold text-white hover:text-neon-purple transition-colors duration-200 line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-gray-text text-[11px] leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and Stock Status block */}
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-white">
                        Rp{product.price.toLocaleString('id-ID')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-text line-through font-medium">
                          Rp{product.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${product.stockStatus !== 'Out of Stock' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`}></div>
                      <span className="text-[9px] text-gray-text font-medium uppercase tracking-wider">
                        {product.stockStatus !== 'Out of Stock' ? 'Tersedia' : 'Stok Habis'}
                      </span>
                    </div>
                  </div>

                  {/* QUANTITY MODIFIER & ADD BUTTON ROW */}
                  <div className="flex items-center gap-2 pt-3.5 border-t border-dark-purple/35 mt-auto">
                    <div className="flex items-center rounded-lg bg-[#09080e] border border-dark-purple p-1">
                      <button
                        onClick={() => handleQuantityChange(product.id, qty - 1)}
                        className="p-1 text-gray-text hover:text-white rounded focus:outline-none cursor-pointer disabled:opacity-50"
                        disabled={product.stockStatus === 'Out of Stock'}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-white">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.id, qty + 1)}
                        className="p-1 text-gray-text hover:text-white rounded focus:outline-none cursor-pointer disabled:opacity-50"
                        disabled={product.stockStatus === 'Out of Stock'}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockStatus === 'Out of Stock'}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-neon-purple hover:bg-violet text-[11px] font-bold text-white transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Beli
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </FadeIn>
      ) : (
        /* Empty Search/Filter Results */
        <FadeIn direction="up">
          <div className="premium-card rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple">
              <Search className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-white font-bold text-sm">Produk Tidak Ditemukan</h3>
              <p className="text-gray-text text-xs max-w-xs leading-relaxed">
                Kami tidak dapat menemukan produk yang sesuai dengan pencarian Anda. Coba kata kunci lainnya.
              </p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); handleCategorySelect('all'); }}
              className="mt-2 px-5 py-2.5 rounded-lg bg-[#13111b] border border-dark-purple text-xs font-bold text-white hover:border-neutral-700/60 transition-colors duration-200 cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        </FadeIn>
      )}

    </div>
  );
}
