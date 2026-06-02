"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function login(username: string, password: string) {
  try {
    const admin = await db.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return { success: false, error: "Invalid username or password" };
    }

    if (admin.password !== password) {
      return { success: false, error: "Invalid username or password" };
    }

    return { 
      success: true, 
      admin: { 
        id: admin.id, 
        username: admin.username, 
        name: admin.name 
      } 
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, error: `Error: ${error.message || "An unexpected error occurred"}` };
  }
}

export async function getAdminProfile() {
  try {
    // In a real app, we'd check the session. 
    // Since we're using localStorage for simplicity in this proto, 
    // we'll just fetch the first admin.
    const admin = await db.admin.findFirst();
    if (!admin) return null;
    
    return {
      id: admin.id,
      username: admin.username,
      name: admin.name
    };
  } catch (error) {
    console.error("Failed to fetch admin profile:", error);
    return null;
  }
}

export async function updateAdminProfile(data: { username: string, name: string, password?: string }) {
  try {
    const admin = await db.admin.findFirst();
    if (!admin) return { success: false, error: "Admin not found" };

    const updateData: any = {
      username: data.username,
      name: data.name,
    };

    if (data.password) {
      updateData.password = data.password;
    }

    await db.admin.update({
      where: { id: admin.id },
      data: updateData
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    return { success: false, error: error.message };
  }
}
