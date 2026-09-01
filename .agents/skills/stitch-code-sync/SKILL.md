---
name: stitch-code-sync
description: Automated conversion of Stitch design outputs into clean Next.js/React component code, CSS variable bindings, modern styling utilities, responsive layouts, and interactive UI states.
---

# Stitch Code Sync Skill Guide

## Overview
`stitch-code-sync` bridges the gap between visual Stitch screen generation and production frontend engineering. It defines how to inspect Stitch screen component structures (`get_screen`), map Stitch layout trees to modular React/Next.js/HTML components, enforce CSS design tokens, and implement responsive micro-interactions.

---

## 4-Step Code Translation Pipeline

```
1. Fetch Screen Model ──> 2. Parse Layout Nodes ──> 3. Synthesize Components ──> 4. Bind Styling & Tokens
   (`get_screen`)          (DOM Hierarchy)          (JSX / TSX / CSS)            (CSS Variables / HSL)
```

---

## Code Synthesis Rules

### 1. Component Structure
- Split screens into logical UI components: `Header.tsx`, `HeroSection.tsx`, `FeatureGrid.tsx`, `PricingCard.tsx`, `Testimonials.tsx`, `Footer.tsx`.
- Use TypeScript with strict prop typing.
- Use semantic HTML tags (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`).

### 2. Styling Guidelines (Vanilla CSS / Next.js Modules)
- Map Stitch design tokens to standard CSS custom properties in `globals.css` / `index.css`:
```css
:root {
  --color-bg-dark: #0f172a;
  --color-surface-glass: rgba(30, 41, 59, 0.7);
  --color-accent-primary: #4f46e5;
  --color-accent-secondary: #06b6d4;
  --color-text-main: #f8fafc;
  --color-text-muted: #94a3b8;
  --radius-card: 16px;
  --radius-btn: 12px;
  --shadow-glow: 0 10px 30px -10px rgba(79, 70, 229, 0.4);
}
```

### 3. Interactive Polish & Micro-Animations
- Add CSS transitions on hover state (`transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)`).
- Implement scale effects (`transform: translateY(-4px) scale(1.02)`).
- Use glassmorphism (`backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);`).

---

## Example Code Output

### `HeroSection.tsx`
```tsx
import React from 'react';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  onPrimaryClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCtaText,
  onPrimaryClick,
}) => {
  return (
    <section className="relative overflow-hidden py-24 px-6 md:px-12 bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto text-center z-10 relative">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/50 rounded-full backdrop-blur-md">
          Premium Automotive Experience
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mb-6">
          {title}
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onPrimaryClick}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            {primaryCtaText}
          </button>
        </div>
      </div>
    </section>
  );
};
```
