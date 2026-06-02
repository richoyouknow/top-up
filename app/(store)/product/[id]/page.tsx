import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

// Generate Dynamic SEO Metadata for specific products
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) {
    return {
      title: 'Product Not Found - ChampionStore.id',
    };
  }

  return {
    title: `${product.name} - ChampionStore.id`,
    description: `${product.description} Beli dengan harga Rp${product.price.toLocaleString('id-ID')} hanya di ChampionStore.id, proses cepat dan aman.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product, limit to 4)
  let relatedProducts = await db.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id }
    },
    take: 4
  });

  // If not enough related products from same category, fill with best sellers
  if (relatedProducts.length < 4) {
    const filler = await db.product.findMany({
      where: {
        id: { 
          notIn: [product.id, ...relatedProducts.map(p => p.id)]
        }
      },
      take: 4 - relatedProducts.length
    });
    relatedProducts.push(...filler);
  }

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
