'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import FadeIn from '@/app/components/FadeIn';

type FaqItem = {
  question: string;
  answer: string;
};

interface LazyFaqProps {
  faqItems: FaqItem[];
}

export default function LazyFaq({ faqItems }: LazyFaqProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-dark-purple/30" id="faq">
      <FadeIn direction="up">
        <div className="text-center mb-12">
          <div className="text-[9px] font-bold text-neon-purple uppercase tracking-widest mb-1">Pertanyaan Umum</div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">FAQ</h2>
          <p className="text-gray-text text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Cari jawaban dari pertanyaan yang sering ditanyakan pelanggan kami.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="premium-card rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#1a1725] transition-colors duration-200"
              >
                <span className="text-sm font-bold text-white text-left">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-neon-purple flex-shrink-0 ml-4 transition-transform duration-300 ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeFaq === index && (
                <div className="px-6 py-4 border-t border-dark-purple/30 bg-[#13111b]/50">
                  <p className="text-gray-text text-[11px] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
