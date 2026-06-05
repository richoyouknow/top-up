import React from 'react';
import dynamic from 'next/dynamic';
import HomeClient from './HomeClient';
import { getProducts } from '@/app/actions/product';
import { getSettings } from '@/app/actions/setting';
import { getCategories } from '@/app/actions/category';

// Dynamic imports for below-the-fold sections with Suspense
const LazyHowToOrder = dynamic(() => import('./LazyHowToOrder'), {
  loading: () => <div className="h-96 bg-[#09080e] animate-pulse" />,
  ssr: true,
});

const LazyFaq = dynamic(() => import('./LazyFaq'), {
  loading: () => <div className="h-96 bg-[#09080e] animate-pulse" />,
  ssr: true,
});

const LazyTestimonials = dynamic(() => import('./LazyTestimonials'), {
  loading: () => <div className="h-96 bg-[#09080e] animate-pulse" />,
  ssr: true,
});

interface PageProps {
  searchParams?: { category?: string; [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  // Fetch settings, products, and categories concurrently on the server side
  const [productsData, settingsData, categoriesData] = await Promise.all([
    getProducts(),
    getSettings(),
    getCategories(),
  ]);

  const howToOrderSteps = settingsData.how_to_order 
    ? JSON.parse(settingsData.how_to_order)
    : [];
  const faqItems = settingsData.faqs 
    ? JSON.parse(settingsData.faqs)
    : [];
  const testimonialItems = settingsData.testimonials 
    ? JSON.parse(settingsData.testimonials)
    : [];

  return (
    <>
      <HomeClient 
        initialProducts={productsData as any[]} 
        initialSettings={settingsData as Record<string, string>} 
        initialCategories={categoriesData as any[]}
      />
      
      {/* Lazy-loaded sections - only included in markup if data exists */}
      {howToOrderSteps.length > 0 && (
        <LazyHowToOrder howToOrderSteps={howToOrderSteps} />
      )}
      
      {faqItems.length > 0 && (
        <LazyFaq faqItems={faqItems} />
      )}
      
      {testimonialItems.length > 0 && (
        <LazyTestimonials testimonialItems={testimonialItems} />
      )}
    </>
  );
}

