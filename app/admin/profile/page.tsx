"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  User, Lock, Save, Loader2, AlertCircle, CheckCircle2
} from 'lucide-react';
import { getAdminProfile, updateAdminProfile } from '@/app/actions/auth';

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'password') {
      setActiveTab('password');
    }
    fetchProfile();
  }, [searchParams]);

  const fetchProfile = async () => {
    setIsLoading(true);
    const profile = await getAdminProfile();
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        username: profile.username
      }));
    }
    setIsLoading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await updateAdminProfile({
      name: formData.name,
      username: formData.username
    });

    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Update local storage
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      localStorage.setItem('adminUser', JSON.stringify({ ...user, name: formData.name, username: formData.username }));
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update profile' });
    }
    setIsSaving(false);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const res = await updateAdminProfile({
      name: formData.name,
      username: formData.username,
      password: formData.newPassword
    });

    if (res.success) {
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to change password' });
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Admin Profile</h1>
        <p className="text-neutral-400 mt-1">Manage your account information and security settings.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
            : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
        <div className="flex border-b border-neutral-800">
          <button 
            onClick={() => {
              setActiveTab('profile');
              router.push('/admin/profile');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'profile' ? 'text-neon-purple border-b-2 border-neon-purple bg-neon-purple/5' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <User className="w-4 h-4" />
            General Info
          </button>
          <button 
            onClick={() => {
              setActiveTab('password');
              router.push('/admin/profile?tab=password');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'password' ? 'text-neon-purple border-b-2 border-neon-purple bg-neon-purple/5' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            Security
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Display Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple"
                  placeholder="admin"
                  required
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-neon-purple hover:bg-violet text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(157,78,221,0.3)] disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSavePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">New Password</label>
                <input 
                  type="password" 
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Confirm New Password</label>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-neon-purple hover:bg-violet text-white font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(157,78,221,0.3)] disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
