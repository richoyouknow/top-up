'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, ShieldCheck, Check, Coins, X, Upload, Landmark, QrCode, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import FadeIn from '@/app/components/FadeIn';
import { useCart } from '@/app/context/cart-context';
import { getSettings } from '@/app/actions/setting';
import { createOrder } from '@/app/actions/order';

type PaymentMethod = 'qris' | 'transfer';

interface CheckoutSettings {
  paymentQrisImageUrl: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankTransferNotes: string;
  whatsapp?: string;
}

const DEFAULT_SETTINGS: CheckoutSettings = {
  paymentQrisImageUrl: '',
  bankName: 'BCA',
  bankAccountNumber: '1234567890',
  bankAccountHolder: 'ChampionStore.id',
  bankTransferNotes: 'Gunakan nominal yang sesuai agar verifikasi lebih cepat.',
  whatsapp: '6281234567890',
};

const ADMIN_WHATSAPP_FALLBACK = '6281234567890';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Form states
  const [fullName, setFullName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [gameUid, setGameUid] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Payment flow state
  const [settings, setSettings] = useState<CheckoutSettings>(DEFAULT_SETTINGS);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchSettings() {
      setIsLoadingSettings(true);
      const data = await getSettings();
      setSettings((prev) => ({ ...prev, ...(data as Partial<CheckoutSettings>) }));
      setIsLoadingSettings(false);
    }

    fetchSettings();
  }, []);

  // Redirect if cart is empty on mount (only on client)
  useEffect(() => {
    if (isClient && cartItems.length === 0 && !isSubmitting) {
      router.push('/catalog');
    }
  }, [isClient, cartItems, router, isSubmitting]);

  const getSafeImageSrc = (src?: string | null) => {
    const value = (src ?? '').trim();
    if (!value) return '/hero-cues.png';
    
    // Convert old full URLs from championshop.id to relative paths for dev/prod compatibility
    if (value.includes('championshop.id/uploads/')) {
      return '/uploads/' + value.split('championshop.id/uploads/')[1];
    }
    
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;

    return `/${value.replace(/^\.?\//, '')}`;
  };

  const normalizePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('62')) return digits;
    if (digits.startsWith('0')) return `62${digits.slice(1)}`;
    return digits;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi.';
    }

    if (!whatsAppNumber.trim()) {
      newErrors.whatsAppNumber = 'Nomor WhatsApp wajib diisi.';
    } else if (!/^\d{9,15}$/.test(whatsAppNumber.replace(/[^0-9]/g, ''))) {
      newErrors.whatsAppNumber = 'Masukkan nomor WhatsApp yang valid (9-15 digit).';
    }

    if (!gameUid.trim()) {
      newErrors.gameUid = 'UID 8 Ball Pool wajib diisi.';
    } else if (!/^\d{8,12}$/.test(gameUid.replace(/[^0-9]/g, ''))) {
      newErrors.gameUid = 'UID 8 Ball Pool harus berupa angka (8-12 digit).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openPaymentFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsPaymentModalOpen(true);
  };

  const handleUploadProof = async (file: File | null) => {
    if (!file) return;

    setIsUploadingProof(true);

    try {
      const body = new FormData();
      body.append('file', file);

      const response = await fetch('/api/upload/payment-proof', {
        method: 'POST',
        body,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || 'Gagal upload bukti pembayaran.');
      }

      setProofUrl(result.url);
      setProofFileName(file.name);
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat upload bukti pembayaran.');
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!proofUrl) {
      alert('Silakan upload bukti pembayaran terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Confetti failed to trigger:', err);
    }

    const adminPhone = settings.whatsapp || ADMIN_WHATSAPP_FALLBACK;
    const normalizedAdminPhone = normalizePhone(adminPhone);
    const itemsListText = cartItems
      .map((item) => `- ${item.product.name} x${item.quantity} (Rp${(item.product.price * item.quantity).toLocaleString('id-ID')})`)
      .join('\n');

    const paymentMethodText =
      selectedMethod === 'qris'
        ? 'QRIS'
        : `Transfer Bank (${settings.bankName} - ${settings.bankAccountNumber} a.n ${settings.bankAccountHolder})`;

    const paidAt = new Date();
    const paidAtDisplay = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Jakarta',
    }).format(paidAt);

    const proofAbsoluteUrl = proofUrl.startsWith('http')
      ? proofUrl
      : `${window.location.origin}${proofUrl}`;

    const messageText = `Halo Admin ChampionStore,

Saya sudah melakukan pembayaran.

*Waktu Pembayaran (Real-time)*
- ${paidAtDisplay}

*Detail Pemesan*
- Nama: ${fullName}
- WA Aktif: ${whatsAppNumber}
- UID 8 Ball Pool: ${gameUid}

*Detail Pesanan*
${itemsListText}

*Total Pembayaran*
- Rp${cartTotal.toLocaleString('id-ID')}

*Metode Pembayaran*
- ${paymentMethodText}

*Bukti Pembayaran*
- Sudah diunggah dari website
- Link gambar: ${proofAbsoluteUrl}

*Catatan*
${additionalNotes.trim() ? additionalNotes.trim() : 'Mohon diproses segera. Terima kasih.'}`;

    const waUrl = `https://wa.me/${normalizedAdminPhone}?text=${encodeURIComponent(messageText)}`;

    const orderSummaryText = cartItems.map((item) => `${item.product.name} x${item.quantity}`).join(', ');

    const orderResult = await createOrder({
      uid: gameUid,
      phone: whatsAppNumber,
      customer: fullName,
      productId: orderSummaryText,
      amount: cartTotal,
      status: 'Pending',
      paymentMethod: selectedMethod === 'qris' ? 'QRIS' : 'Transfer Bank',
      paymentProofUrl: proofAbsoluteUrl,
      paidAt,
      notes: additionalNotes.trim() || undefined,
    });

    if (!orderResult.success) {
      console.error('Failed to create order in database:', orderResult.error);
    }

    setTimeout(() => {
      clearCart();
      window.location.href = waUrl;
    }, 1200);
  };

  if (!isClient || cartItems.length === 0 || isLoadingSettings) {
    return (
      <div className="flex flex-col flex-1 w-full">
        <div className="flex-1 flex flex-col items-center justify-center py-32 text-gray-text gap-3">
          <div className="h-7 w-7 border-2 border-t-neon-purple border-dark-purple rounded-full animate-spin"></div>
          <span className="text-xs font-bold tracking-wider">Menyiapkan Checkout...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full relative">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pt-32 relative z-10 overflow-hidden">
        <FadeIn direction="up">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-text hover:text-white transition-colors duration-200 mb-8"
            id="checkout-back-cart-link"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Keranjang
          </Link>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-8 uppercase text-left">Form Pembayaran</h1>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <FadeIn direction="left" delay={0.1}>
              <div className="premium-card rounded-xl p-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide mb-6 border-b border-dark-purple/35 pb-3.5 text-left">
                  Data Pemesan 8 Ball Pool
                </h2>

                <form onSubmit={openPaymentFlow} className="flex flex-col gap-5 text-left" id="checkout-form">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fullName" className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Contoh: Muhammad Richo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-[#09080e] border rounded-lg text-xs md:text-sm text-white placeholder-gray-text focus:outline-none transition-all duration-200 ${
                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-dark-purple/45 focus:border-neon-purple'
                      }`}
                    />
                    {errors.fullName && <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider mt-0.5">{errors.fullName}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="whatsApp" className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="text"
                      id="whatsApp"
                      placeholder="Contoh: 081234567890"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-[#09080e] border rounded-lg text-xs md:text-sm text-white placeholder-gray-text focus:outline-none transition-all duration-200 ${
                        errors.whatsAppNumber ? 'border-red-500 focus:border-red-500' : 'border-dark-purple/45 focus:border-neon-purple'
                      }`}
                    />
                    {errors.whatsAppNumber ? (
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider mt-0.5">{errors.whatsAppNumber}</span>
                    ) : (
                      <span className="text-[9px] text-gray-text leading-relaxed">Wajib aktif demi koordinasi pengiriman pesanan oleh admin toko kami.</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="gameUid" className="text-[10px] font-bold text-white uppercase tracking-wider">
                      UID Game 8 Ball Pool
                    </label>
                    <input
                      type="text"
                      id="gameUid"
                      placeholder="Contoh: 123456789"
                      value={gameUid}
                      onChange={(e) => setGameUid(e.target.value)}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 bg-[#09080e] border rounded-lg text-xs md:text-sm text-white placeholder-gray-text focus:outline-none transition-all duration-200 ${
                        errors.gameUid ? 'border-red-500 focus:border-red-500' : 'border-dark-purple/45 focus:border-neon-purple'
                      }`}
                    />
                    {errors.gameUid ? (
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider mt-0.5">{errors.gameUid}</span>
                    ) : (
                      <span className="text-[9px] text-gray-text leading-relaxed">Ketikkan UID akun Anda secara teliti agar pesanan cepat diproses.</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="notes" className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Tuliskan catatan khusus jika diperlukan..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-[#09080e] border border-dark-purple/45 rounded-lg text-xs md:text-sm text-white placeholder-gray-text focus:outline-none focus:border-neon-purple transition-all duration-200 resize-none"
                    />
                  </div>

                  <button type="submit" id="checkout-form-submit" className="hidden" />
                </form>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <FadeIn direction="right" delay={0.2} fullWidth>
              <div className="premium-card rounded-xl p-6 flex flex-col gap-6 text-left w-full">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide pb-3.5 border-b border-dark-purple/35">Rincian Pesanan</h2>

                <div className="flex flex-col gap-3.5 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-xs gap-3">
                      <span className="text-gray-text font-medium truncate max-w-[24ch]">
                        {item.product.name} <span className="text-white font-bold">x{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-white shrink-0">Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-dark-purple/35"></div>

                <div className="flex items-end justify-between">
                  <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider">Total Pembayaran</span>
                  <span className="text-lg font-extrabold text-white">Rp{cartTotal.toLocaleString('id-ID')}</span>
                </div>

                <button
                  type="button"
                  id="checkout-open-payment-btn"
                  onClick={() => {
                    const submitBtn = document.getElementById('checkout-form-submit');
                    if (submitBtn) submitBtn.click();
                  }}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-neon-purple hover:bg-violet text-xs md:text-sm font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-white border-violet rounded-full animate-spin shrink-0"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Pesan
                    </>
                  )}
                </button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.3} fullWidth>
              <div className="rounded-xl border border-dark-purple/35 bg-[#13111b] p-4 flex items-start gap-3 text-left w-full">
                <ShieldCheck className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Checkout Aman</span>
                  <span className="text-[9px] text-gray-text leading-relaxed">
                    Pilih metode pembayaran Anda, upload bukti transfer, lalu sistem otomatis mengarahkan Anda ke WhatsApp admin untuk proses lebih cepat.
                  </span>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.4} fullWidth>
              <div className="rounded-xl border border-dark-purple/35 bg-[#13111b] p-4 flex items-start gap-3 text-left w-full">
                <Coins className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Verifikasi Cepat</span>
                  <span className="text-[9px] text-gray-text leading-relaxed">
                    Pastikan nominal transfer sesuai total pesanan untuk mempercepat verifikasi dan pengiriman item.
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)} />
          <div className="relative w-full max-w-3xl rounded-2xl border border-dark-purple/40 bg-[#0f0b16] p-6 md:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wide">Pilih Metode Pembayaran</h3>
              <button id="checkout-close-payment-modal-btn" onClick={() => setIsPaymentModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                id="checkout-select-qris-btn"
                type="button"
                onClick={() => setSelectedMethod('qris')}
                className={`rounded-xl border p-4 text-left transition-all ${selectedMethod === 'qris' ? 'border-neon-purple bg-neon-purple/10' : 'border-dark-purple/35 bg-[#13111b] hover:border-neon-purple/50'}`}
              >
                <div className="flex items-center gap-2 mb-2 text-white font-semibold">
                  <QrCode className="w-4 h-4" /> QRIS
                </div>
                <p className="text-[11px] text-gray-text">Scan QRIS di bawah untuk pembayaran instan dari semua e-wallet dan mobile banking.</p>
              </button>

              <button
                id="checkout-select-transfer-btn"
                type="button"
                onClick={() => setSelectedMethod('transfer')}
                className={`rounded-xl border p-4 text-left transition-all ${selectedMethod === 'transfer' ? 'border-neon-purple bg-neon-purple/10' : 'border-dark-purple/35 bg-[#13111b] hover:border-neon-purple/50'}`}
              >
                <div className="flex items-center gap-2 mb-2 text-white font-semibold">
                  <Landmark className="w-4 h-4" /> Transfer Bank
                </div>
                <p className="text-[11px] text-gray-text">Transfer manual ke rekening toko. Pastikan nominal sesuai total tagihan.</p>
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-dark-purple/30 bg-[#13111b] p-4">
              {selectedMethod === 'qris' ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-full max-w-[280px] aspect-square rounded-xl overflow-hidden border border-dark-purple/35 bg-[#09080e]">
                    {settings.paymentQrisImageUrl ? (
                      <Image src={getSafeImageSrc(settings.paymentQrisImageUrl)} alt="QRIS Payment" fill style={{ objectFit: 'contain' }} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-text text-center px-4">QRIS belum diatur oleh admin.</div>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-text text-center">Setelah transfer berhasil, klik tombol <span className="text-white font-semibold">Saya Sudah Membayar</span>.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-left">
                  <p className="text-xs text-gray-text">Bank:</p>
                  <p className="text-sm font-bold text-white">{settings.bankName}</p>
                  <p className="text-xs text-gray-text">Nomor Rekening:</p>
                  <p className="text-sm font-bold text-white tracking-wider">{settings.bankAccountNumber}</p>
                  <p className="text-xs text-gray-text">Atas Nama:</p>
                  <p className="text-sm font-bold text-white">{settings.bankAccountHolder}</p>
                  <p className="text-[11px] text-gray-text mt-2 leading-relaxed">{settings.bankTransferNotes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                id="checkout-cancel-payment-btn"
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#1a1524] border border-dark-purple/35 text-gray-text hover:text-white"
              >
                Batal
              </button>
              <button
                id="checkout-open-proof-modal-btn"
                type="button"
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setIsProofModalOpen(true);
                }}
                className="px-4 py-2.5 text-xs font-bold rounded-lg bg-neon-purple hover:bg-violet text-white"
              >
                Saya Sudah Membayar
              </button>
            </div>
          </div>
        </div>
      )}

      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsProofModalOpen(false)} />
          <div className="relative w-full max-w-3xl rounded-2xl border border-dark-purple/40 bg-[#0f0b16] p-6 md:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.55)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-wide">Konfirmasi Pembayaran</h3>
              <button id="checkout-close-proof-modal-btn" onClick={() => setIsProofModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl border border-dark-purple/35 bg-[#13111b] p-4 mb-4">
              <p className="text-[10px] text-gray-text uppercase tracking-wider mb-2">Ringkasan Produk</p>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={`proof-${item.product.id}`} className="flex justify-between text-xs">
                    <span className="text-gray-text">{item.product.name} x{item.quantity}</span>
                    <span className="text-white font-semibold">Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-dark-purple/35 my-3"></div>
              <div className="flex items-end justify-between">
                <span className="text-[10px] text-gray-text font-bold uppercase tracking-wider">Total Pembayaran</span>
                <span className="text-lg font-extrabold text-white">Rp{cartTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="rounded-xl border border-dark-purple/35 bg-[#13111b] p-4">
              <p className="text-[10px] text-gray-text uppercase tracking-wider mb-2">Upload Bukti Pembayaran</p>
              <label className="flex items-center justify-center gap-2 w-full bg-[#111] border border-dashed border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-300 hover:border-neon-purple hover:text-white transition-colors cursor-pointer">
                {isUploadingProof ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploadingProof ? 'Uploading bukti pembayaran...' : 'Pilih file bukti pembayaran'}
                <input
                  id="checkout-payment-proof-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleUploadProof(e.target.files?.[0] || null)}
                />
              </label>

              {proofUrl && (
                <div className="mt-3 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-2">
                  <p className="text-[11px] font-semibold text-emerald-400">Bukti berhasil diunggah</p>
                  <p className="text-[10px] text-emerald-200/85 break-all">{proofFileName || proofUrl}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                id="checkout-back-payment-modal-btn"
                type="button"
                onClick={() => {
                  setIsProofModalOpen(false);
                  setIsPaymentModalOpen(true);
                }}
                className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#1a1524] border border-dark-purple/35 text-gray-text hover:text-white"
              >
                Kembali
              </button>
              <button
                id="checkout-send-confirmation-btn"
                type="button"
                disabled={isUploadingProof || isSubmitting}
                onClick={handleConfirmPayment}
                className="px-4 py-2.5 text-xs font-bold rounded-lg bg-neon-purple hover:bg-violet text-white disabled:opacity-60"
              >
                {isSubmitting ? 'Memproses...' : 'Kirim Konfirmasi & Chat Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
