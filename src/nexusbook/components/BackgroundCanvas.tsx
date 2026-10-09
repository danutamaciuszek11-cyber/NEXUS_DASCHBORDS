import React, { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  primaryColor?: string;
  showParticles?: boolean;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({
  primaryColor = '#00f0ff',
  showParticles = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes setup
    const particleCount = showParticles ? 50 : 0;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2
    }));

    // Data beams setup
    const beams = Array.from({ length: 6 }).map(() => ({
      y: Math.random() * height,
      x: Math.random() * width,
      speed: Math.random() * 3 + 1.5,
      length: Math.random() * 150 + 80,
      color: primaryColor
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let gridOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Dark background with subtle gradient
      const bgGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        100,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, 'rgba(12, 18, 32, 0.95)');
      bgGrad.addColorStop(0.5, 'rgba(8, 12, 22, 0.98)');
      bgGrad.addColorStop(1, 'rgba(3, 5, 10, 1.0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Procedural cyber grid lines
      gridOffset = (gridOffset + 0.2) % 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = gridOffset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Animated horizontal data beams
      beams.forEach((beam) => {
        beam.x += beam.speed;
        if (beam.x > width + beam.length) {
          beam.x = -beam.length;
          beam.y = Math.random() * height;
        }

        const beamGrad = ctx.createLinearGradient(
          beam.x - beam.length,
          beam.y,
          beam.x,
          beam.y
        );
        beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        beamGrad.addColorStop(0.7, primaryColor);
        beamGrad.addColorStop(1, '#ffffff');

        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(beam.x - beam.length, beam.y);
        ctx.lineTo(beam.x, beam.y);
        ctx.stroke();

        // Glowing node at head of beam
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(beam.x, beam.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Interactive Particles & Connecting Lines
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.fillStyle = primaryColor;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = primaryColor;
            ctx.globalAlpha = (1 - dist / 110) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [primaryColor, showParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
