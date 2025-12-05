import React, { CSSProperties } from 'react';

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
  
  // Animation Settings
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
  
  // Blob Settings
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
  
  // Visual Settings
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
  
  // Callbacks
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
  
  // Advanced
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

export declare const InkRevealImage: React.FC<InkRevealImageProps>;
export default InkRevealImage;

