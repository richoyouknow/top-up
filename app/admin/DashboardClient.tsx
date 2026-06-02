"use client";

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar
} from 'recharts';
import { 
  DollarSign, ShoppingCart, Users, Package, TrendingUp, MoreHorizontal, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const formatRupiah = (value: number) => {
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}Jt`;
  return `Rp ${(value / 1000).toFixed(0)}k`;
};

const iconMap: any = {
  DollarSign,
  ShoppingCart,
  Users,
  Package
};

interface DashboardClientProps {
  initialData: {
    stats: any[];
    revenueTrend: any[];
    salesTrend: any[];
    recentOrders: any[];
  }
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { stats, revenueTrend, salesTrend, recentOrders } = initialData;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Ringkasan Dashboard</h1>
        <p className="text-neutral-400 mt-1">Berikut aktivitas toko Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((metric, i) => {
          const Icon = iconMap[metric.icon] || Package;
          return (
            <div key={i} className="bg-[#0a0a0a] rounded-xl border border-neutral-800 p-5 flex flex-col relative overflow-hidden group hover:border-neutral-700 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-400">{metric.title}</p>
                  <h3 className="text-2xl font-bold text-white mt-2">{metric.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-white/5 ${metric.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <span className={`flex items-center font-medium ${metric.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {metric.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {metric.change}
                </span>
                <span className="text-neutral-500">vs bulan lalu</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 p-5 lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Tren Pendapatan</h3>
              <p className="text-sm text-neutral-400">Ringkasan pendapatan 7 hari terakhir</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9d4edd" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatRupiah} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="total" stroke="#9d4edd" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 p-5 lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Penjualan Bulanan</h3>
              <p className="text-sm text-neutral-400">Total pesanan per bulan</p>
            </div>
            <TrendingUp className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="flex-1 min-h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1f1f1f' }}
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Pesanan Terbaru</h3>
            <p className="text-sm text-neutral-400">Transaksi terbaru</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-400 uppercase bg-[#111] border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">ID Pesanan</th>
                <th className="px-6 py-4 font-medium">Pelanggan</th>
                <th className="px-6 py-4 font-medium">Produk</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Jumlah</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {recentOrders.map((order) => (
                <tr key={order.fullId} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4 text-neutral-300">{order.customer}</td>
                  <td className="px-6 py-4 text-neutral-300">{order.product}</td>
                  <td className="px-6 py-4 text-neutral-400">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-white">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                      ${order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                        order.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : 
                        order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-red-500/10 text-red-500'}
                    `}>
                      {order.status === 'Completed' ? 'Selesai' :
                       order.status === 'Pending' ? 'Menunggu' :
                       order.status === 'Processing' ? 'Diproses' :
                       order.status === 'Cancelled' ? 'Dibatalkan' : order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-neutral-500 hover:text-white transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-neutral-500">
                    Belum ada pesanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
