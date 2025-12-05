import React, { useState } from 'react';
import { InkRevealImage } from './src';

const patterns = ['random', 'center', 'corners', 'spiral', 'wave', 'explosion'] as const;
const easings = ['easeOut', 'easeOutStrong', 'easeInOut', 'linear', 'easeOutElastic', 'easeOutBounce'] as const;

export function App() {
  const [key, setKey] = useState(0);
  const [pattern, setPattern] = useState<typeof patterns[number]>('random');
  const [easing, setEasing] = useState<typeof easings[number]>('easeOut');
  const [duration, setDuration] = useState(2500);
  const [blobCount, setBlobCount] = useState(14);
  const [progress, setProgress] = useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '40px 20px',
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Space+Grotesk:wght@400;500;700&display=swap');
        
        * { box-sizing: border-box; }
        
        .title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          color: #fff;
          text-align: center;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .subtitle {
          text-align: center;
          color: rgba(255,255,255,0.6);
          font-size: 1.1rem;
          margin-bottom: 40px;
          font-weight: 300;
        }
        
        .demo-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .main-demo {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
        }
        
        .image-wrapper {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        
        .controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }
        
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .control-label {
          color: rgba(255,255,255,0.7);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .control-select, .control-range {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px 16px;
          color: white;
          font-family: inherit;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .control-select:hover, .control-select:focus {
          border-color: rgba(102, 126, 234, 0.5);
          background: rgba(255,255,255,0.08);
          outline: none;
        }
        
        .control-select option {
          background: #1a1a2e;
          color: white;
        }
        
        .control-range {
          padding: 8px;
          -webkit-appearance: none;
          appearance: none;
        }
        
        .control-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          cursor: pointer;
          margin-top: -8px;
        }
        
        .control-range::-webkit-slider-runnable-track {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        
        .range-value {
          color: #667eea;
          font-weight: 500;
        }
        
        .replay-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .replay-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        .progress-bar-container {
          margin-top: 16px;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.1s linear;
        }
        
        .gallery-title {
          color: white;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          margin: 48px 0 24px;
          text-align: center;
        }
        
        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        
        .gallery-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .gallery-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .gallery-image {
          width: 100%;
          aspect-ratio: 4/3;
        }
        
        .gallery-info {
          padding: 16px;
        }
        
        .gallery-pattern {
          color: #667eea;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        
        .gallery-easing {
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
        }
        
        .code-block {
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          padding: 24px;
          margin-top: 48px;
          overflow-x: auto;
        }
        
        .code-block pre {
          margin: 0;
          color: rgba(255,255,255,0.8);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          line-height: 1.6;
        }
        
        .code-keyword { color: #c792ea; }
        .code-string { color: #c3e88d; }
        .code-number { color: #f78c6c; }
        .code-prop { color: #82aaff; }
      `}</style>

      <div className="demo-container">
        <h1 className="title">🖋️ Ink Reveal Image</h1>
        <p className="subtitle">Beautiful ink blob reveal animation for lazy-loaded images</p>

        {/* Main Interactive Demo */}
        <div className="main-demo">
          <div className="image-wrapper" key={key}>
            <InkRevealImage
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
              placeholder="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=50&q=10"
              alt="Mountain landscape"
              duration={duration}
              easing={easing}
              pattern={pattern}
              blobCount={blobCount}
              onProgress={setProgress}
              onRevealComplete={() => console.log('✨ Reveal complete!')}
            />
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress * 100}%` }} />
          </div>

          <div className="controls">
            <div className="control-group">
              <label className="control-label">Pattern</label>
              <select 
                className="control-select"
                value={pattern}
                onChange={(e) => setPattern(e.target.value as typeof pattern)}
              >
                {patterns.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">Easing</label>
              <select 
                className="control-select"
                value={easing}
                onChange={(e) => setEasing(e.target.value as typeof easing)}
              >
                {easings.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">
                Duration: <span className="range-value">{duration}ms</span>
              </label>
              <input 
                type="range"
                className="control-range"
                min="500"
                max="6000"
                step="100"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label className="control-label">
                Blob Count: <span className="range-value">{blobCount}</span>
              </label>
              <input 
                type="range"
                className="control-range"
                min="5"
                max="30"
                value={blobCount}
                onChange={(e) => setBlobCount(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button className="replay-btn" onClick={() => { setProgress(0); setKey(k => k + 1); }}>
              ↻ Replay Animation
            </button>
          </div>
        </div>

        {/* Pattern Gallery */}
        <h2 className="gallery-title">Pattern Showcase</h2>
        <div className="gallery">
          {[
            { pattern: 'random', easing: 'easeOut', img: 'photo-1469474968028-56623f02e42e' },
            { pattern: 'center', easing: 'easeOutStrong', img: 'photo-1470071459604-3b5ec3a7fe05' },
            { pattern: 'corners', easing: 'easeInOut', img: 'photo-1441974231531-c6227db76b6e' },
            { pattern: 'spiral', easing: 'easeOutElastic', img: 'photo-1507003211169-0a1dd7228f2d' },
            { pattern: 'wave', easing: 'easeOut', img: 'photo-1518173946687-a4c036bc3fed' },
            { pattern: 'explosion', easing: 'easeOutBounce', img: 'photo-1509023464722-18d996393ca8' },
          ].map((item, i) => (
            <div key={`${item.pattern}-${key}`} className="gallery-item">
              <div className="gallery-image">
                <InkRevealImage
                  src={`https://images.unsplash.com/${item.img}?w=600&q=80`}
                  placeholder={`https://images.unsplash.com/${item.img}?w=30&q=10`}
                  alt={`${item.pattern} pattern demo`}
                  pattern={item.pattern as any}
                  easing={item.easing as any}
                  duration={2500 + i * 300}
                  delay={i * 150}
                />
              </div>
              <div className="gallery-info">
                <div className="gallery-pattern">{item.pattern}</div>
                <div className="gallery-easing">{item.easing}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Code */}
        <div className="code-block">
          <pre>{`<span class="code-keyword">import</span> { InkRevealImage } <span class="code-keyword">from</span> <span class="code-string">'ink-reveal-image'</span>;

<span class="code-keyword">function</span> <span class="code-prop">Gallery</span>() {
  <span class="code-keyword">return</span> (
    &lt;<span class="code-prop">InkRevealImage</span>
      <span class="code-prop">src</span>=<span class="code-string">"/photo.jpg"</span>
      <span class="code-prop">placeholder</span>=<span class="code-string">"/photo-tiny.jpg"</span>
      <span class="code-prop">duration</span>={<span class="code-number">${duration}</span>}
      <span class="code-prop">easing</span>=<span class="code-string">"${easing}"</span>
      <span class="code-prop">pattern</span>=<span class="code-string">"${pattern}"</span>
      <span class="code-prop">blobCount</span>={<span class="code-number">${blobCount}</span>}
      <span class="code-prop">onRevealComplete</span>={() => console.log(<span class="code-string">'Done!'</span>)}
    /&gt;
  );
}`}</pre>
        </div>
      </div>
    </div>
  );
}
