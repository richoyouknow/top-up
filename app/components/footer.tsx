'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, MessageSquare, ShieldCheck, Zap, Heart } from 'lucide-react';
import { getSettings } from '@/app/actions/setting';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<Record<string, string>>({
    whatsapp: '6281234567890',
    instagram: '',
    facebook: '',
    tiktok: '',
  });

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSettings();
      if (Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    }
    fetchSettings();
  }, []);

  const getSocialUrl = (url: string, fallback: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
  };

  return (
    <footer className="w-full bg-[#0a090f] border-t border-dark-purple/35 pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mb-12">
          
          {/* BRAND COLUMN */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-max group">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#13111b] border border-dark-purple group-hover:border-neon-purple transition-all duration-300 overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="ChampionStore Logo" 
                  fill 
                  style={{ objectFit: 'contain' }} 
                  className="p-1"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                ChampionStore<span className="text-neon-purple">.id</span>
              </span>
            </Link>
            <p className="text-gray-text text-sm max-w-sm leading-relaxed">
              Penyedia item game 8 Ball Pool terlengkap dan paling terpercaya di Indonesia. Dapatkan Coins, Cash, Legendary Cues, dan Bundles dengan harga terbaik, proses secepat kilat, dan jaminan keamanan 100%.
            </p>
            
            {/* TRUST BADGES */}
            <div className="flex items-center gap-3.5 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#13111b] border border-dark-purple">
                <ShieldCheck className="w-4 h-4 text-neon-purple" />
                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">100% Aman</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#13111b] border border-dark-purple">
                <Zap className="w-4 h-4 text-neon-purple" />
                <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Proses Instan</span>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Navigasi</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/" className="text-gray-text text-sm hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-text text-sm hover:text-white transition-colors duration-200">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/#cara-order" className="text-gray-text text-sm hover:text-white transition-colors duration-200">
                  Cara Pemesanan
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-text text-sm hover:text-white transition-colors duration-200">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIAL MEDIA / CONTACT */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Hubungi Kami</h3>
            <p className="text-gray-text text-sm leading-relaxed">
              Kami aktif setiap hari untuk melayani pesanan dan pertanyaan Anda. Hubungi kami melalui sosial media kami:
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#13111b] border border-dark-purple text-gray-text hover:text-white hover:border-neutral-700/60 transition-all duration-200"
                aria-label="WhatsApp Admin"
              >
                <MessageSquare className="w-4.5 h-4.5" />
              </a>
              {settings.instagram && (
                <a
                  href={getSocialUrl(settings.instagram, 'https://instagram.com')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#13111b] border border-dark-purple text-gray-text hover:text-white hover:border-neutral-700/60 transition-all duration-200"
                  aria-label="Instagram Page"
                >
                  <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {settings.tiktok && (
                <a
                  href={getSocialUrl(settings.tiktok, 'https://tiktok.com')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#13111b] border border-dark-purple text-gray-text hover:text-white hover:border-neutral-700/60 transition-all duration-200"
                  aria-label="TikTok Page"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.78-.22-.22-.43-.47-.62-.73v7.02c0 3.11-1.87 6.07-4.91 6.84-2.83.75-6.02-.45-7.39-3.08-1.57-2.86-.54-6.78 2.22-8.38 1.48-.87 3.25-1.12 4.93-.81v4.04c-1.22-.38-2.61-.16-3.6.61-.92.68-1.34 1.88-1.07 3 .32 1.34 1.6 2.37 2.98 2.33 1.51-.01 2.76-1.27 2.76-2.78V.02z" />
                  </svg>
                </a>
              )}
              {settings.facebook && (
                <a
                  href={getSocialUrl(settings.facebook, 'https://facebook.com')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#13111b] border border-dark-purple text-gray-text hover:text-white hover:border-neutral-700/60 transition-all duration-200"
                  aria-label="Facebook Page"
                >
                  <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

        </div>

        <div className="h-px bg-dark-purple/35 mb-8"></div>

        {/* COPYRIGHT & CREDITS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-text text-xs text-center md:text-left">
            &copy; {currentYear} ChampionStore.id. Hak Cipta Dilindungi.
          </p>
          <p className="text-gray-text text-xs flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-neon-purple fill-neon-purple animate-pulse" /> untuk 8 Ball Pool Gamers di Indonesia.
          </p>
        </div>

      </div>
    </footer>
  );
}
