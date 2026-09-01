---
name: prompt-engineer
description: Master guide for crafting high-impact UI/UX design prompts, Google Stitch generation prompts, image generation prompts, and frontend architectural instructions to maximize design fidelity and aesthetic quality.
---

# Prompt Engineering Skill Guide

## Overview
`prompt-engineer` provides proven frameworks, formulas, and vocabulary for generating exceptional UI/UX designs with Google Stitch, Gemini 3.1 Pro, and generative visual tools. It eliminates generic MVP look-and-feel by injecting precise architectural specs, typography rules, color science, motion dynamics, and component layouts into prompts.

---

## The 6-Layer UI Prompt Architecture Formula

When crafting a prompt for screen generation or UI design, structure the prompt across these 6 explicit layers:

```
┌─────────────────────────────────────────────────────────┐
│ LAYER 1: Core Domain & Target Persona                   │
│   "Enterprise automotive detailing studio for luxury cars" │
├─────────────────────────────────────────────────────────┤
│ LAYER 2: Layout & Page Architecture                     │
│   "Sticky glass nav bar, 1200px container grid, hero"   │
├─────────────────────────────────────────────────────────┤
│ LAYER 3: Color Palette & Atmospheric Style              │
│   "Sleek dark mode (#0F172A), neon cyan (#06B6D4) CTAs" │
├─────────────────────────────────────────────────────────┤
│ LAYER 4: Component Specifics & Micro-UI                 │
│   "Interactive 3-tier pricing matrix with Popular badge"│
├─────────────────────────────────────────────────────────┤
│ LAYER 5: Typography & Hierarchy                         │
│   "Bold display headline (Inter/Outfit), muted slate body"│
├─────────────────────────────────────────────────────────┤
│ LAYER 6: Interactive States & Motion Feel               │
│   "Hover glow on buttons, glassmorphic backdrop-blur"   │
└─────────────────────────────────────────────────────────┘
```

---

## Specialized Prompt Templates

### Template A: High-Converting Landing Page (Google Stitch)
```text
Design a world-class, ultra-modern landing page for [PRODUCT/SERVICE NAME].
- Aesthetic: Deep obsidian dark mode (#090D16) with subtle indigo-to-cyan gradient glows, glassmorphism cards (1px white border at 10% opacity, backdrop blur 16px).
- Navigation: Floating sticky header with brand logo, nav links (Services, Fleet, Pricing, Reviews), and a glowing gradient CTA "Book Appointment".
- Hero Section: High-impact display headline in bold sans-serif, subheadline with high legibility, dual CTAs ("Explore Services" primary, "Watch Reel" secondary with play icon), background subtle particle pattern.
- Feature Matrix: 3-column grid featuring frosted glass cards, custom icons with glowing background circles, hover elevation effect.
- Social Proof: Dynamic metrics counter bar (5,000+ Cars Detailed, 99.8% Satisfaction, 15+ Awards) and customer testimonial slider with star ratings.
- Pricing Section: Interactive 3-card package layout with 'Ceramic Coating' highlighted as 'Most Popular' with a cyan badge.
- Footer: 4-column layout with quick links, newsletter signup input with integrated submit button, copyright, and social icons.
```

### Template B: Web Application Dashboard
```text
Create a sleek enterprise analytics dashboard for [APP NAME].
- Layout: Fixed 240px dark left sidebar navigation with active indicator pill, main scrollable canvas, and top search header with notifications bell and avatar profile.
- Sidebar: Logo mark, grouped links (Overview, Analytics, Fleet Status, Customers, Settings), collapse toggle button.
- Main Grid: 4 key metric summary cards at top (Total Revenue, Active Bookings, Efficiency Score, Pending Reviews) featuring trend percentage badges (+14.2% green).
- Charts Area: 2-column layout — left column features a smooth line chart for monthly performance, right column features a donut chart for service distribution.
- Data Table: Full-width recent transactions table with search filter bar, status badges (Completed, In Progress, Scheduled), pagination controls, and action overflow menus.
```

---

## Aesthetic Keywords Reference Matrix

| Style Direction | Keywords to Include in Prompts | Keywords to Exclude (Negative) |
| :--- | :--- | :--- |
| **Glassmorphism Dark** | Frosted glass, `backdrop-filter: blur`, 1px border `rgba(255,255,255,0.1)`, deep slate `#0F172A`, cyan/indigo glow | Solid gray blocks, default HTML borders, plain white background |
| **Neumorphic Minimal** | Soft inner shadows, smooth monochromatic surfaces, tactile push-buttons, 12px border radii | Harsha outlines, heavy gradients, neon overload |
| **Cyberpunk Modern** | High-contrast black, neon magenta, electric blue, grid scanlines, futuristic typography | Pastel colors, organic rounded curves, earthy tones |
| **Luxury Editorial** | High contrast, serif headers paired with clean sans-serif body, generous whitespace, gold accents `#D4AF37` | Cluttered layouts, busy icons, playful cartoon vectors |

---

## Stitch & Prompt Optimization Checklist

1. **Explicit Device Target**: Always state whether the layout target is `DESKTOP` (1440px+ standard), `TABLET`, or `MOBILE` (375px responsive stack).
2. **Avoid Vague Modifiers**: Replace terms like *"make it cool"* or *"make it modern"* with specific terms like *"glassmorphism card container with 16px radius and indigo gradient outline"*.
3. **Specify Component Density**: Indicate whether the page is a spacious marketing landing page or a high-density data dashboard.
