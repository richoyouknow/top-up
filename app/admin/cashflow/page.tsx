"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { FileText, FileSpreadsheet, TrendingUp, DollarSign, CreditCard, Loader2 } from 'lucide-react';
import { getOrders } from '@/app/actions/order';

interface AdminOrder {
  id: string;
  uid: string;
  phone: string;
  customer: string;
  productId: string;
  amount: number;
  status: string;
  createdAt: string | Date;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const formatRupiahCompact = (value: number) => {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}Jt`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
  return `Rp ${value}`;
};

const formatDateTime = (value: string | Date) => {
  return new Date(value).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getOrderPaymentState = (status: string) => {
  if (status === 'Completed') return 'Success';
  if (status === 'Cancelled') return 'Failed';
  return 'Pending';
};

export default function CashflowManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('This Month');

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data as AdminOrder[]);
      setIsLoading(false);
    }

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const createdAt = new Date(order.createdAt);

      if (dateRange === 'Today') {
        return createdAt.toDateString() === now.toDateString();
      }

      if (dateRange === 'This Week') {
        const day = now.getDay();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - day);
        weekStart.setHours(0, 0, 0, 0);
        return createdAt >= weekStart;
      }

      if (dateRange === 'This Month') {
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [orders, dateRange]);

  const paidOrders = useMemo(
    () => filteredOrders.filter((order) => order.status === 'Completed'),
    [filteredOrders]
  );

  const cancelledOrders = useMemo(
    () => filteredOrders.filter((order) => order.status === 'Cancelled'),
    [filteredOrders]
  );

  const grossVolume = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
  const netIncome = paidOrders.reduce((sum, order) => sum + order.amount, 0);
  const refunds = cancelledOrders.reduce((sum, order) => sum + order.amount, 0);
  const avgOrderValue = filteredOrders.length > 0 ? Math.round(grossVolume / filteredOrders.length) : 0;

  const monthlyRevenue = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        name: date.toLocaleString('id-ID', { month: 'short' }),
      };
    });

    return months.map((month) => {
      const monthRevenue = orders
        .filter((order) => order.status === 'Completed')
        .filter((order) => {
          const d = new Date(order.createdAt);
          return `${d.getFullYear()}-${d.getMonth()}` === month.key;
        })
        .reduce((sum, order) => sum + order.amount, 0);

      return {
        name: month.name,
        revenue: monthRevenue,
      };
    });
  }, [orders]);

  const statusBreakdown = useMemo(() => {
    const success = filteredOrders.filter((order) => order.status === 'Completed').length;
    const pending = filteredOrders.filter((order) => order.status === 'Pending' || order.status === 'Processing').length;
    const failed = filteredOrders.filter((order) => order.status === 'Cancelled').length;

    return [
      { name: 'Success', value: success },
      { name: 'Pending', value: pending },
      { name: 'Failed', value: failed },
    ].filter((item) => item.value > 0);
  }, [filteredOrders]);

  const handleExport = (type: string) => {
    alert(`Export ${type} akan ditambahkan pada tahap berikutnya.`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Cashflow & Financials</h1>
          <p className="text-neutral-400 mt-1">Live summary dari transaksi yang masuk ke database orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export Excel
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700"
          >
            <FileText className="w-4 h-4 text-red-400" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Net Income',
            value: `Rp ${netIncome.toLocaleString('id-ID')}`,
            desc: 'Dari order Completed',
            icon: DollarSign,
            color: 'text-neon-purple',
          },
          {
            title: 'Gross Volume',
            value: `Rp ${grossVolume.toLocaleString('id-ID')}`,
            desc: 'Semua order di periode terpilih',
            icon: TrendingUp,
            color: 'text-blue-500',
          },
          {
            title: 'Avg. Order Value',
            value: `Rp ${avgOrderValue.toLocaleString('id-ID')}`,
            desc: `${filteredOrders.length} transaksi`,
            icon: CreditCard,
            color: 'text-emerald-500',
          },
          {
            title: 'Refunds/Cancelled',
            value: `Rp ${refunds.toLocaleString('id-ID')}`,
            desc: `${cancelledOrders.length} order dibatalkan`,
            icon: FileText,
            color: 'text-red-500',
          },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="bg-[#0a0a0a] rounded-xl border border-neutral-800 p-5 flex flex-col relative overflow-hidden group hover:border-neutral-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-400">{metric.title}</p>
                  <h3 className="text-xl font-bold text-white mt-2 leading-tight">{metric.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-white/5 ${metric.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-500">{metric.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 p-5 lg:col-span-2 flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">Monthly Revenue</h3>
            <p className="text-sm text-neutral-400">Akumulasi order status Completed selama 6 bulan terakhir</p>
          </div>
          <div className="flex-1 min-h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatRupiahCompact} />
                <Tooltip
                  cursor={{ fill: '#1f1f1f' }}
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#9d4edd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">Payment Status Breakdown</h3>
            <p className="text-sm text-neutral-400">Distribusi status transaksi di periode aktif</p>
          </div>
          <div className="flex-1 min-h-[300px] w-full mt-4 flex items-center justify-center relative">
            {statusBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
                    formatter={(value: any) => [`${Number(value)} transaksi`, 'Jumlah']}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#a3a3a3' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-neutral-500">Belum ada data transaksi.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Transaction Ledger</h3>
            <p className="text-sm text-neutral-400">Riwayat transaksi langsung dari tabel orders</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-all"
            id="cashflow-date-range-select"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>All Time</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-400 uppercase bg-[#111] border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Order Summary</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredOrders.map((order) => {
                const paymentState = getOrderPaymentState(order.status);
                return (
                  <tr key={order.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                    <td className="px-6 py-4 text-neutral-400">{formatDateTime(order.createdAt)}</td>
                    <td className="px-6 py-4 text-neutral-300">{order.customer}</td>
                    <td className="px-6 py-4 text-neutral-300">
                      <div className="line-clamp-2 max-w-[300px]">{order.productId}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-white">Rp {order.amount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          paymentState === 'Success'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : paymentState === 'Pending'
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {paymentState}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Belum ada transaksi pada rentang waktu ini.
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
