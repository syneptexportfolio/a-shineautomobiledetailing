---
name: stitch-loop
description: Automated iterative design and refinement workflow for Google Stitch. Runs continuous prompt-edit-evaluate loops on screens, refines visual components via edit_screens, tests responsive variations, and verifies design fidelity.
---

# Stitch Loop Skill Guide

## Overview
`stitch-loop` is an iterative design-refinement workflow. Instead of generating a single static UI screen, `stitch-loop` establishes a feedback loop between requirement gathering, initial screen generation, component inspection, targeted design edits, visual variant testing, and final code synthesis.

---

## The 5-Phase Stitch Loop Protocol

```
┌─────────────────────────────────────────────────────────┐
│ 1. INITIALIZE & GENERATE                                │
│    Create project -> Generate base screen (GEMINI_3_1_PRO)│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. INSPECT & DIAGNOSE                                   │
│    `get_screen` -> Analyze components, spacing, layout  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. TARGETED REFINE (`edit_screens`)                     │
│    Apply micro-edits (colors, CTAs, typography, grid)  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 4. VARIANT EXPLORATION (`generate_variants`)            │
│    Generate alternative themes/layouts & pick winner    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 5. CODE SYNTHESIS (`stitch-code-sync`)                  │
│    Export UI components into React / Next.js / HTML     │
└────────────────────────────┴────────────────────────────┘
```

---

## Detailed Phase Execution

### Phase 1: Initialize & Generate
1. Create or select a project using `create_project` or `list_projects`.
2. Generate the core screen with an unconstrained, descriptive prompt specifying full page layout:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "generate_screen_from_text",
  Arguments: {
    "projectId": "<PROJECT_ID>",
    "deviceType": "DESKTOP",
    "modelId": "GEMINI_3_1_PRO",
    "prompt": "Create an enterprise-grade car dealership landing page with dark mode aesthetics, hero section with background blur, vehicle search filter bar, featured vehicles carousel, customer reviews, and contact form."
  }
)
```

### Phase 2: Inspect Output & Identify Improvements
1. Retrieve screen structure using `get_screen`.
2. Evaluate against design standards:
   - Are colors cohesive and accessible?
   - Is navigation intuitive?
   - Are call-to-action buttons visually prominent?
   - Are grid alignment and white space well balanced?

### Phase 3: Targeted Refinement Loop (`edit_screens`)
Run precise edit passes to fix layout or aesthetic gaps:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "edit_screens",
  Arguments: {
    "projectId": "<PROJECT_ID>",
    "selectedScreenIds": ["<SCREEN_ID>"],
    "prompt": "Refine the search filter bar to include dropdown selectors for Make, Model, and Price Range with neon accent borders. Increase hero headline font weight and contrast."
  }
)
```

### Phase 4: Variant Exploration (`generate_variants`)
Explore alternative styling directions or layout configurations:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "generate_variants",
  Arguments: {
    "projectId": "<PROJECT_ID>",
    "selectedScreenId": "<SCREEN_ID>",
    "prompt": "Explore a minimal light mode variation with subtle blue gradients and rounded pill buttons."
  }
)
```

### Phase 5: Code Synthesis
When the loop converges on the optimal design, trigger code translation to build responsive frontend components in your project codebase.
