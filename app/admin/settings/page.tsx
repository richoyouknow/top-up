"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Save,
  Store,
  Link as LinkIcon,
  FileText,
  Loader2,
  Upload,
  Landmark,
  QrCode,
} from 'lucide-react';
import { getSettings, updateSettings } from '@/app/actions/setting';

export default function SettingsManager() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingQris, setIsUploadingQris] = useState(false);

  const [settings, setSettings] = useState({
    storeName: 'ChampionStore.id',
    storeDescription: 'Toko Item 8 Ball Pool Terpercaya No.1',
    whatsapp: '6281234567890',
    instagram: '',
    facebook: '',
    seoTitle: 'ChampionStore.id - Toko Item 8 Ball Pool Terpercaya',
    paymentQrisImageUrl: '',
    bankName: 'BCA',
    bankAccountNumber: '',
    bankAccountHolder: '',
    bankTransferNotes: 'Gunakan nominal transfer yang sesuai total pesanan agar verifikasi lebih cepat.',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const data = await getSettings();
    if (Object.keys(data).length > 0) {
      setSettings((prev) => ({ ...prev, ...data }));
    }
    setIsLoading(false);
  };

  const getSafeImageSrc = (src?: string | null) => {
    const value = (src ?? '').trim();

    if (!value) return '/hero-cues.png';
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;

    return `/${value.replace(/^\.?\//, '')}`;
  };

  const handleUploadQris = async (file: File | null) => {
    if (!file) return;

    setIsUploadingQris(true);

    try {
      const body = new FormData();
      body.append('file', file);

      const response = await fetch('/api/upload/payment-qris', {
        method: 'POST',
        body,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || 'Gagal upload QRIS.');
      }

      setSettings((prev) => ({
        ...prev,
        paymentQrisImageUrl: result.url,
      }));
    } catch (error: any) {
      alert(error.message || 'Gagal upload gambar QRIS.');
    } finally {
      setIsUploadingQris(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await updateSettings(settings);
    if (res.success) {
      alert('Settings berhasil disimpan!');
    } else {
      alert('Gagal menyimpan settings');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-neutral-400 mt-1">Configure store information, payment methods, social links, and SEO.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
            <Store className="w-5 h-5 text-neon-purple" />
            <h2 className="text-lg font-bold text-white">Store Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                />
                <p className="text-xs text-neutral-500">Include country code (e.g., 62 for Indonesia)</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Store Description</label>
              <textarea
                rows={2}
                value={settings.storeDescription}
                onChange={(e) => setSettings({ ...settings, storeDescription: e.target.value })}
                className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
            <Landmark className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Payment Settings</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Bank Name</label>
                <input
                  type="text"
                  value={settings.bankName}
                  onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                  placeholder="Contoh: BCA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Account Number</label>
                <input
                  type="text"
                  value={settings.bankAccountNumber}
                  onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                  placeholder="Contoh: 1234567890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Account Holder Name</label>
              <input
                type="text"
                value={settings.bankAccountHolder}
                onChange={(e) => setSettings({ ...settings, bankAccountHolder: e.target.value })}
                className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                placeholder="Contoh: ChampionStore.id"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">Transfer Notes</label>
              <textarea
                rows={2}
                value={settings.bankTransferNotes}
                onChange={(e) => setSettings({ ...settings, bankTransferNotes: e.target.value })}
                className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  QRIS Image
                </label>
                <label className="flex items-center justify-center gap-2 w-full bg-[#111] border border-dashed border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-300 hover:border-neon-purple hover:text-white transition-colors cursor-pointer">
                  {isUploadingQris ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploadingQris ? 'Uploading QRIS...' : 'Upload gambar QRIS'}
                  <input
                    id="admin-qris-upload-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleUploadQris(e.target.files?.[0] || null)}
                  />
                </label>
                {settings.paymentQrisImageUrl && (
                  <p className="text-[11px] text-neutral-500 break-all">{settings.paymentQrisImageUrl}</p>
                )}
              </div>

              <div className="rounded-lg border border-neutral-800 bg-[#111] p-3">
                <p className="text-xs text-neutral-400 mb-2">QRIS Preview</p>
                <div className="relative aspect-square w-full rounded-md overflow-hidden border border-neutral-700 bg-[#1a1a1a]">
                  {settings.paymentQrisImageUrl ? (
                    <Image src={getSafeImageSrc(settings.paymentQrisImageUrl)} alt="QRIS Preview" fill style={{ objectFit: 'contain' }} className="p-2" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500 text-center px-3">
                      Belum ada gambar QRIS
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
            <LinkIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Social Media Links</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Instagram URL</label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Facebook URL</label>
                <input
                  type="url"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-5 border-b border-neutral-800 flex items-center gap-3">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">SEO Settings</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">SEO Title Tag</label>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            id="admin-settings-save-btn"
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-neon-purple hover:bg-violet rounded-lg transition-colors shadow-[0_0_20px_rgba(157,78,221,0.3)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
