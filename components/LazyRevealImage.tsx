import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LazyRevealImageProps {
  src: string;
  placeholder?: string;
  alt?: string;
  className?: string;
  animationDurationMs?: number;
  onRevealEnd?: () => void;
}

interface InkBlob {
  x: number;
  y: number;
  baseSize: number;
  seed: number;
  delay: number;
}

// Strong ease-out: fast start, very slow finish
const easeOutStrong = (t: number): number => {
  return 1 - Math.pow(1 - t, 5);
};

// Smooth ease out - not too slow at the end
const easeOutWithSlowFinish = (t: number): number => {
  return 1 - Math.pow(1 - t, 3); // Power of 3 - gentler slowdown
};

// Generate random blobs
const generateBlobs = (count: number): InkBlob[] => {
  const blobs: InkBlob[] = [];
  
  for (let i = 0; i < count; i++) {
    blobs.push({
      x: 0.1 + Math.random() * 0.8,
      y: 0.1 + Math.random() * 0.8,
      baseSize: 0.12 + Math.random() * 0.18, // Smaller max size
      seed: Math.random() * 1000,
      delay: Math.random() * 0.15,
    });
  }
  
  // Coverage blobs
  blobs.push({ x: 0.15, y: 0.15, baseSize: 0.16, seed: Math.random() * 1000, delay: 0.05 });
  blobs.push({ x: 0.85, y: 0.15, baseSize: 0.17, seed: Math.random() * 1000, delay: 0.08 });
  blobs.push({ x: 0.15, y: 0.85, baseSize: 0.15, seed: Math.random() * 1000, delay: 0.1 });
  blobs.push({ x: 0.85, y: 0.85, baseSize: 0.16, seed: Math.random() * 1000, delay: 0.03 });
  blobs.push({ x: 0.5, y: 0.5, baseSize: 0.22, seed: Math.random() * 1000, delay: 0 });
  
  return blobs;
};

export function LazyRevealImage({
  src,
  placeholder,
  alt = 'Image',
  className = '',
  animationDurationMs = 6000,
  onRevealEnd,
}: LazyRevealImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenImgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const blobsRef = useRef<InkBlob[]>(generateBlobs(14));

  const drawBlobPath = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    seed: number,
    progress: number
  ) => {
    const points = 60;
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      
      const noise1 = Math.sin(angle * 3 + seed) * 0.18;
      const noise2 = Math.sin(angle * 7 + seed * 2.1) * 0.09;
      const noise3 = Math.sin(angle * 13 + seed * 3.7) * 0.04;
      
      const noiseAmount = 1 - progress * 0.6;
      const totalNoise = 1 + (noise1 + noise2 + noise3) * noiseAmount;
      
      const r = radius * totalNoise;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  };

  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const img = hiddenImgRef.current;
    const container = containerRef.current;
    if (!canvas || !img || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width) || 400;
    const height = Math.floor(rect.height) || 400;
    
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const maxDimension = Math.max(width, height);
    
    // Cap blob growth - don't let them escape too far
    const maxBlobRadius = maxDimension * 0.5;

    ctx.save();
    ctx.beginPath();

    blobsRef.current.forEach((blob) => {
      const delayedProgress = Math.max(0, (progress - blob.delay) / (1 - blob.delay));
      const easedProgress = easeOutWithSlowFinish(delayedProgress);
      
      if (easedProgress <= 0) return;

      const centerX = blob.x * width;
      const centerY = blob.y * height;
      
      // Capped radius - blobs don't grow beyond maxBlobRadius
      const targetRadius = easedProgress * maxDimension * blob.baseSize * 1.2;
      const radius = Math.min(targetRadius, maxBlobRadius);
      
      if (radius > 1) {
        drawBlobPath(ctx, centerX, centerY, radius, blob.seed, easedProgress);
      }
    });

    ctx.closePath();
    ctx.clip();

    // Draw image
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;
    
    let drawWidth, drawHeight, drawX, drawY;
    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      drawX = (width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      drawX = 0;
      drawY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(1, elapsed / animationDurationMs);

    drawFrame(progress);
    
    // Start fading in clean image at 70% progress
    if (progress > 0.7) {
      const fadeProgress = (progress - 0.7) / 0.3; // 0 to 1 over last 30%
      setOverlayOpacity(fadeProgress);
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsComplete(true);
      setOverlayOpacity(1);
      
      if (placeholderRef.current) {
        placeholderRef.current.style.opacity = '0';
      }
      
      onRevealEnd?.();
    }
  }, [animationDurationMs, onRevealEnd, drawFrame]);

  const handleImageLoad = useCallback(() => {
    if (!isLoaded) {
      setIsLoaded(true);
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isLoaded, animate]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`LRI_wrapper ${className}`}
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        width: '100%', 
        height: '100%',
      }}
    >
      {/* Hidden image for loading */}
      <img
        ref={hiddenImgRef}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />

      {/* Placeholder */}
      {placeholder && (
        <img 
          ref={placeholderRef}
          src={placeholder} 
          alt="" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            zIndex: 1,
            opacity: isComplete ? 0 : 1,
            transition: 'opacity 0.4s ease-out',
          }}
        />
      )}

      {/* Canvas for animated reveal */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          opacity: isLoaded ? 1 : 0,
        }}
      />

      {/* Overlay image - fades in smoothly during last part of animation */}
      {isLoaded && (
        <img
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 3,
            opacity: overlayOpacity,
            pointerEvents: isComplete ? 'auto' : 'none',
          }}
        />
      )}
    </div>
  );
}
