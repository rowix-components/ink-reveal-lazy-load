import React, { useState, useRef, useEffect, useCallback, CSSProperties } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type EasingFunction = 'easeOut' | 'easeOutStrong' | 'easeInOut' | 'linear' | 'easeOutElastic' | 'easeOutBounce';
export type RevealPattern = 'random' | 'center' | 'corners' | 'spiral' | 'wave' | 'explosion';
export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export interface InkBlob {
  x: number;
  y: number;
  baseSize: number;
  seed: number;
  delay: number;
}

export interface InkRevealImageProps {
  /** Image source URL (required) */
  src: string;
  
  /** Alt text for accessibility */
  alt?: string;
  
  /** Low-res placeholder image URL */
  placeholder?: string;
  
  /** Additional CSS class for the container */
  className?: string;
  
  /** Inline styles for the container */
  style?: CSSProperties;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ANIMATION SETTINGS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Animation duration in milliseconds (default: 2500) */
  duration?: number;
  
  /** Easing function for blob growth (default: 'easeOut') */
  easing?: EasingFunction;
  
  /** Delay before animation starts in ms (default: 0) */
  delay?: number;
  
  /** Whether to start animation when element enters viewport (default: true) */
  triggerOnViewport?: boolean;
  
  /** Viewport threshold 0-1 for triggering animation (default: 0.1) */
  viewportThreshold?: number;
  
  /** Root margin for intersection observer (default: '0px') */
  viewportRootMargin?: string;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // BLOB SETTINGS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Number of ink blobs (default: 14) */
  blobCount?: number;
  
  /** Minimum blob size as fraction of container (default: 0.12) */
  blobSizeMin?: number;
  
  /** Maximum blob size as fraction of container (default: 0.30) */
  blobSizeMax?: number;
  
  /** Blob edge roughness/noise amount 0-1 (default: 0.3) */
  blobRoughness?: number;
  
  /** Number of points defining blob shape (default: 60) */
  blobComplexity?: number;
  
  /** Maximum stagger delay between blobs (default: 0.15) */
  blobStagger?: number;
  
  /** Reveal pattern preset (default: 'random') */
  pattern?: RevealPattern;
  
  /** Custom blob positions array [{x: 0-1, y: 0-1}, ...] */
  customBlobs?: Array<{ x: number; y: number; size?: number; delay?: number }>;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // VISUAL SETTINGS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Object-fit for the image (default: 'cover') */
  objectFit?: ObjectFit;
  
  /** Object-position for the image (default: 'center') */
  objectPosition?: string;
  
  /** Background color while loading (default: '#e5e7eb') */
  backgroundColor?: string;
  
  /** Placeholder blur amount in pixels (default: 20) */
  placeholderBlur?: number;
  
  /** When to start fading in final image 0-1 (default: 0.7) */
  fadeInStart?: number;
  
  /** Whether to show a loading spinner (default: false) */
  showLoader?: boolean;
  
  /** Custom loader component */
  loader?: React.ReactNode;
  
  /** Border radius for the container */
  borderRadius?: string | number;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // CALLBACKS
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Called when image starts loading */
  onLoadStart?: () => void;
  
  /** Called when image finishes loading (before animation) */
  onLoad?: () => void;
  
  /** Called when reveal animation starts */
  onRevealStart?: () => void;
  
  /** Called with progress updates 0-1 during animation */
  onProgress?: (progress: number) => void;
  
  /** Called when reveal animation completes */
  onRevealComplete?: () => void;
  
  /** Called if image fails to load */
  onError?: (error: Event) => void;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // ADVANCED
  // ─────────────────────────────────────────────────────────────────────────────
  
  /** Enable high DPI canvas rendering (default: true) */
  highDPI?: boolean;
  
  /** Disable animation and show image immediately (default: false) */
  disableAnimation?: boolean;
  
  /** CORS setting for the image (default: 'anonymous') */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  
  /** Whether component is paused (stops animation) */
  paused?: boolean;
  
  /** Force re-trigger animation */
  animationKey?: string | number;
  
  /** Aria label for accessibility */
  ariaLabel?: string;
  
  /** Aria describedby for accessibility */
  ariaDescribedBy?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeOutStrong: (t) => 1 - Math.pow(1 - t, 5),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

const generateBlobsForPattern = (
  count: number,
  pattern: RevealPattern,
  sizeMin: number,
  sizeMax: number,
  stagger: number,
  customBlobs?: Array<{ x: number; y: number; size?: number; delay?: number }>
): InkBlob[] => {
  if (customBlobs && customBlobs.length > 0) {
    return customBlobs.map((b, i) => ({
      x: b.x,
      y: b.y,
      baseSize: b.size ?? sizeMin + Math.random() * (sizeMax - sizeMin),
      seed: Math.random() * 1000,
      delay: b.delay ?? (i / customBlobs.length) * stagger,
    }));
  }

  const blobs: InkBlob[] = [];
  const sizeRange = sizeMax - sizeMin;

  switch (pattern) {
    case 'center':
      // Blobs emanate from center
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const dist = 0.1 + Math.random() * 0.4;
        blobs.push({
          x: 0.5 + Math.cos(angle) * dist,
          y: 0.5 + Math.sin(angle) * dist,
          baseSize: sizeMin + Math.random() * sizeRange,
          seed: Math.random() * 1000,
          delay: dist * stagger * 2,
        });
      }
      // Center blob
      blobs.push({ x: 0.5, y: 0.5, baseSize: sizeMax * 1.2, seed: Math.random() * 1000, delay: 0 });
      break;

    case 'corners':
      // Blobs start from corners
      const corners = [[0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]];
      corners.forEach(([cx, cy], idx) => {
        for (let i = 0; i < Math.floor(count / 4); i++) {
          blobs.push({
            x: cx + (Math.random() - 0.5) * 0.3,
            y: cy + (Math.random() - 0.5) * 0.3,
            baseSize: sizeMin + Math.random() * sizeRange,
            seed: Math.random() * 1000,
            delay: idx * 0.05 + Math.random() * stagger,
          });
        }
      });
      break;

    case 'spiral':
      // Blobs in spiral pattern
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 4;
        const dist = 0.1 + t * 0.35;
        blobs.push({
          x: 0.5 + Math.cos(angle) * dist,
          y: 0.5 + Math.sin(angle) * dist,
          baseSize: sizeMin + Math.random() * sizeRange,
          seed: Math.random() * 1000,
          delay: t * stagger,
        });
      }
      break;

    case 'wave':
      // Horizontal wave pattern
      for (let i = 0; i < count; i++) {
        const x = (i / count) * 0.8 + 0.1;
        blobs.push({
          x,
          y: 0.5 + Math.sin(x * Math.PI * 2) * 0.2 + (Math.random() - 0.5) * 0.2,
          baseSize: sizeMin + Math.random() * sizeRange,
          seed: Math.random() * 1000,
          delay: x * stagger,
        });
      }
      break;

    case 'explosion':
      // All from center with random delays
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.05 + Math.random() * 0.45;
        blobs.push({
          x: 0.5 + Math.cos(angle) * dist,
          y: 0.5 + Math.sin(angle) * dist,
          baseSize: sizeMin + Math.random() * sizeRange * 1.3,
          seed: Math.random() * 1000,
          delay: Math.random() * stagger * 0.5,
        });
      }
      break;

    case 'random':
    default:
      // Random placement
      for (let i = 0; i < count; i++) {
        blobs.push({
          x: 0.1 + Math.random() * 0.8,
          y: 0.1 + Math.random() * 0.8,
          baseSize: sizeMin + Math.random() * sizeRange,
          seed: Math.random() * 1000,
          delay: Math.random() * stagger,
        });
      }
      // Add coverage blobs at corners and center
      blobs.push({ x: 0.15, y: 0.15, baseSize: sizeMin + sizeRange * 0.3, seed: Math.random() * 1000, delay: 0.05 });
      blobs.push({ x: 0.85, y: 0.15, baseSize: sizeMin + sizeRange * 0.4, seed: Math.random() * 1000, delay: 0.08 });
      blobs.push({ x: 0.15, y: 0.85, baseSize: sizeMin + sizeRange * 0.2, seed: Math.random() * 1000, delay: 0.1 });
      blobs.push({ x: 0.85, y: 0.85, baseSize: sizeMin + sizeRange * 0.3, seed: Math.random() * 1000, delay: 0.03 });
      blobs.push({ x: 0.5, y: 0.5, baseSize: sizeMax * 1.1, seed: Math.random() * 1000, delay: 0 });
      break;
  }

  return blobs;
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT LOADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const DefaultLoader: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
    }}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: 'ink-reveal-spin 1s linear infinite' }}>
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="3"
      />
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="#333"
        strokeWidth="3"
        strokeDasharray="80"
        strokeDashoffset="60"
        strokeLinecap="round"
      />
    </svg>
    <style>{`
      @keyframes ink-reveal-spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const InkRevealImage: React.FC<InkRevealImageProps> = ({
  src,
  alt = '',
  placeholder,
  className = '',
  style,
  
  // Animation
  duration = 2500,
  easing = 'easeOut',
  delay = 0,
  triggerOnViewport = true,
  viewportThreshold = 0.1,
  viewportRootMargin = '0px',
  
  // Blobs
  blobCount = 14,
  blobSizeMin = 0.12,
  blobSizeMax = 0.30,
  blobRoughness = 0.3,
  blobComplexity = 60,
  blobStagger = 0.15,
  pattern = 'random',
  customBlobs,
  
  // Visual
  objectFit = 'cover',
  objectPosition = 'center',
  backgroundColor = '#e5e7eb',
  placeholderBlur = 20,
  fadeInStart = 0.7,
  showLoader = false,
  loader,
  borderRadius,
  
  // Callbacks
  onLoadStart,
  onLoad,
  onRevealStart,
  onProgress,
  onRevealComplete,
  onError,
  
  // Advanced
  highDPI = true,
  disableAnimation = false,
  crossOrigin = 'anonymous',
  paused = false,
  animationKey,
  ariaLabel,
  ariaDescribedBy,
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(disableAnimation);
  const [overlayOpacity, setOverlayOpacity] = useState(disableAnimation ? 1 : 0);
  const [isInViewport, setIsInViewport] = useState(!triggerOnViewport);
  const [hasError, setHasError] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────────────────
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenImgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const delayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const blobsRef = useRef<InkBlob[]>(
    generateBlobsForPattern(blobCount, pattern, blobSizeMin, blobSizeMax, blobStagger, customBlobs)
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // BLOB DRAWING
  // ─────────────────────────────────────────────────────────────────────────────
  
  const drawBlobPath = useCallback((
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    seed: number,
    progress: number
  ) => {
    const points = blobComplexity;
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      
      const noise1 = Math.sin(angle * 3 + seed) * 0.18 * blobRoughness;
      const noise2 = Math.sin(angle * 7 + seed * 2.1) * 0.09 * blobRoughness;
      const noise3 = Math.sin(angle * 13 + seed * 3.7) * 0.04 * blobRoughness;
      
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
  }, [blobComplexity, blobRoughness]);

  // ─────────────────────────────────────────────────────────────────────────────
  // FRAME DRAWING
  // ─────────────────────────────────────────────────────────────────────────────
  
  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    const img = hiddenImgRef.current;
    const container = containerRef.current;
    if (!canvas || !img || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width) || 400;
    const height = Math.floor(rect.height) || 400;
    
    const dpr = highDPI ? (window.devicePixelRatio || 1) : 1;
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
    const maxBlobRadius = maxDimension * 0.5;
    const easeFn = easingFunctions[easing];

    ctx.save();
    ctx.beginPath();

    blobsRef.current.forEach((blob) => {
      const delayedProgress = Math.max(0, (progress - blob.delay) / (1 - blob.delay));
      const easedProgress = easeFn(delayedProgress);
      
      if (easedProgress <= 0) return;

      const centerX = blob.x * width;
      const centerY = blob.y * height;
      
      const targetRadius = easedProgress * maxDimension * blob.baseSize * 1.2;
      const radius = Math.min(targetRadius, maxBlobRadius);
      
      if (radius > 1) {
        drawBlobPath(ctx, centerX, centerY, radius, blob.seed, easedProgress);
      }
    });

    ctx.closePath();
    ctx.clip();

    // Draw image with object-fit
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;
    
    let drawWidth: number, drawHeight: number, drawX: number, drawY: number;
    
    if (objectFit === 'cover') {
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
    } else if (objectFit === 'contain') {
      if (imgRatio > canvasRatio) {
        drawWidth = width;
        drawHeight = width / imgRatio;
        drawX = 0;
        drawY = (height - drawHeight) / 2;
      } else {
        drawHeight = height;
        drawWidth = height * imgRatio;
        drawX = (width - drawWidth) / 2;
        drawY = 0;
      }
    } else {
      drawWidth = width;
      drawHeight = height;
      drawX = 0;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }, [easing, highDPI, objectFit, drawBlobPath]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ANIMATION LOOP
  // ─────────────────────────────────────────────────────────────────────────────
  
  const animate = useCallback((timestamp: number) => {
    if (paused) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(1, elapsed / duration);

    drawFrame(progress);
    onProgress?.(progress);
    
    // Fade in final image
    if (progress > fadeInStart) {
      const fadeProgress = (progress - fadeInStart) / (1 - fadeInStart);
      setOverlayOpacity(fadeProgress);
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsComplete(true);
      setIsAnimating(false);
      setOverlayOpacity(1);
      
      if (placeholderRef.current) {
        placeholderRef.current.style.opacity = '0';
      }
      
      onRevealComplete?.();
    }
  }, [duration, fadeInStart, paused, drawFrame, onProgress, onRevealComplete]);

  // ─────────────────────────────────────────────────────────────────────────────
  // START ANIMATION
  // ─────────────────────────────────────────────────────────────────────────────
  
  const startAnimation = useCallback(() => {
    if (disableAnimation) {
      setIsComplete(true);
      setOverlayOpacity(1);
      onRevealComplete?.();
      return;
    }
    
    setIsAnimating(true);
    onRevealStart?.();
    startTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
  }, [disableAnimation, animate, onRevealStart, onRevealComplete]);

  // ─────────────────────────────────────────────────────────────────────────────
  // IMAGE LOAD HANDLER
  // ─────────────────────────────────────────────────────────────────────────────
  
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setIsLoaded(true);
    onLoad?.();
    
    if (isInViewport) {
      if (delay > 0) {
        delayTimeoutRef.current = setTimeout(startAnimation, delay);
      } else {
        startAnimation();
      }
    }
  }, [isInViewport, delay, startAnimation, onLoad]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e.nativeEvent);
  }, [onError]);

  // ─────────────────────────────────────────────────────────────────────────────
  // INTERSECTION OBSERVER
  // ─────────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    if (!triggerOnViewport || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInViewport) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      {
        threshold: viewportThreshold,
        rootMargin: viewportRootMargin,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [triggerOnViewport, viewportThreshold, viewportRootMargin, isInViewport]);

  // ─────────────────────────────────────────────────────────────────────────────
  // START WHEN IN VIEWPORT & LOADED
  // ─────────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    if (isInViewport && isLoaded && !isAnimating && !isComplete) {
      if (delay > 0) {
        delayTimeoutRef.current = setTimeout(startAnimation, delay);
      } else {
        startAnimation();
      }
    }
  }, [isInViewport, isLoaded, isAnimating, isComplete, delay, startAnimation]);

  // ─────────────────────────────────────────────────────────────────────────────
  // REGENERATE BLOBS ON PATTERN/COUNT CHANGE
  // ─────────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    blobsRef.current = generateBlobsForPattern(
      blobCount, pattern, blobSizeMin, blobSizeMax, blobStagger, customBlobs
    );
  }, [blobCount, pattern, blobSizeMin, blobSizeMax, blobStagger, customBlobs, animationKey]);

  // ─────────────────────────────────────────────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    onLoadStart?.();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  
  return (
    <div
      ref={containerRef}
      className={`ink-reveal-image ${className}`}
      role="img"
      aria-label={ariaLabel || alt}
      aria-describedby={ariaDescribedBy}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        backgroundColor,
        borderRadius,
        ...style,
      }}
    >
      {/* Hidden image for loading */}
      <img
        ref={hiddenImgRef}
        src={src}
        alt=""
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin={crossOrigin || undefined}
        style={{ display: 'none' }}
      />

      {/* Loading indicator */}
      {showLoader && isLoading && !hasError && (
        loader || <DefaultLoader />
      )}

      {/* Error state */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Failed to load image
        </div>
      )}

      {/* Placeholder */}
      {placeholder && !hasError && (
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
            objectFit,
            objectPosition,
            filter: `blur(${placeholderBlur}px)`,
            transform: 'scale(1.1)',
            zIndex: 1,
            opacity: isComplete ? 0 : 1,
            transition: 'opacity 0.4s ease-out',
          }}
        />
      )}

      {/* Canvas for animated reveal */}
      {!hasError && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            opacity: isLoaded && !disableAnimation ? 1 : 0,
          }}
        />
      )}

      {/* Final overlay image */}
      {isLoaded && !hasError && (
        <img
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit,
            objectPosition,
            zIndex: 3,
            opacity: overlayOpacity,
            pointerEvents: isComplete ? 'auto' : 'none',
          }}
        />
      )}
    </div>
  );
};

export default InkRevealImage;

