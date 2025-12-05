# 🖋️ Ink Reveal Image

<div align="center">

**Beautiful ink blob reveal animation for lazy-loaded images in React**

[![npm version](https://img.shields.io/npm/v/@rowix/ink-reveal-image.svg?style=flat-square)](https://www.npmjs.com/package/@rowix/ink-reveal-image)
[![npm downloads](https://img.shields.io/npm/dm/@rowix/ink-reveal-image.svg?style=flat-square)](https://www.npmjs.com/package/@rowix/ink-reveal-image)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@rowix/ink-reveal-image?style=flat-square)](https://bundlephobia.com/package/@rowix/ink-reveal-image)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)](https://www.typescriptlang.org/)

A React component that reveals images with an organic ink splatter effect using canvas-based animation. Perfect for galleries, portfolios, and any image-heavy application.

[Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [Props](#props) • [Examples](#examples)

</div>

---

## ✨ Features

- 🎨 **Organic Ink Blobs** — Natural, randomized blob shapes that feel hand-painted
- 🚀 **Lazy Loading** — Automatically triggers when images enter the viewport
- ⚡ **Canvas-Powered** — Smooth 60fps animations with high-DPI support
- 🎛️ **Highly Customizable** — 35+ props to fine-tune every aspect
- 📦 **Tiny Bundle** — Tree-shakeable with zero dependencies
- 🔧 **TypeScript Ready** — Full type definitions included
- ♿ **Accessible** — ARIA labels and semantic HTML

---

## 📦 Installation

```bash
# npm
npm install @rowix/ink-reveal-image

# yarn
yarn add @rowix/ink-reveal-image

# pnpm
pnpm add @rowix/ink-reveal-image
```

---

## 🚀 Quick Start

```tsx
import { InkRevealImage } from '@rowix/ink-reveal-image';

function App() {
  return (
    <div style={{ width: 400, height: 300 }}>
      <InkRevealImage
        src="https://example.com/image.jpg"
        alt="Beautiful landscape"
      />
    </div>
  );
}
```

---

## 📖 Usage

### Basic Usage

```tsx
<InkRevealImage
  src="/photo.jpg"
  alt="My photo"
/>
```

### With Placeholder

```tsx
<InkRevealImage
  src="/photo-large.jpg"
  placeholder="/photo-tiny.jpg"
  alt="My photo"
  placeholderBlur={25}
/>
```

### Custom Animation

```tsx
<InkRevealImage
  src="/photo.jpg"
  alt="My photo"
  duration={3500}
  easing="easeOutElastic"
  delay={200}
  blobCount={20}
  pattern="explosion"
/>
```

### With Callbacks

```tsx
<InkRevealImage
  src="/photo.jpg"
  alt="My photo"
  onLoadStart={() => console.log('Loading...')}
  onLoad={() => console.log('Loaded!')}
  onRevealStart={() => console.log('Animating...')}
  onProgress={(p) => console.log(`${Math.round(p * 100)}%`)}
  onRevealComplete={() => console.log('Done!')}
  onError={(e) => console.error('Failed:', e)}
/>
```

---

## ⚙️ Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | *required* | Image source URL |
| `alt` | `string` | `''` | Alt text for accessibility |
| `placeholder` | `string` | — | Low-res placeholder image URL |
| `className` | `string` | `''` | Additional CSS class for container |
| `style` | `CSSProperties` | — | Inline styles for container |

### Animation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `2500` | Animation duration in milliseconds |
| `easing` | `EasingFunction` | `'easeOut'` | Easing function for blob growth |
| `delay` | `number` | `0` | Delay before animation starts (ms) |
| `triggerOnViewport` | `boolean` | `true` | Start animation when in viewport |
| `viewportThreshold` | `number` | `0.1` | Viewport visibility threshold (0-1) |
| `viewportRootMargin` | `string` | `'0px'` | IntersectionObserver root margin |

#### Available Easing Functions

```typescript
type EasingFunction = 
  | 'linear'        // Constant speed
  | 'easeOut'       // Slow down at end (default)
  | 'easeOutStrong' // More dramatic slowdown
  | 'easeInOut'     // Slow start and end
  | 'easeOutElastic'// Bouncy overshoot
  | 'easeOutBounce' // Multiple bounces
```

### Blob Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blobCount` | `number` | `14` | Number of ink blobs |
| `blobSizeMin` | `number` | `0.12` | Minimum blob size (0-1 fraction) |
| `blobSizeMax` | `number` | `0.30` | Maximum blob size (0-1 fraction) |
| `blobRoughness` | `number` | `0.3` | Edge roughness/noise (0-1) |
| `blobComplexity` | `number` | `60` | Points defining blob shape |
| `blobStagger` | `number` | `0.15` | Max delay stagger between blobs |
| `pattern` | `RevealPattern` | `'random'` | Preset pattern for blob placement |
| `customBlobs` | `Array` | — | Custom blob positions |

#### Available Patterns

```typescript
type RevealPattern = 
  | 'random'    // Random scattered (default)
  | 'center'    // Radiates from center
  | 'corners'   // Starts from all corners
  | 'spiral'    // Spiral from center outward
  | 'wave'      // Horizontal wave pattern
  | 'explosion' // All from center, random delays
```

#### Custom Blobs

```tsx
<InkRevealImage
  src="/photo.jpg"
  customBlobs={[
    { x: 0.2, y: 0.2, size: 0.25, delay: 0 },
    { x: 0.8, y: 0.3, size: 0.20, delay: 0.1 },
    { x: 0.5, y: 0.7, size: 0.30, delay: 0.05 },
  ]}
/>
```

### Visual Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `objectFit` | `ObjectFit` | `'cover'` | CSS object-fit for image |
| `objectPosition` | `string` | `'center'` | CSS object-position |
| `backgroundColor` | `string` | `'#e5e7eb'` | Background color while loading |
| `placeholderBlur` | `number` | `20` | Blur amount for placeholder (px) |
| `fadeInStart` | `number` | `0.7` | When to start final fade-in (0-1) |
| `showLoader` | `boolean` | `false` | Show loading spinner |
| `loader` | `ReactNode` | — | Custom loader component |
| `borderRadius` | `string \| number` | — | Border radius for container |

### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onLoadStart` | `() => void` | Called when image starts loading |
| `onLoad` | `() => void` | Called when image finishes loading |
| `onRevealStart` | `() => void` | Called when animation starts |
| `onProgress` | `(progress: number) => void` | Progress updates (0-1) |
| `onRevealComplete` | `() => void` | Called when animation completes |
| `onError` | `(error: Event) => void` | Called if image fails to load |

### Advanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `highDPI` | `boolean` | `true` | Enable retina canvas rendering |
| `disableAnimation` | `boolean` | `false` | Skip animation, show immediately |
| `crossOrigin` | `string` | `'anonymous'` | CORS setting for images |
| `paused` | `boolean` | `false` | Pause the animation |
| `animationKey` | `string \| number` | — | Change to re-trigger animation |
| `ariaLabel` | `string` | — | ARIA label override |
| `ariaDescribedBy` | `string` | — | ARIA describedby attribute |

---

## 💡 Examples

### Gallery Grid

```tsx
const images = [
  { src: '/img1.jpg', alt: 'Image 1' },
  { src: '/img2.jpg', alt: 'Image 2' },
  { src: '/img3.jpg', alt: 'Image 3' },
];

function Gallery() {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: 16 
    }}>
      {images.map((img, i) => (
        <div key={i} style={{ aspectRatio: '4/3' }}>
          <InkRevealImage
            src={img.src}
            alt={img.alt}
            duration={2000 + i * 200}
            pattern="center"
            borderRadius={8}
          />
        </div>
      ))}
    </div>
  );
}
```

### Hero Image

```tsx
function HeroSection() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <InkRevealImage
        src="/hero-4k.jpg"
        placeholder="/hero-tiny.jpg"
        alt="Epic mountain landscape"
        duration={4000}
        easing="easeOutStrong"
        blobCount={25}
        blobSizeMax={0.4}
        pattern="explosion"
        onRevealComplete={() => {
          // Trigger other animations
        }}
      />
    </div>
  );
}
```

### Controlled Animation

```tsx
function ControlledImage() {
  const [key, setKey] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <>
      <div style={{ width: 400, height: 300 }}>
        <InkRevealImage
          src="/photo.jpg"
          animationKey={key}
          paused={paused}
          duration={5000}
        />
      </div>
      <button onClick={() => setKey(k => k + 1)}>Replay</button>
      <button onClick={() => setPaused(p => !p)}>
        {paused ? 'Resume' : 'Pause'}
      </button>
    </>
  );
}
```

### Custom Loader

```tsx
<InkRevealImage
  src="/photo.jpg"
  showLoader
  loader={
    <div className="my-spinner">
      <span>Loading...</span>
    </div>
  }
/>
```

### With Progress Bar

```tsx
function ImageWithProgress() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <div style={{ width: 400, height: 300 }}>
        <InkRevealImage
          src="/photo.jpg"
          onProgress={setProgress}
        />
      </div>
      <div className="progress-bar">
        <div style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
```

### Disable Animation (SSR/Reduced Motion)

```tsx
function AccessibleImage() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  return (
    <InkRevealImage
      src="/photo.jpg"
      alt="Description"
      disableAnimation={prefersReducedMotion}
    />
  );
}
```

---

## 🎨 Styling

The component renders a container div with the class `ink-reveal-image`. You can style it with CSS:

```css
.ink-reveal-image {
  /* Your styles */
}

/* Container must have dimensions */
.my-image-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
}
```

> **Important:** The container element must have defined dimensions (width and height). The component fills its container at 100% width and height.

---

## 🔧 TypeScript

Full TypeScript support is included. Import types as needed:

```typescript
import { 
  InkRevealImage,
  InkRevealImageProps,
  EasingFunction,
  RevealPattern,
  ObjectFit,
  InkBlob 
} from '@rowix/ink-reveal-image';
```

---

## 📱 Browser Support

- Chrome 64+
- Firefox 69+
- Safari 12+
- Edge 79+

Requires `IntersectionObserver` and `Canvas 2D` support.

---

## ⚡ Performance Tips

1. **Use placeholders** — Small blurred images prevent layout shift
2. **Optimize images** — Use appropriate sizes and formats (WebP)
3. **Limit blob count** — 10-20 blobs is usually enough
4. **Use `viewportThreshold`** — Trigger before fully visible for smoother UX
5. **Consider `disableAnimation`** — Respect user's reduced motion preference

---

## 📄 License

MIT © [rowix](https://github.com/rowix-components)

---

<div align="center">

**Made with ❤️ for beautiful web experiences**

[⬆ Back to top](#-ink-reveal-image)

</div>
