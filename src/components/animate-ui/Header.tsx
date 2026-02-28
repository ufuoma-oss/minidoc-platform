'use client';

import { motion } from 'motion/react';
import { Logo } from './Logo';
import { useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';

const LOGO_WRAPPER_VARIANTS = {
  center: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  topLeft: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 'auto',
    height: 'auto',
  },
};

// Check if we're on the client
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const Header = ({ transition, onNavigate }: { transition: boolean; onNavigate?: (page: string) => void }) => {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  return (
    <motion.div
      variants={LOGO_WRAPPER_VARIANTS}
      initial="center"
      animate={transition ? 'topLeft' : 'center'}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className="absolute z-40 flex items-center justify-center"
    >
      <div className="relative max-w-7xl size-full">
        {transition ? (
          <motion.div
            layoutId="logo"
            className="absolute z-110 left-5"
            animate={{
              top: 16,
            }}
          >
            <button 
              className="flex items-end gap-2"
              onClick={() => onNavigate?.('home')}
            >
              <Logo size="md" />
              <span className="text-lg font-semibold text-foreground leading-none pb-0.5">Mini Doc</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            layoutId="logo"
            className="absolute z-110 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Logo size="xl" draw />
          </motion.div>
        )}

        <motion.div
          initial={{
            top: 16,
            right: -43,
            opacity: 0,
          }}
          animate={
            transition
              ? {
                  top: 16,
                  right: 20,
                  opacity: 1,
                }
              : {
                  top: 16,
                  right: -43,
                  opacity: 0,
                }
          }
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="absolute z-110 flex items-center gap-x-4"
        >
          {mounted && onNavigate && (
            <Button
              onClick={() => onNavigate('signin')}
              size="sm"
              className="rounded-full"
            >
              Sign In
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
