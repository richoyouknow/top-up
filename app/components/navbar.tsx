'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, MessageSquare, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/cart-context';
import { getSettings } from '@/app/actions/setting';

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Katalog', href: '/catalog' },
  { name: 'Cara Order', href: '/#cara-order' },
  { name: 'FAQ', href: '/#faq' },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('/');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [whatsapp, setWhatsapp] = useState('6281234567890');
  
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSettings();
      if (data.whatsapp) {
        setWhatsapp(data.whatsapp);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname === '/') {
        const caraOrder = document.getElementById('cara-order');
        const faq = document.getElementById('faq');

        let newPath = '/';
        if (faq && faq.getBoundingClientRect().top < 300) {
          newPath = '/#faq';
        } else if (caraOrder && caraOrder.getBoundingClientRect().top < 300) {
          newPath = '/#cara-order';
        }

        setActivePath(prev => prev !== newPath ? newPath : prev);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    if (typeof window !== 'undefined') {
      handleScroll();
      if (pathname !== '/') {
        setActivePath(window.location.pathname + window.location.hash);
      }
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeIndex = navLinks.findIndex(link => link.href === activePath);
      if (activeIndex !== -1 && navRefs.current[activeIndex]) {
        const el = navRefs.current[activeIndex];
        setPillStyle({
          width: el?.offsetWidth || 0,
          left: el?.offsetLeft || 0,
          opacity: 1
        });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activePath]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    setActivePath(href);

    if (href === '/' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/');
      return;
    }

    if (href.startsWith('/#')) {
      if (pathname === '/') {
        e.preventDefault();
        const elementId = href.substring(2);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        window.history.replaceState(null, '', href);
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-3 bg-[#09080e]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            onClick={(e) => handleLinkClick(e, '/')}
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#13111b] border border-white/5 group-hover:border-neon-purple/50 transition-all duration-500 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7c3aed]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image 
                src="/logo.png" 
                alt="ChampionStore Logo" 
                width={34}
                height={34}
                className="relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white leading-tight">
                ChampionStore<span className="text-[#7c3aed]">.id</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest opacity-70 group-hover:text-[#7c3aed] transition-colors duration-300">
                Premium Topup
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center bg-[#13111b]/40 backdrop-blur-md px-1.5 py-1.5 rounded-full border border-white/5 gap-1 shadow-inner relative">
            <motion.div
              className="absolute top-1.5 bottom-1.5 bg-[#7c3aed]/20 rounded-full border border-[#7c3aed]/30 shadow-sm pointer-events-none z-0"
              initial={false}
              animate={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: pillStyle.opacity,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />

            {navLinks.map((link, index) => {
              const isActive = activePath === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  ref={(el) => { navRefs.current[index] = el; }}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="relative px-5 py-2 text-sm font-medium transition-colors duration-300 group z-10"
                >
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/cart"
              className="group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#13111b] border border-white/5 text-slate-200 hover:text-white hover:border-[#7c3aed]/40 transition-all duration-300"
            >
              <ShoppingBag className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold tracking-wide">Beli / Keranjang</span>
              <AnimatePresence mode="wait">
                {cartCount > 0 && (
                  <motion.span 
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="inline-flex min-w-5 h-5 px-1.5 items-center justify-center rounded-full bg-[#7c3aed] text-[10px] font-bold text-white shadow-lg shadow-[#7c3aed]/20"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <motion.a
              whileHover={{ scale: 1.02, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-sm font-bold text-white transition-all duration-300 shadow-lg shadow-[#7c3aed]/25 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <MessageSquare className="w-4 h-4" />
              <span>Hubungi Kami</span>
            </motion.a>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#13111b] border border-white/5 text-slate-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-wide">Beli</span>
              {cartCount > 0 && (
                <span className="inline-flex min-w-4.5 h-4.5 px-1 items-center justify-center rounded-full bg-[#7c3aed] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-[#13111b] border border-white/5 text-slate-400 focus:outline-none transition-colors active:bg-[#201b30]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t border-white/5 bg-[#09080e]/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-8 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activePath === link.href;
                return (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, link.href)}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <span className="font-bold text-base tracking-tight">{link.name}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2'}`} />
                    </Link>
                  </div>
                );
              })}
              
              <div className="mt-6 pt-6 border-t border-white/5">
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4.5 rounded-2xl bg-[#7c3aed] text-white font-bold text-sm shadow-xl shadow-[#7c3aed]/20 active:scale-[0.98] transition-all relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <MessageSquare className="w-5 h-5" />
                  Hubungi Admin WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
