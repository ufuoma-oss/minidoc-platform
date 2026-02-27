'use client';

import * as React from 'react';
import {
  motion,
  type Variants,
  type HTMLMotionProps,
  useInView,
  type UseInViewOptions,
} from 'motion/react';

type SplittingTextProps = {
  text: string;
  type?: 'chars' | 'words';
  delay?: number;
  disableAnimation?: boolean;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  initial?: VariantProperties;
  animate?: VariantProperties;
  transition?: TransitionProperties;
  stagger?: number;
} & HTMLMotionProps<'span'>;

type VariantProperties = {
  x?: number;
  y?: number;
  opacity?: number;
  scale?: number;
  filter?: string;
};

type TransitionProperties = {
  duration?: number;
  ease?: string;
  delay?: number;
};

export const SplittingText = ({
  ref,
  text,
  type = 'chars',
  delay = 0,
  disableAnimation = false,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  initial,
  animate,
  transition,
  stagger,
  ...props
}: SplittingTextProps) => {
  const items = React.useMemo<React.ReactNode[]>(() => {
    if (type === 'words') {
      const tokens = text.match(/\S+\s*/g) || [];
      return tokens.map((token, i) => (
        <React.Fragment key={i}>{token}</React.Fragment>
      ));
    }

    return text
      .split('')
      .map((char, i) => <React.Fragment key={i}>{char}</React.Fragment>);
  }, [text, type]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay / 1000,
        staggerChildren: stagger ?? (type === 'chars' ? 0.05 : type === 'words' ? 0.2 : 0.3),
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      x: initial?.x ?? 150,
      y: initial?.y ?? 0,
      opacity: initial?.opacity ?? 0,
      scale: initial?.scale,
      filter: initial?.filter,
    },
    visible: {
      x: animate?.x ?? 0,
      y: animate?.y ?? 0,
      opacity: animate?.opacity ?? 1,
      scale: animate?.scale ?? 1,
      filter: animate?.filter ?? 'blur(0px)',
      transition: {
        duration: transition?.duration ?? 0.7,
        ease: transition?.ease ?? 'easeOut',
        delay: transition?.delay ?? 0,
      },
    },
  };

  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(
    ref as React.Ref<HTMLSpanElement>,
    () => localRef.current as HTMLSpanElement,
  );

  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  return (
    <motion.span
      ref={localRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={disableAnimation ? undefined : containerVariants}
      {...props}
    >
      {items.map((item, index) =>
        item && (
          <motion.span
            key={index}
            variants={disableAnimation ? undefined : itemVariants}
            style={{
              willChange: 'transform',
              display: 'inline-block',
              whiteSpace: type === 'chars' ? 'pre' : 'normal',
            }}
          >
            <>{item}</>
          </motion.span>
        )
      )}
    </motion.span>
  );
};
