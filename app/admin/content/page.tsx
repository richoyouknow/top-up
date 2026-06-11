"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Save,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  Star,
  Plus,
  Trash2,
  Loader2,
  Upload,
} from 'lucide-react';
import { getSettings, updateSettings } from '@/app/actions/setting';

type HowToOrderItem = {
  title: string;
  desc: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type TestimonialItem = {
  name: string;
  date: string;
  item: string;
  review: string;
  avatarText: string;
};

const DEFAULT_HOW_TO_ORDER: HowToOrderItem[] = [
  { title: 'Pilih Produk', desc: 'Buka katalog lalu pilih item 8 Ball Pool yang ingin Anda beli.' },
  { title: 'Masuk Keranjang', desc: 'Klik tombol beli pada produk agar item masuk ke keranjang belanja.' },
  { title: 'Lanjut Checkout', desc: 'Dari halaman keranjang, klik lanjutkan ke checkout untuk proses pembayaran.' },
  { title: 'Isi Data Pemesan', desc: 'Masukkan nama, nomor WhatsApp aktif, UID game, dan catatan bila perlu.' },
  { title: 'Pilih Pembayaran', desc: 'Pilih QRIS atau transfer bank, lakukan pembayaran, lalu upload bukti transfer.' },
  { title: 'Kirim Konfirmasi', desc: 'Klik kirim konfirmasi, lalu Anda otomatis diarahkan ke WhatsApp admin untuk verifikasi.' },
];

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'Apakah pembelian item di sini aman dari resiko banned?',
    answer:
      'Ya, 100% aman. Kami menggunakan metode transfer koin teraman dan legal via Google Play untuk Cash. Kami juga memberikan garansi penuh untuk setiap transaksi Anda.',
  },
  {
    question: 'Berapa lama waktu proses setelah pengiriman data?',
    answer:
      'Rata-rata waktu proses kami berkisar antara 5 sampai 15 menit setelah data pemesanan diterima admin kami di WhatsApp. Untuk paket cash sultan paling lambat adalah 30 menit.',
  },
  {
    question: 'Apakah saya perlu memberikan login akun 8 Ball Pool saya?',
    answer:
      'Untuk koin (transfer koin), kami HANYA membutuhkan ID Unik (UID) akun Anda. Sedangkan untuk Top Up Cash atau suntik pieces tertentu, terkadang dibutuhkan detail login akun (Miniclip/Facebook/Google) demi kelancaran proses inject.',
  },
  {
    question: 'Metode pembayaran apa saja yang didukung?',
    answer:
      'Pembayaran dilakukan dengan cara transfer manual yang akan dikonfirmasi langsung oleh admin via WhatsApp. Kami mendukung transfer Bank lokal (BCA, Mandiri, BRI, BNI), QRIS, Gopay, OVO, Dana, dan ShopeePay.',
  },
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Muhammad Richo',
    date: 'Kemarin',
    item: '1 Billion Coins',
    review:
      'Beli 1 Miliar Koin prosesnya super cepat, cuma nunggu 10 menit koin langsung masuk akun. Pelayanannya ramah banget, recommended seller!',
    avatarText: 'MR',
  },
  {
    name: 'Ahmad Fauzi',
    date: '2 hari lalu',
    item: 'Archangel Pieces',
    review:
      'Awalnya ragu beli Archangel Cue pieces di sini. Ternyata transaksinya sangat aman dan dipandu admin step-by-step. Keren store ini!',
    avatarText: 'AF',
  },
  {
    name: 'Christian Wijaya',
    date: '5 hari lalu',
    item: '5.000 Cash',
    review:
      'Top up 5.000 cash sukses masuk akun tanpa kendala. Buka legendary boxes langsung unlock 2 cue baru. Terima kasih ChampionStore!',
    avatarText: 'CW',
  },
];

function parseJsonSafely<T>(input: string | undefined, fallback: T): T {
  if (!input) return fallback;

  try {
    const parsed = JSON.parse(input);
    return parsed as T;
  } catch {
    return fallback;
  }
}

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState('Hero Section');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const [heroContent, setHeroContent] = useState({
    hero_title: 'Jual Item 8 Ball Pool Terpercaya',
    hero_subtitle:
      'Dapatkan Coins, Cash, Legendary Cue, Cue Pieces, dan item premium 8 Ball Pool dengan harga terbaik dan proses secepat kilat.',
    hero_buttonText: 'Lihat Produk',
    hero_badgeText: 'Toko Koin & Cues Terpercaya No. 1',
    hero_image1_url: '',
    hero_image1_label: 'Archangel',
    hero_image1_sublabel: 'Mythic Tier',
    hero_image2_url: '',
    hero_image2_label: 'Firestorm',
  });

  const [howToOrder, setHowToOrder] = useState<HowToOrderItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  const getSafeImageSrc = (src?: string | null, fallback = '/hero-cues.png') => {
    const value = (src ?? '').trim();
    if (!value) return fallback;
    
    // Convert old full URLs from championshop.id to relative paths for dev/prod compatibility
    if (value.includes('championshop.id/uploads/')) {
      return '/' + value.split('championshop.id/uploads/')[1];
    }
    
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `/${value.replace(/^\.?\//, '')}`;
  };

  async function fetchContent() {
    setIsLoading(true);
    const settings = await getSettings();

    setHeroContent({
      hero_title: settings.hero_title || settings.heroTitle || 'Jual Item 8 Ball Pool Terpercaya',
      hero_subtitle:
        settings.hero_subtitle ||
        settings.heroSubtitle ||
        'Dapatkan Coins, Cash, Legendary Cue, Cue Pieces, dan item premium 8 Ball Pool dengan harga terbaik dan proses secepat kilat.',
      hero_buttonText: settings.hero_buttonText || 'Lihat Produk',
      hero_badgeText: settings.hero_badgeText || 'Toko Koin & Cues Terpercaya No. 1',
      hero_image1_url: settings.hero_image1_url || '',
      hero_image1_label: settings.hero_image1_label || 'Archangel',
      hero_image1_sublabel: settings.hero_image1_sublabel || 'Mythic Tier',
      hero_image2_url: settings.hero_image2_url || '',
      hero_image2_label: settings.hero_image2_label || 'Firestorm',
    });

    const howToOrderRaw = parseJsonSafely<unknown[]>(settings.how_to_order, DEFAULT_HOW_TO_ORDER);
    const normalizedHowToOrder: HowToOrderItem[] = Array.isArray(howToOrderRaw)
      ? howToOrderRaw
          .map((entry) => {
            if (typeof entry === 'string') {
              return { title: 'Langkah', desc: entry };
            }

            const obj = entry as Partial<HowToOrderItem>;
            if (typeof obj.title === 'string' && typeof obj.desc === 'string') {
              return { title: obj.title, desc: obj.desc };
            }

            return null;
          })
          .filter((entry): entry is HowToOrderItem => Boolean(entry))
      : [];
    setHowToOrder(normalizedHowToOrder.length > 0 ? normalizedHowToOrder : DEFAULT_HOW_TO_ORDER);

    const faqRaw = parseJsonSafely<unknown[]>(settings.faqs, DEFAULT_FAQS);
    const normalizedFaqs: FaqItem[] = Array.isArray(faqRaw)
      ? faqRaw
          .map((entry) => {
            const obj = entry as Partial<FaqItem> & { q?: string; a?: string };
            const question = typeof obj.question === 'string' ? obj.question : typeof obj.q === 'string' ? obj.q : '';
            const answer = typeof obj.answer === 'string' ? obj.answer : typeof obj.a === 'string' ? obj.a : '';

            if (!question || !answer) return null;
            return { question, answer };
          })
          .filter((entry): entry is FaqItem => Boolean(entry))
      : [];
    setFaqs(normalizedFaqs.length > 0 ? normalizedFaqs : DEFAULT_FAQS);

    const testimonialsRaw = parseJsonSafely<unknown[]>(settings.testimonials, DEFAULT_TESTIMONIALS);
    const normalizedTestimonials: TestimonialItem[] = Array.isArray(testimonialsRaw)
      ? testimonialsRaw
          .map((entry) => {
            const obj = entry as Partial<TestimonialItem> & { content?: string };
            const review = typeof obj.review === 'string' ? obj.review : typeof obj.content === 'string' ? obj.content : '';

            if (!obj.name || !review) return null;

            return {
              name: obj.name,
              review,
              date: obj.date || 'Baru saja',
              item: obj.item || 'Pembelian item',
              avatarText: obj.avatarText || obj.name.slice(0, 2).toUpperCase(),
            };
          })
          .filter((entry): entry is TestimonialItem => Boolean(entry))
      : [];
    setTestimonials(normalizedTestimonials.length > 0 ? normalizedTestimonials : DEFAULT_TESTIMONIALS);

    setIsLoading(false);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchContent();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleUploadHeroImage = async (file: File | null, field: 'hero_image1_url' | 'hero_image2_url') => {
    if (!file) return;

    setIsUploading(field);

    try {
      const body = new FormData();
      body.append('file', file);

      const response = await fetch('/api/upload/hero-image', {
        method: 'POST',
        body,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || 'Gagal upload gambar.');
      }

      setHeroContent((prev) => ({
        ...prev,
        [field]: result.url,
      }));
    } catch (error: any) {
      alert(error.message || 'Gagal upload gambar.');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload: Record<string, string> = {
      ...heroContent,
      how_to_order: JSON.stringify(howToOrder),
      faqs: JSON.stringify(faqs),
      testimonials: JSON.stringify(testimonials),
    };

    const res = await updateSettings(payload);
    if (res.success) {
      alert('Konten berhasil disimpan!');
    } else {
      alert('Gagal menyimpan konten');
    }
    setIsSaving(false);
  };

  const addStep = () => setHowToOrder([...howToOrder, { title: '', desc: '' }]);
  const updateStep = (index: number, field: keyof HowToOrderItem, value: string) => {
    setHowToOrder((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };
  const removeStep = (index: number) => setHowToOrder(howToOrder.filter((_, i) => i !== index));

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    setFaqs((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));

  const addTestimonial = () =>
    setTestimonials([
      ...testimonials,
      { name: '', date: '', item: '', review: '', avatarText: '' },
    ]);
  const updateTestimonial = (index: number, field: keyof TestimonialItem, value: string) => {
    setTestimonials((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };
  const removeTestimonial = (index: number) =>
    setTestimonials(testimonials.filter((_, i) => i !== index));

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
        <h1 className="text-2xl font-bold tracking-tight text-white">Content Management</h1>
        <p className="text-neutral-400 mt-1">Manage texts, testimonials, and FAQ displayed on storefront.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 p-2 flex flex-col gap-1">
            {[
              { name: 'Hero Section', icon: ImageIcon },
              { name: 'How To Order', icon: MessageSquare },
              { name: 'FAQs', icon: HelpCircle },
              { name: 'Testimonials', icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                    activeTab === tab.name
                      ? 'bg-neon-purple/10 text-neon-purple'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 bg-[#0a0a0a] rounded-xl border border-neutral-800 p-6">
          <div className="border-b border-neutral-800 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">{activeTab} Settings</h2>
              <p className="text-sm text-neutral-400 mt-1">
                Update the content displayed in the {activeTab.toLowerCase()} section.
              </p>
            </div>
            {(activeTab === 'How To Order' || activeTab === 'FAQs' || activeTab === 'Testimonials') && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'How To Order') addStep();
                  if (activeTab === 'FAQs') addFaq();
                  if (activeTab === 'Testimonials') addTestimonial();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg transition-colors border border-neutral-700"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'Hero Section' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Badge Text (Top Left)</label>
                      <input
                        type="text"
                        value={heroContent.hero_badgeText}
                        onChange={(e) => setHeroContent({ ...heroContent, hero_badgeText: e.target.value })}
                        className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Main Title</label>
                      <textarea
                        rows={2}
                        value={heroContent.hero_title}
                        onChange={(e) => setHeroContent({ ...heroContent, hero_title: e.target.value })}
                        className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Subtitle / Description</label>
                      <textarea
                        rows={3}
                        value={heroContent.hero_subtitle}
                        onChange={(e) => setHeroContent({ ...heroContent, hero_subtitle: e.target.value })}
                        className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Primary Button Text</label>
                      <input
                        type="text"
                        value={heroContent.hero_buttonText}
                        onChange={(e) => setHeroContent({ ...heroContent, hero_buttonText: e.target.value })}
                        className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-[#111] rounded-xl border border-neutral-800 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Hero Card 1 (Front)</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Main Label</label>
                          <input
                            type="text"
                            value={heroContent.hero_image1_label}
                            onChange={(e) => setHeroContent({ ...heroContent, hero_image1_label: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple"
                            placeholder="e.g. Archangel"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Sub Label</label>
                          <input
                            type="text"
                            value={heroContent.hero_image1_sublabel}
                            onChange={(e) => setHeroContent({ ...heroContent, hero_image1_sublabel: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple"
                            placeholder="e.g. Mythic Tier"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Image (PNG recommended)</label>
                        <div className="flex gap-4 items-start">
                          <div className="relative w-20 h-20 rounded-lg bg-[#0a0a0a] border border-neutral-800 overflow-hidden flex-shrink-0">
                            <Image
                              src={getSafeImageSrc(heroContent.hero_image1_url, '/cues/archangel.png')}
                              alt="Preview 1"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-neutral-800 rounded-lg hover:border-neon-purple transition-colors cursor-pointer group">
                            {isUploading === 'hero_image1_url' ? (
                              <Loader2 className="w-5 h-5 text-neon-purple animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-neutral-500 group-hover:text-neon-purple" />
                                <span className="text-[10px] text-neutral-500 group-hover:text-neon-purple mt-1">Upload Card 1</span>
                              </>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleUploadHeroImage(e.target.files?.[0] || null, 'hero_image1_url')}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#111] rounded-xl border border-neutral-800 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Hero Card 2 (Back)</span>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Main Label</label>
                        <input
                          type="text"
                          value={heroContent.hero_image2_label}
                          onChange={(e) => setHeroContent({ ...heroContent, hero_image2_label: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple"
                          placeholder="e.g. Firestorm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Image (PNG recommended)</label>
                        <div className="flex gap-4 items-start">
                          <div className="relative w-20 h-20 rounded-lg bg-[#0a0a0a] border border-neutral-800 overflow-hidden flex-shrink-0">
                            <Image
                              src={getSafeImageSrc(heroContent.hero_image2_url, '/cues/firestorm.png')}
                              alt="Preview 2"
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-neutral-800 rounded-lg hover:border-neon-purple transition-colors cursor-pointer group">
                            {isUploading === 'hero_image2_url' ? (
                              <Loader2 className="w-5 h-5 text-neon-purple animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-neutral-500 group-hover:text-neon-purple" />
                                <span className="text-[10px] text-neutral-500 group-hover:text-neon-purple mt-1">Upload Card 2</span>
                              </>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleUploadHeroImage(e.target.files?.[0] || null, 'hero_image2_url')}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'How To Order' && (
              <div className="space-y-4">
                {howToOrder.length === 0 && (
                  <p className="text-center py-10 text-neutral-500 text-sm italic">
                    No steps added yet. Click &quot;Add Item&quot; to start.
                  </p>
                )}
                {howToOrder.map((step, index) => (
                  <div key={index} className="bg-[#111] p-4 rounded-xl border border-neutral-800 space-y-3 relative group">
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="absolute top-2 right-2 p-2 text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-[11px] font-bold text-neon-purple uppercase tracking-wider">
                      Langkah {index + 1}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Judul Step</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                        placeholder="Contoh: Pilih Produk"
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Deskripsi Step</label>
                      <textarea
                        rows={2}
                        value={step.desc}
                        onChange={(e) => updateStep(index, 'desc', e.target.value)}
                        placeholder="Deskripsi langkah..."
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'FAQs' && (
              <div className="space-y-6">
                {faqs.length === 0 && (
                  <p className="text-center py-10 text-neutral-500 text-sm italic">
                    No FAQs added yet. Click &quot;Add Item&quot; to start.
                  </p>
                )}
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-[#111] p-4 rounded-xl border border-neutral-800 space-y-4 relative group">
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="absolute top-2 right-2 p-2 text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        placeholder="Enter question..."
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Answer</label>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        placeholder="Enter answer..."
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Testimonials' && (
              <div className="space-y-6">
                {testimonials.length === 0 && (
                  <p className="text-center py-10 text-neutral-500 text-sm italic">
                    No testimonials added yet. Click &quot;Add Item&quot; to start.
                  </p>
                )}
                {testimonials.map((testi, index) => (
                  <div key={index} className="bg-[#111] p-4 rounded-xl border border-neutral-800 space-y-4 relative group">
                    <button
                      type="button"
                      onClick={() => removeTestimonial(index)}
                      className="absolute top-2 right-2 p-2 text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Nama Pelanggan</label>
                        <input
                          type="text"
                          value={testi.name}
                          onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                          placeholder="Contoh: Ahmad Fauzi"
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Inisial Avatar</label>
                        <input
                          type="text"
                          value={testi.avatarText}
                          onChange={(e) => updateTestimonial(index, 'avatarText', e.target.value.toUpperCase())}
                          placeholder="Contoh: AF"
                          maxLength={3}
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Label Item Dibeli</label>
                        <input
                          type="text"
                          value={testi.item}
                          onChange={(e) => updateTestimonial(index, 'item', e.target.value)}
                          placeholder="Contoh: Archangel Pieces"
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Waktu</label>
                        <input
                          type="text"
                          value={testi.date}
                          onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                          placeholder="Contoh: 2 hari lalu"
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Isi Testimoni</label>
                      <textarea
                        rows={3}
                        value={testi.review}
                        onChange={(e) => updateTestimonial(index, 'review', e.target.value)}
                        placeholder="Apa kata pelanggan?"
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-6 border-t border-neutral-800 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-neon-purple hover:bg-violet rounded-lg transition-colors shadow-[0_0_15px_rgba(157,78,221,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
