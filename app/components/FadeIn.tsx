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
  const directionOffset = 40;
  
  let initialY = 0;
  let initialX = 0;

  if (direction === 'up') initialY = directionOffset;
  if (direction === 'down') initialY = -directionOffset;
  if (direction === 'left') initialX = directionOffset;
  if (direction === 'right') initialX = -directionOffset;

  return (
    <motion.div
      initial={{ opacity: 0, y: initialY, x: initialX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: duration, delay: delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
