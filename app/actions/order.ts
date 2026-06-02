"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateOrderPayload {
  uid: string;
  phone: string;
  customer: string;
  productId: string;
  amount: number;
  status?: string;
  paymentMethod?: string;
  paymentProofUrl?: string;
  paidAt?: Date;
  notes?: string;
}

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

export async function createOrder(data: CreateOrderPayload) {
  try {
    const order = await db.order.create({
      data: {
        uid: data.uid,
        phone: data.phone,
        customer: data.customer,
        productId: data.productId,
        amount: data.amount,
        status: data.status || 'Pending',
        paymentMethod: data.paymentMethod || null,
        paymentProofUrl: data.paymentProofUrl || null,
        paidAt: data.paidAt || null,
        notes: data.notes || null,
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin/cashflow');

    return { success: true, order };
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const order = await db.order.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin/cashflow');

    return { success: true, order };
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return { success: false, error: error.message };
  }
}

export async function getPendingOrdersCount() {
  try {
    const count = await db.order.count({
      where: { status: 'Pending' }
    });
    return count;
  } catch (error) {
    console.error("Failed to fetch pending orders count:", error);
    return 0;
  }
}
