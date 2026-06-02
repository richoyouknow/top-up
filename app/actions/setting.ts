"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    const settings = await db.setting.findMany();
    // Convert array to object { key: value }
    const settingsObj = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    return settingsObj;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

export async function updateSettings(settings: Record<string, string>) {
  try {
    for (const [key, value] of Object.entries(settings)) {
      await db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }
    
    revalidatePath('/admin/settings');
    revalidatePath('/admin/content');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { success: false, error: error.message };
  }
}
