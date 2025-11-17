'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Lazy load Framer Motion features to reduce initial bundle size
 * Uses domAnimation which is ~25KB instead of full animation features
 */
export default function LazyMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
