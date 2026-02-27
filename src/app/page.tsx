'use client';

import React, { useState, useSyncExternalStore, useCallback } from 'react';
import { Header, Hero, Features, Footer } from '@/components/animate-ui';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import SignIn from '@/components/minidoc/auth/SignIn';
import Dashboard from '@/components/minidoc/dashboard/Dashboard';
import { getSession } from '@/lib/minidoc/storage';

// Check if we're on the client
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const CONTENT_VARIANTS = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 30 },
  },
} as const;

export default function Home() {
  const [page, setPage] = useState('home');
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const [transition, setTransition] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleNavigate = useCallback((targetPage: string) => {
    if (targetPage === 'signin') {
      const user = getSession();
      if (user) {
        setPage('dashboard');
        return;
      }
    }
    setPage(targetPage);
    window.scrollTo(0, 0);
  }, []);

  // Landing page animation timing
  React.useEffect(() => {
    const timer = setTimeout(() => setTransition(true), 1250);
    const timer2 = setTimeout(() => setIsLoaded(true), 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black/30 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show animated landing page
  if (page === 'home') {
    return (
      <main className={cn('relative h-dvh', !isLoaded && 'overflow-y-hidden')}>
        <Header transition={transition} onNavigate={handleNavigate} />

        <div className="h-dvh w-full flex flex-col justify-between bg-white">
          {transition && (
            <>
              <div>
                <motion.div
                  variants={CONTENT_VARIANTS}
                  initial="hidden"
                  animate={transition ? 'visible' : 'hidden'}
                  className="w-full"
                >
                  <Hero key={String(transition)} onNavigate={handleNavigate} />
                </motion.div>

              <Features onNavigate={handleNavigate} />
              </div>

              <Footer />
            </>
          )}
        </div>
      </main>
    );
  }

  // Sign in page
  if (page === 'signin') {
    return (
      <div className="min-h-screen bg-white">
        <main className="min-h-screen bg-white font-sans">
          <SignIn onNavigate={handleNavigate} />
        </main>
      </div>
    );
  }

  // Dashboard page
  if (page === 'dashboard') {
    return (
      <div className="h-screen bg-white overflow-hidden">
        <main className="h-screen bg-white font-sans overflow-hidden">
          <Dashboard onSignOut={() => setPage('home')} />
        </main>
      </div>
    );
  }

  return null;
}
