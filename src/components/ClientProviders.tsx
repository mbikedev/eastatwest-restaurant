'use client'

import dynamic from 'next/dynamic';

// Dynamically import heavy components that aren't needed immediately
const LightboxWrapper = dynamic(() => import('./LightboxWrapper'), {
  ssr: false,
  loading: () => null
});

const Toaster = dynamic(() => import('react-hot-toast').then(mod => ({ default: mod.Toaster })), {
  ssr: false,
  loading: () => null
});

const ScrollToTopButton = dynamic(() => import('./ScrollToTopButton'), {
  ssr: false,
  loading: () => null
});

export default function ClientProviders() {
  return (
    <>
      <ScrollToTopButton />
      <LightboxWrapper />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  );
} 