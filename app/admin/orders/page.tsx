"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Loader2,
  X,
  Save,
  User,
  Smartphone,
  Wallet,
  Calendar,
  FileText,
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/app/actions/order';

interface AdminOrder {
  id: string;
  uid: string;
  phone: string;
  customer: string;
  productId: string;
  amount: number;
  status: string;
  paymentMethod?: string | null;
  paymentProofUrl?: string | null;
  paidAt?: string | Date | null;
  notes?: string | null;
  createdAt: string | Date;
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data as AdminOrder[]);
    setIsLoading(false);
  };

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.uid.includes(search) ||
      order.productId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSafeImageSrc = (src?: string | null) => {
    const value = (src ?? '').trim();
    if (!value) return '';
    
    // Convert old full URLs from championshop.id to relative paths for dev/prod compatibility
    if (value.includes('championshop.id/uploads/')) {
      return '/uploads/' + value.split('championshop.id/uploads/')[1];
    }
    
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('/')) return value;
    return `/${value.replace(/^\.?\//, '')}`;
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setIsSavingStatus(true);
    const res = await updateOrderStatus(selectedOrder.id, selectedStatus);

    if (!res.success) {
      alert('Failed to update status');
      setIsSavingStatus(false);
      return;
    }

    setOrders((prev) => prev.map((order) => (order.id === selectedOrder.id ? { ...order, status: selectedStatus } : order)));
    setSelectedOrder((prev) => (prev ? { ...prev, status: selectedStatus } : prev));
    setIsSavingStatus(false);
  };

  const renderStatusBadge = (status: string) => {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          ${
            status === 'Completed'
              ? 'bg-emerald-500/10 text-emerald-500'
              : status === 'Pending'
              ? 'bg-orange-500/10 text-orange-500'
              : status === 'Processing'
              ? 'bg-blue-500/10 text-blue-500'
              : 'bg-red-500/10 text-red-500'
          }
        `}
      >
        {status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
        {status === 'Pending' && <Clock className="w-3 h-3" />}
        {status === 'Processing' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
        {status === 'Cancelled' && <XCircle className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Orders</h1>
        <p className="text-neutral-400 mt-1">Manage and process customer orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-neutral-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by Order ID, Name, UID, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
            id="admin-orders-search-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
          id="admin-orders-status-filter"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-[#111] border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID & Date</th>
                  <th className="px-6 py-4 font-medium">Customer Details</th>
                  <th className="px-6 py-4 font-medium">Product Ordered</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{order.id}</div>
                      <div className="text-xs text-neutral-500 mt-1">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-300">{order.customer}</div>
                      <div className="text-xs text-neutral-500 mt-1 flex flex-col gap-0.5">
                        <span>WA: {order.phone}</span>
                        <span className="text-neon-purple">UID: {order.uid}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      <div className="line-clamp-2 max-w-[220px]">{order.productId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">Rp {order.amount.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">{renderStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        id={`admin-order-detail-btn-${order.id}`}
                        onClick={() => {
                          setSelectedOrder(order);
                          setSelectedStatus(order.status);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-[#0a0a0a] border border-neutral-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
              <div>
                <h2 className="text-lg font-bold text-white">Transaction Detail</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Order ID: {selectedOrder.id}</p>
              </div>
              <button
                id="admin-order-detail-close-btn"
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-neutral-800 bg-[#111] p-4 space-y-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Customer Info</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-neutral-300">
                      <User className="w-4 h-4 mt-0.5 text-neon-purple" />
                      <span>{selectedOrder.customer}</span>
                    </div>
                    <div className="flex items-start gap-2 text-neutral-300">
                      <Smartphone className="w-4 h-4 mt-0.5 text-neon-purple" />
                      <span>{selectedOrder.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-neutral-300">
                      <Wallet className="w-4 h-4 mt-0.5 text-neon-purple" />
                      <span>UID: {selectedOrder.uid}</span>
                    </div>
                    <div className="flex items-start gap-2 text-neutral-300">
                      <Calendar className="w-4 h-4 mt-0.5 text-neon-purple" />
                      <span>Paid: {formatDate(selectedOrder.paidAt || selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-[#111] p-4 space-y-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Payment Info</p>
                  <div className="space-y-2 text-sm text-neutral-300">
                    <p>
                      Method: <span className="text-white font-medium">{selectedOrder.paymentMethod || 'Belum diisi'}</span>
                    </p>
                    <p>
                      Total: <span className="text-white font-medium">Rp {selectedOrder.amount.toLocaleString('id-ID')}</span>
                    </p>
                    <p>
                      Status: <span className="text-white font-medium">{selectedOrder.status}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-[#111] p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Product Summary</p>
                <p className="text-sm text-neutral-300 whitespace-pre-wrap">{selectedOrder.productId}</p>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-[#111] p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Customer Notes</p>
                <p className="text-sm text-neutral-300 whitespace-pre-wrap">{selectedOrder.notes || '-'}</p>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-[#111] p-4 space-y-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">Payment Proof</p>
                {getSafeImageSrc(selectedOrder.paymentProofUrl) ? (
                  <div className="rounded-lg overflow-hidden border border-neutral-700 bg-[#09080e]">
                    <img
                      src={getSafeImageSrc(selectedOrder.paymentProofUrl)}
                      alt="Bukti Pembayaran"
                      className="w-full h-auto max-h-[420px] object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">Bukti pembayaran belum tersedia.</p>
                )}
              </div>

              <div className="rounded-lg border border-neutral-800 bg-[#111] p-4">
                <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Update Order Status</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <select
                    id="admin-order-detail-status-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-[#09080e] border border-neutral-700 rounded text-sm text-white px-3 py-2 focus:outline-none focus:border-neon-purple"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    id="admin-order-detail-save-status-btn"
                    onClick={handleUpdateStatus}
                    disabled={isSavingStatus || selectedStatus === selectedOrder.status}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neon-purple hover:bg-violet rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSavingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSavingStatus ? 'Saving...' : 'Save Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
