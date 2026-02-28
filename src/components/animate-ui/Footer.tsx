'use client';

import { MotionEffect } from './effects/MotionEffect';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <MotionEffect
      slide={{ direction: 'down' }}
      fade
      zoom
      delay={1.6}
    >
      <div className="w-full">
        <div className="max-w-7xl mx-auto py-6">
          <div className="size-full px-4 md:px-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <p className="text-center text-sm text-muted-foreground">
              © {currentYear} Mini Doc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MotionEffect>
  );
};
