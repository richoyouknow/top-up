import React from 'react';
import HomeClient from './HomeClient';
import { getProducts } from '@/app/actions/product';
import { getSettings } from '@/app/actions/setting';
import { getCategories } from '@/app/actions/category';

export default async function Page() {
  // Fetch settings, products, and categories concurrently on the server side
  const [productsData, settingsData, categoriesData] = await Promise.all([
    getProducts(),
    getSettings(),
    getCategories(),
  ]);

  return (
    <HomeClient 
      initialProducts={productsData as any[]} 
      initialSettings={settingsData as Record<string, string>} 
      initialCategories={categoriesData as any[]}
    />
  );
}
