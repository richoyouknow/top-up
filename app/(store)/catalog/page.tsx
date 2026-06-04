import { Suspense } from 'react';
import CatalogClient from './CatalogClient';
import { getProducts } from '@/app/actions/product';
import { getCategories } from '@/app/actions/category';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Katalog Koin & Cash 8 Ball Pool - ChampionStore.id",
  description: "Lihat katalog lengkap item premium 8 Ball Pool kami. Beli Koin Billiard, Cash, Legendary Cues, dan Cue Pieces harga termurah.",
};

export default async function Page() {
  // Fetch products and categories concurrently on the server side
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col flex-1 w-full relative">
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-32 text-gray-text gap-3">
          <div className="h-7 w-7 border-2 border-t-neon-purple border-dark-purple rounded-full animate-spin"></div>
          <span className="text-xs font-bold tracking-wider">Memuat Katalog...</span>
        </div>
      }>
        <CatalogClient initialProducts={products} initialCategories={categories} />
      </Suspense>
    </div>
  );
}
