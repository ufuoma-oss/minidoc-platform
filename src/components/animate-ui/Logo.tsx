'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { MiniDocLogo3D } from '@/components/minidoc/icons/CustomIcons';

const sizes = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 44,
  xl: 56,
};

// Animation variants for the logo
const logoVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    rotateY: -15,
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      duration: 0.8,
    },
  },
};

export const Logo = ({
  draw = false,
  size = 'sm',
  className,
  containerClassName,
  ...props
}: {
  containerClassName?: string;
  draw?: boolean;
  size?: keyof typeof sizes;
} & Record<string, unknown>) => {
  // If draw is true, animate the logo entrance
  if (draw) {
    return (
      <motion.div 
        className={cn('relative', containerClassName)}
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          animate={{ 
            y: [0, -4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <MiniDocLogo3D 
            size={sizes[size]} 
            className={cn('text-neutral-900 dark:text-neutral-100', className)} 
            animated={true}
          />
        </motion.div>
        <span className="sr-only">Mini Doc</span>
      </motion.div>
    );
  }

  // Static version
  return (
    <div className={cn('relative', containerClassName)}>
      <MiniDocLogo3D 
        size={sizes[size]} 
        className={cn('text-neutral-900 dark:text-neutral-100', className)} 
      />
      <span className="sr-only">Mini Doc</span>
    </div>
  );
};
