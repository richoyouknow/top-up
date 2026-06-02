"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function createProduct(data: any) {
  try {
    const product = await db.product.create({
      data: {
        id: data.id,
        name: data.name,
        category: data.category,
        price: data.price,
        originalPrice: data.originalPrice || null,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        stockStatus: data.stockStatus || 'In Stock',
        featured: data.featured || false,
      }
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        originalPrice: data.originalPrice || null,
        description: data.description || '',
        imageUrl: data.imageUrl || '',
        stockStatus: data.stockStatus || 'In Stock',
        featured: data.featured || false,
      }
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return { success: true, product };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id }
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { success: false, error: error.message };
  }
}
