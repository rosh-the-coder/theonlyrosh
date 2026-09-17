'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  isActive: boolean;
}

// Particle class
class Particle {
  hue: number = 0;
  alpha: number = 0;
  size: number = 0;
  x: number = 0;
  y: number = 0;
  velocity: number = 0;
  changed: boolean | null = null;
  changedFrame: number = 0;
  maxChangedFrames: number = 50;

  init(width: number, height: number, hue: number) {
    this.hue = hue;
    this.alpha = 0;
    this.size = this.random(1, 5);
    this.x = this.random(0, width);
    this.y = this.random(0, height);
    this.velocity = this.size * 0.5;
    this.changed = null;
    this.changedFrame = 0;
    return this;
  }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  update(point: { x: number; y: number }) {
    if (this.changed) {
      this.alpha *= 0.92;
      this.size += 2;
      this.changedFrame++;
      if (this.changedFrame > this.maxChangedFrames) {
        this.reset();
      }
    } else if (this.distance(point.x, point.y) < 50) {
      this.changed = true;
      this.alpha = 1;
    } else {
      this.alpha *= 0.95;
    }
  }

  distance(x: number, y: number) {
    return Math.hypot(x - this.x, y - this.y);
  }

  reset() {
    this.changed = false;
    this.changedFrame = 0;
    this.alpha = 0;
  }
}

export default function ParticleBackground({ isActive }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const pointRef = useRef({ x: 0, y: 0 });
  const hueRef = useRef(0);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { random, atan2, cos, sin, hypot } = Math;
    const max = 200;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let point = pointRef.current = { x: width / 2, y: height / 2 };
    let hue = hueRef.current = 0;
    const particles: Particle[] = particlesRef.current = [];

    // Create particles
    for (let i = 0; i < max; i++) {
      particles.push(new Particle().init(width, height, hue));
    }

    function animate() {
      if (!ctx) return;
      ctx.fillStyle = `rgba(0,0,0, .2)`;
      ctx.fillRect(0, 0, width, height);
      particles.forEach((p) => {
        p.draw(ctx);
        p.update(point);
      });
      hue += 0.3;
      animationRef.current = window.requestAnimationFrame(animate);
    }

    function touches(e: MouseEvent | TouchEvent) {
      if ('touches' in e) {
        point.x = e.touches[0].clientX;
        point.y = e.touches[0].clientY;
      } else {
        point.x = e.clientX;
        point.y = e.clientY;
      }
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    // Start animation
    animate();

    // Event listeners
    window.addEventListener('mousemove', touches);
    window.addEventListener('touchmove', touches);
    window.addEventListener('resize', resize);

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', touches);
      window.removeEventListener('touchmove', touches);
      window.removeEventListener('resize', resize);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'auto'
      }}
    />
  );
}