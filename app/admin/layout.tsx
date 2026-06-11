"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  Search,
  X,
  User,
  Lock,
  ArrowRight,
  Globe
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Produk', href: '/admin/products', icon: Package },
  { name: 'Kategori', href: '/admin/categories', icon: LayoutDashboard },
  { name: 'Pesanan', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Keuangan', href: '/admin/cashflow', icon: DollarSign },
  { name: 'Konten', href: '/admin/content', icon: FileText },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
  { name: 'Lihat Toko', href: '/', icon: Globe },
];

import { login } from '@/app/actions/auth';
import { getPendingOrdersCount } from '@/app/actions/order';

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await login(username, password);
    if (res.success) {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify(res.admin));
      onLogin();
    } else {
      setError(res.error || 'Username atau password salah');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mb-4 border border-neon-purple/30 shadow-[0_0_15px_rgba(157,78,221,0.2)]">
            <Lock className="w-6 h-6 text-neon-purple" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portal Admin</h1>
          <p className="text-neutral-400 text-sm mt-1">Masuk untuk mengelola toko Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
              placeholder="Masukkan username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Kata Sandi</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-neon-purple hover:bg-violet text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(157,78,221,0.3)] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Masuk
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-neutral-500 hover:text-white transition-colors">
            &larr; Kembali ke Toko
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Check auth on mount
    const authStatus = localStorage.getItem('adminAuth');
    const userData = localStorage.getItem('adminUser');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (userData) setAdminUser(JSON.parse(userData));
    }
    setIsCheckingAuth(false);
    
    // Fetch pending orders count
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const count = await getPendingOrdersCount();
    setPendingOrders(count);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => {
      const authStatus = localStorage.getItem('adminAuth');
      const userData = localStorage.getItem('adminUser');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
        if (userData) setAdminUser(JSON.parse(userData));
      }
    }} />;
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0a0a] border-r border-neutral-800">
        <div className="p-6 flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded bg-[#13111b] border border-white/5 overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill
              sizes="40px"
              style={{ objectFit: 'contain' }}
              className="p-1"
            />
          </div>
          <span className="font-bold text-xl tracking-tight">AdminPanel</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin' && item.href !== '/');
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-neon-purple/10 text-neon-purple' 
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-neutral-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-64 max-w-sm bg-[#0a0a0a] h-full flex flex-col border-r border-neutral-800 shadow-2xl">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded bg-[#13111b] border border-white/5 overflow-hidden">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill
                    sizes="40px"
                    style={{ objectFit: 'contain' }}
                    className="p-1"
                  />
                </div>
                <span className="font-bold text-xl tracking-tight">AdminPanel</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin' && item.href !== '/');
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-neon-purple/10 text-neon-purple' : 'text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-neutral-800">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] border-b border-neutral-800 z-10">
          <div className="flex items-center flex-1">
            <button 
              className="md:hidden mr-4 text-neutral-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center max-w-md w-full relative">
              <Search className="w-4 h-4 absolute left-3 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Cari sesuatu..." 
                className="w-full bg-[#111] border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <Link 
              href="/admin/orders" 
              className="relative text-neutral-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#0a0a0a] text-[10px] flex items-center justify-center font-bold text-white">
                  {pendingOrders}
                </span>
              )}
            </Link>
            
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-8 w-8 rounded-full bg-gradient-to-tr from-neon-purple to-purple-400 flex items-center justify-center overflow-hidden border border-neutral-700 cursor-pointer shadow-[0_0_10px_rgba(157,78,221,0.3)] transition-transform active:scale-95"
              >
                <User className="w-4 h-4 text-white" />
              </div>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-neutral-800 mb-1">
                      <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Admin'}</p>
                      <p className="text-[10px] text-neutral-500 truncate">@{adminUser?.username || 'admin'}</p>
                    </div>
                    <Link 
                      href="/admin/profile" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      Lihat Profil
                    </Link>
                    <Link 
                      href="/admin/profile?tab=password" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Ubah Kata Sandi
                    </Link>
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#050505] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
