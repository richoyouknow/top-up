'use client';

import React from 'react';
import {
  MousePointerClick,
  ClipboardList,
  Send,
  Clock,
} from 'lucide-react';
import FadeIn from '@/app/components/FadeIn';

type HowToOrderItem = {
  title: string;
  desc: string;
};

interface LazyHowToOrderProps {
  howToOrderSteps: HowToOrderItem[];
}

export default function LazyHowToOrder({ howToOrderSteps }: LazyHowToOrderProps) {
  const stepIcons = [
    MousePointerClick,
    ClipboardList,
    Send,
    Clock,
    MousePointerClick,
    Send,
  ];

  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-dark-purple/30" id="cara-order">
      <FadeIn direction="up">
        <div className="text-center mb-12">
          <div className="text-[9px] font-bold text-neon-purple uppercase tracking-widest mb-1">Panduan Pembelian</div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">Cara Order</h2>
          <p className="text-gray-text text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Ikuti langkah-langkah mudah di bawah ini untuk mendapatkan item impian Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {howToOrderSteps.map((step, index) => {
            const IconComponent = stepIcons[index % stepIcons.length];
            return (
              <div key={index} className="premium-card rounded-xl p-6 flex flex-col gap-4 text-left h-full">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/15">
                    <span className="text-sm font-extrabold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-text text-[11px] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </section>
  );
}
