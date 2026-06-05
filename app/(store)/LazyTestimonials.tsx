'use client';

import React from 'react';
import { Star } from 'lucide-react';
import FadeIn from '@/app/components/FadeIn';

type TestimonialItem = {
  name: string;
  date: string;
  item: string;
  review: string;
  avatarText: string;
};

interface LazyTestimonialsProps {
  testimonialItems: TestimonialItem[];
}

export default function LazyTestimonials({ testimonialItems }: LazyTestimonialsProps) {
  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-dark-purple/30">
      <FadeIn direction="up">
        <div className="text-center mb-12">
          <div className="text-[9px] font-bold text-neon-purple uppercase tracking-widest mb-1">Kepuasan Pelanggan</div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">Testimoni Pelanggan</h2>
          <p className="text-gray-text text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Ribuan pelanggan puas telah membuktikan kualitas dan kepercayaan layanan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialItems.map((testimonial, index) => (
            <div key={index} className="premium-card rounded-xl p-6 flex flex-col gap-4 h-full">
              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-neon-purple text-neon-purple" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-text text-xs leading-relaxed flex-1 italic">
                &quot;{testimonial.review}&quot;
              </p>

              {/* Item Info */}
              <div className="pt-4 border-t border-dark-purple/30">
                <p className="text-[9px] font-bold text-neon-purple uppercase tracking-wider mb-1">
                  {testimonial.item}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-neon-purple">{testimonial.avatarText}</span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">{testimonial.name}</p>
                  <p className="text-[9px] text-gray-text">{testimonial.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
