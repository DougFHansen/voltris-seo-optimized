"use client";

import React, { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  hue: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  // Configuration
  const config = {
    particleCount: { desktop: 80, mobile: 40 },
    connectionDistance: 150,
    mouseInfluenceRadius: 200,
    baseSpeed: 0.5,
    colors: {
      hueStart: 200,
      hueEnd: 280,
      saturation: 70,
      lightness: 50
    }
  };

  const createParticle = (width: number, height: number): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * config.baseSpeed,
      vy: (Math.random() - 0.5) * config.baseSpeed,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.6 + 0.4,
      targetOpacity: Math.random() * 0.6 + 0.4,
      hue: config.colors.hueStart + Math.random() * (config.colors.hueEnd - config.colors.hueStart)
    };
  };

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const count = isMobile ? config.particleCount.mobile : config.particleCount.desktop;
    particlesRef.current = Array.from({ length: count }, () => createParticle(width, height));
  }, []);

  const drawGradientMesh = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Create gradient mesh background
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    gradient.addColorStop(0, 'rgba(49, 168, 255, 0.05)');
    gradient.addColorStop(0.5, 'rgba(139, 49, 255, 0.03)');
    gradient.addColorStop(1, 'rgba(255, 75, 107, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const particles = particlesRef.current;
    
    particles.forEach((particle, i) => {
      // Update opacity smoothly
      particle.opacity += (particle.targetOpacity - particle.opacity) * 0.02;
      if (Math.abs(particle.targetOpacity - particle.opacity) < 0.01) {
        particle.targetOpacity = Math.random() * 0.5 + 0.2;
      }

      // Mouse interaction (parallax effect)
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < config.mouseInfluenceRadius) {
        const force = (config.mouseInfluenceRadius - distance) / config.mouseInfluenceRadius;
        particle.vx += (dx / distance) * force * 0.02;
        particle.vy += (dy / distance) * force * 0.02;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary check with bounce
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      // Speed limit
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > config.baseSpeed * 2) {
        particle.vx = (particle.vx / speed) * config.baseSpeed * 2;
        particle.vy = (particle.vy / speed) * config.baseSpeed * 2;
      }

      // Draw particle with glow
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      gradient.addColorStop(0, `hsla(${particle.hue}, ${config.colors.saturation}%, ${config.colors.lightness}%, ${particle.opacity})`);
      gradient.addColorStop(0.5, `hsla(${particle.hue}, ${config.colors.saturation}%, ${config.colors.lightness}%, ${particle.opacity * 0.3})`);
      gradient.addColorStop(1, `hsla(${particle.hue}, ${config.colors.saturation}%, ${config.colors.lightness}%, 0)`);
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const dist = Math.sqrt((particle.x - other.x) ** 2 + (particle.y - other.y) ** 2);
        
        if (dist < config.connectionDistance) {
          const opacity = (1 - dist / config.connectionDistance) * 0.15 * Math.min(particle.opacity, other.opacity);
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `hsla(${(particle.hue + other.hue) / 2}, ${config.colors.saturation}%, ${config.colors.lightness}%, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear and draw gradient mesh
    ctx.clearRect(0, 0, width, height);
    drawGradientMesh(ctx, width, height);

    // Draw particles
    drawParticles(ctx, width, height);

    animationRef.current = requestAnimationFrame(animate);
  }, [drawGradientMesh, drawParticles]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    
    initParticles(canvas.width, canvas.height);
  }, [initParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    initParticles(canvas.width, canvas.height);

    // Start animation
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initParticles, handleResize, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticleBackground;
