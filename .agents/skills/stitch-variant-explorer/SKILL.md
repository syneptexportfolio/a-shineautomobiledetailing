---
name: stitch-variant-explorer
description: Generating visual UI variants using Google Stitch's generate_variants tool. Explores theme variations, layout shifts, color contrast alternatives, and mobile/desktop responsive options.
---

# Stitch Variant Explorer Skill Guide

## Overview
`stitch-variant-explorer` enables side-by-side design exploration using Stitch's variant engine (`generate_variants`). It allows designers and developers to test multiple visual directions (e.g., Cyberpunk Dark vs. Clean Minimal vs. Glassmorphic Luxury) before committing to a final production design.

---

## Variant Generation Workflow

```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "generate_variants",
  Arguments: {
    "projectId": "<YOUR_PROJECT_ID>",
    "selectedScreenId": "<SCREEN_ID_TO_EXPLORE>",
    "prompt": "Explore 3 distinct color schemes: 1. Deep Obsidian with Gold CTAs, 2. Glassmorphic Slate with Neon Cyan accents, 3. Clean Light Mode with Navy typography.",
    "variantCount": 3
  }
)
```

---

## Key Exploration Patterns

| Exploration Type | Goal | Example Prompt Focus |
| :--- | :--- | :--- |
| **Theme Swap** | Light vs. Dark mode contrast | "Generate dark-mode and high-contrast OLED themes for this screen." |
| **Layout Density** | Minimalist vs. Data-dense | "Explore a compact dashboard grid layout vs. a spacious card layout." |
| **Call-to-Action Shift** | Conversion optimization | "Test variant CTAs: Floating sticky bar vs. Centered hero form vs. Slide-over drawer." |
| **Typography & Tone** | Luxury vs. Tech Modern | "Explore serif editorial typography for luxury branding vs. geometric sans-serif." |

---

## Evaluating & Selecting Variants

1. Retrieve generated variant screens using `get_screen` for each variant ID returned by `generate_variants`.
2. Compare component structure, contrast ratio, visual hierarchy, and brand alignment.
3. Select the winning variant screen and proceed to code synthesis with `stitch-code-sync`.
