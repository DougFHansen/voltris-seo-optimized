'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  once?: boolean;
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.5,
  once = true,
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Detectar mobile para usar CSS em vez de framer-motion
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Intersection Observer para mobile (mais leve que whileInView)
  useEffect(() => {
    if (!isMobile || prefersReducedMotion || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isMobile, prefersReducedMotion, once, isVisible]);

  // No mobile, usar CSS transitions (mais leve)
  if (isMobile) {
    const initial = prefersReducedMotion ? {} : {
      opacity: 0,
      transform: direction === 'up' ? 'translateY(30px)' : direction === 'down' ? 'translateY(-30px)' : 'translateX(0)',
    };

    return (
      <div
        ref={ref}
        className={className}
        style={{
          transition: prefersReducedMotion ? 'none' : `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
          ...(isVisible ? { opacity: 1, transform: 'translateY(0) translateX(0)' } : initial)
        }}
      >
        {children}
      </div>
    );
  }

  // Desktop: usar framer-motion
  const initial = prefersReducedMotion ? {} : {
    opacity: 0,
    y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
    x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
  };

  const animate = {
    opacity: 1,
    y: 0,
    x: 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once, amount: 0.1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}