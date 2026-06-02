"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function createCategory(data: { name: string, slug: string }) {
  try {
    const category = await db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
      }
    });
    
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return { success: true, category };
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, data: { name: string, slug: string }) {
  try {
    const category = await db.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
      }
    });
    
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return { success: true, category };
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: { id }
    });
    
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return { success: false, error: error.message };
  }
}
