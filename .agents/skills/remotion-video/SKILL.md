---
name: remotion-video
description: Master guide for programmatically building, animating, and rendering React videos using Remotion. Covers compositions, frame interpolations, spring physics, kinetic typography, audio synchronization, and MP4 video generation.
---

# Remotion Video Skill Guide

## Overview
Remotion is a framework for creating programmatic videos in React. Using Remotion, Antigravity can write code to render video ads, feature showcases, logo animations, data visualizations, dynamic UI walkthroughs, and social media reels directly to `.mp4` video files.

---

## Remotion Project Setup

### 1. Installation & Environment Setup
Initialize Remotion within a project directory:
```bash
npx create-video --template=blank
# or install into an existing Next.js / React project:
npm install remotion @remotion/cli @remotion/media-utils
```

### 2. Core Remotion Directory Architecture
```
remotion/
├── Root.tsx               # Defines video compositions, dimensions, and frame rates
├── Composition.tsx        # Main scene composition layout
├── components/
│   ├── TitleCard.tsx      # Kinetic headline animation
│   ├── FeatureCard.tsx    # Animated product card
│   └── LogoIntro.tsx      # Animated brand logo reveal
├── styles/
│   └── video.css          # CSS styles & variable tokens
└── index.ts               # Remotion entry point
```

---

## Core Remotion APIs & Hooks

### `<Composition>` Registration (`Root.tsx`)
```tsx
import { Composition } from 'remotion';
import { MainVideo } from './Composition';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Corus Motors Rudrapur",
          subtitle: "Luxury Automotive Care & Detailing",
        }}
      />
    </>
  );
};
```

### Animation Helpers: `interpolate()` & `spring()`
```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const KineticTitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Opacity fade-in from frame 0 to 20
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Spring physics scale-up
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  // Y-axis slide translation
  const translateY = interpolate(frame, [0, 25], [50, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        fontFamily: 'Inter, sans-serif',
        fontSize: 72,
        fontWeight: 800,
        color: '#FFFFFF',
        textShadow: '0 10px 30px rgba(79, 70, 229, 0.5)',
      }}
    >
      {text}
    </div>
  );
};
```

### Sequencing Sequences (`<Sequence>`)
```tsx
import { Sequence } from 'remotion';
import { LogoIntro } from './components/LogoIntro';
import { TitleCard } from './components/TitleCard';
import { FeatureGrid } from './components/FeatureGrid';

export const MainVideo = () => {
  return (
    <div style={{ flex: 1, backgroundColor: '#090D16' }}>
      {/* Scene 1: Logo Intro (0s - 3s / Frame 0-90) */}
      <Sequence from={0} durationInFrames={90}>
        <LogoIntro />
      </Sequence>

      {/* Scene 2: Main Headline & Subtitle (3s - 7s / Frame 90-210) */}
      <Sequence from={90} durationInFrames={120}>
        <TitleCard />
      </Sequence>

      {/* Scene 3: Feature Highlights Showcase (7s - 10s / Frame 210-300) */}
      <Sequence from={210} durationInFrames={90}>
        <FeatureGrid />
      </Sequence>
    </div>
  );
};
```

---

## Rendering Videos to MP4

To render a Remotion composition to a local `.mp4` file using standard CLI:
```bash
npx remotion render remotion/index.ts MainVideo out/video.mp4
```

To render for mobile vertical video (Reels / Shorts / TikTok - 1080x1920):
```bash
npx remotion render remotion/index.ts MainVideo out/shorts.mp4 --width=1080 --height=1920
```

---

## Production Best Practices

1. **Keep FPS Standard**: Use 30 fps for smooth web animations or 60 fps for ultra-smooth gaming/tech promos.
2. **Clamp Interpolation**: Always set `{ extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }` on `interpolate()` calls to prevent values from overshooting when frames exceed the animation range.
3. **Optimized Assets**: Pre-load local images (`staticFile()`) rather than fetching external network URLs to avoid render delays.
4. **Subtle Motion & Depth**: Combine spring scale, opacity fades, and subtle rotational tilt for a cinematic visual feel.
