'use client';

import React from 'react';
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
  const directionOffset = 20; // Reduced from 40 to make the animation lighter and smoother
  
  let initialY = 0;
  let initialX = 0;

  if (direction === 'up') initialY = directionOffset;
  if (direction === 'down') initialY = -directionOffset;
  if (direction === 'left') initialX = directionOffset;
  if (direction === 'right') initialX = -directionOffset;

  const combinedClassName = `no-mobile-animate ${fullWidth ? 'w-full' : ''} ${className}`.trim();

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

