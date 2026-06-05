import React from 'react';
import dynamic from 'next/dynamic';
import HomeClient from './HomeClient';
import { getProducts } from '@/app/actions/product';
import { getSettings } from '@/app/actions/setting';
import { getCategories } from '@/app/actions/category';

// Dynamic imports for below-the-fold sections with Suspense
const LazyHowToOrder = dynamic(() => import('./LazyHowToOrder'), {
  loading: () => <div className="h-96 bg-[#09080e] animate-pulse" />,
  ssr: true,
});

const LazyFaq = dynamic(() => import('./LazyFaq'), {
  loading: () => <div className="h-96 bg-[#09080e] animate-pulse" />,
  ssr: true,
});

const LazyTestimonials = dynamic(() => import('./LazyTestimonials'), {
  loading: () => <div className="h-96 bg-[#09080e] animate-pulse" />,
  ssr: true,
});

interface PageProps {
  searchParams?: { category?: string; [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  // Fetch settings, products, and categories concurrently on the server side
  const [productsData, settingsData, categoriesData] = await Promise.all([
    getProducts(),
    getSettings(),
    getCategories(),
  ]);

  const DEFAULT_HOW_TO_ORDER = [
    { title: 'Pilih Produk', desc: 'Buka katalog lalu pilih item 8 Ball Pool yang ingin Anda beli.' },
    { title: 'Masuk Keranjang', desc: 'Klik tombol beli pada produk agar item masuk ke keranjang belanja.' },
    { title: 'Lanjut Checkout', desc: 'Dari halaman keranjang, klik lanjutkan ke checkout untuk proses pembayaran.' },
    { title: 'Isi Data Pemesan', desc: 'Masukkan nama, nomor WhatsApp aktif, UID game, dan catatan bila perlu.' },
    { title: 'Pilih Pembayaran', desc: 'Pilih QRIS atau transfer bank, lakukan pembayaran, lalu upload bukti transfer.' },
    { title: 'Kirim Konfirmasi', desc: 'Klik kirim konfirmasi, lalu Anda otomatis diarahkan ke WhatsApp admin untuk verifikasi.' },
  ];

  const DEFAULT_FAQS = [
    {
      question: 'Apakah pembelian item di sini aman dari resiko banned?',
      answer:
        'Ya, 100% aman. Kami menggunakan metode transfer koin teraman dan legal via Google Play untuk Cash. Kami juga memberikan garansi penuh untuk setiap transaksi Anda.'
    },
    {
      question: 'Berapa lama waktu proses setelah pengiriman data?',
      answer:
        'Rata-rata waktu proses kami berkisar antara 5 sampai 15 menit setelah data pemesanan diterima admin kami di WhatsApp. Untuk paket cash sultan paling lambat adalah 30 menit.'
    },
    {
      question: 'Apakah saya perlu memberikan login akun 8 Ball Pool saya?',
      answer:
        'Untuk koin (transfer koin), kami HANYA membutuhkan ID Unik (UID) akun Anda. Sedangkan untuk Top Up Cash atau suntik pieces tertentu, terkadang dibutuhkan detail login akun (Miniclip/Facebook/Google) demi kelancaran proses inject.'
    },
    {
      question: 'Metode pembayaran apa saja yang didukung?',
      answer:
        'Pembayaran dilakukan dengan cara transfer manual yang akan dikonfirmasi langsung oleh admin via WhatsApp. Kami mendukung transfer Bank lokal (BCA, Mandiri, BRI, BNI), QRIS, Gopay, OVO, Dana, dan ShopeePay.'
    }
  ];

  const DEFAULT_TESTIMONIALS = [
    {
      name: 'Muhammad Richo',
      date: 'Kemarin',
      review: 'Beli 1 Miliar Koin prosesnya super cepat, cuma nunggu 10 menit koin langsung masuk akun. Pelayanannya ramah banget, recommended seller!',
      avatarText: 'MR',
      item: '1 Billion Coins'
    },
    {
      name: 'Ahmad Fauzi',
      date: '2 hari lalu',
      review: 'Awalnya ragu beli Archangel Cue pieces di sini. Ternyata transaksinya sangat aman dan dipandu admin step-by-step. Keren store ini!',
      avatarText: 'AF',
      item: 'Archangel Pieces'
    },
    {
      name: 'Christian Wijaya',
      date: '5 hari lalu',
      review: 'Top up 5.000 cash sukses masuk akun tanpa kendala. Buka legendary boxes langsung unlock 2 cue baru. Terima kasih ChampionStore!',
      avatarText: 'CW',
      item: '5.000 Cash'
    }
  ];

  const howToOrderSteps = (() => {
    if (!settingsData.how_to_order) return DEFAULT_HOW_TO_ORDER;
    try {
      const parsed = JSON.parse(settingsData.how_to_order);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HOW_TO_ORDER;
    } catch {
      return DEFAULT_HOW_TO_ORDER;
    }
  })();

  const faqItems = (() => {
    if (!settingsData.faqs) return DEFAULT_FAQS;
    try {
      const parsed = JSON.parse(settingsData.faqs);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  })();

  const testimonialItems = (() => {
    if (!settingsData.testimonials) return DEFAULT_TESTIMONIALS;
    try {
      const parsed = JSON.parse(settingsData.testimonials);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  })();

  return (
    <>
      <HomeClient 
        initialProducts={productsData as any[]} 
        initialSettings={settingsData as Record<string, string>} 
        initialCategories={categoriesData as any[]}
      />
      
      {/* Lazy-loaded sections - only included in markup if data exists */}
      {howToOrderSteps.length > 0 && (
        <LazyHowToOrder howToOrderSteps={howToOrderSteps} />
      )}
      
      {faqItems.length > 0 && (
        <LazyFaq faqItems={faqItems} />
      )}
      
      {testimonialItems.length > 0 && (
        <LazyTestimonials testimonialItems={testimonialItems} />
      )}
    </>
  );
}

