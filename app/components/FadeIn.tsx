'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
  fullWidth?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className = '',
  fullWidth = false,
}: FadeInProps) {
  const [isMobileOrLowEnd, setIsMobileOrLowEnd] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768 || (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsMobileOrLowEnd(isMobile || prefersReducedMotion);
  }, []);

  const directionOffset = 20; // Reduced from 40 to make the animation lighter and smoother
  
  let initialY = 0;
  let initialX = 0;

  if (direction === 'up') initialY = directionOffset;
  if (direction === 'down') initialY = -directionOffset;
  if (direction === 'left') initialX = directionOffset;
  if (direction === 'right') initialX = -directionOffset;

  const combinedClassName = `${fullWidth ? 'w-full' : ''} ${className}`.trim();

  // If mobile or reduced motion is active, render a plain static div to skip framer-motion scroll observers completely
  if (isMobileOrLowEnd) {
    return (
      <div className={combinedClassName}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: initialY, x: initialX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: duration, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      className={combinedClassName}
    >
      {children}
    </motion.div>
  );
}
