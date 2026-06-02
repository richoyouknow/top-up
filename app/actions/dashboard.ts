"use server";

import { db } from "@/lib/db";

export async function getDashboardStats() {
  try {
    // 1. Total Revenue (Completed orders)
    const completedOrders = await db.order.findMany({
      where: { status: 'Completed' },
      select: { amount: true }
    });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0);

    // 2. Total Orders
    const totalOrders = await db.order.count();

    // 3. Active Customers (Unique UIDs)
    const activeCustomersRaw = await db.order.groupBy({
      by: ['uid'],
      _count: {
        uid: true
      }
    });
    const activeCustomers = activeCustomersRaw.length;

    // 4. Pending Orders
    const pendingOrders = await db.order.count({
      where: { status: 'Pending' }
    });

    // 5. Revenue Trend (Last 7 days)
    const revenueTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const dayOrders = await db.order.findMany({
        where: {
          status: 'Completed',
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        select: { amount: true }
      });

      const total = dayOrders.reduce((sum, order) => sum + order.amount, 0);
      revenueTrend.push({
        name: dayName,
        total: total
      });
    }

    // 6. Monthly Sales (Last 6 months)
    const salesTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const count = await db.order.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      });
      
      salesTrend.push({
        name: monthName,
        sales: count
      });
    }

    // 7. Pesanan Terbaru (5 terakhir)
    const recentOrdersRaw = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // productId menyimpan teks ringkasan produk yang dipesan (misal: "Koin 8Ball 10M x1")
    const recentOrders = recentOrdersRaw.map(order => ({
      id: order.id.substring(0, 8).toUpperCase(),
      customer: order.customer,
      product: order.productId || 'Produk tidak diketahui',
      date: order.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      amount: `Rp ${order.amount.toLocaleString('id-ID')}`,
      status: order.status,
      fullId: order.id
    }));

    return {
      stats: [
        { title: 'Total Pendapatan', value: `Rp ${(totalRevenue / 1000000).toFixed(1)}Jt`, change: '+0%', isUp: true, icon: 'DollarSign', color: 'text-neon-purple' },
        { title: 'Total Pesanan', value: totalOrders.toLocaleString('id-ID'), change: '+0%', isUp: true, icon: 'ShoppingCart', color: 'text-blue-500' },
        { title: 'Pelanggan Aktif', value: activeCustomers.toLocaleString('id-ID'), change: '+0%', isUp: true, icon: 'Users', color: 'text-orange-500' },
        { title: 'Pesanan Pending', value: pendingOrders.toLocaleString('id-ID'), change: '+0%', isUp: true, icon: 'Package', color: 'text-emerald-500' },
      ],
      revenueTrend,
      salesTrend,
      recentOrders,
      rawStats: {
        totalRevenue,
        totalOrders,
        activeCustomers,
        pendingOrders
      }
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    throw error;
  }
}
