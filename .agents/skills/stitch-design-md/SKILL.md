---
name: stitch-design-md
description: Managing, authoring, and applying DESIGN.md specification files to create custom Stitch design systems, define color palettes, typography scales, component token bindings, and brand design guidelines for Google Stitch.
---

# Stitch Design MD Skill Guide

## Overview
`DESIGN.md` is a structured markdown specification used by Google Stitch to define brand tokens, styling rules, color palettes, typography hierarchies, layout constraints, and component variants. Using `upload_design_md` and `create_design_system_from_design_md`, Antigravity can turn markdown design specifications into enforced design systems across all generated UI screens.

---

## `DESIGN.md` Template Structure

```markdown
# Brand & Design System Specification

## 1. Color Palette & Tokens
- **Primary Accent**: `#4F46E5` (Indigo Violet)
- **Secondary Accent**: `#06B6D4` (Cyan Glow)
- **Background Dark**: `#0F172A` (Slate 900)
- **Card Surface**: `rgba(30, 41, 59, 0.7)` (Glassmorphism dark with 1px border `rgba(255, 255, 255, 0.1)`)
- **Text Primary**: `#F8FAFC` (Slate 50)
- **Text Muted**: `#94A3B8` (Slate 400)
- **Success / Warning / Error**: `#22C55E`, `#F59E0B`, `#EF4444`

## 2. Typography System
- **Heading Font**: Inter / Outfit (Sans-Serif)
- **Body Font**: Inter (Sans-Serif)
- **Scale**:
  - H1: 48px / 1.2 line-height / Bold
  - H2: 32px / 1.3 line-height / Semi-Bold
  - H3: 24px / 1.4 line-height / Medium
  - Body: 16px / 1.6 line-height / Regular
  - Caption / Badge: 12px / 1.4 line-height / Medium uppercase

## 3. UI Component Specs
- **Buttons**:
  - Primary: Gradient fill `linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)`, rounded 12px, hover elevation + transition 0.2s.
  - Secondary: Ghost outline `1px solid rgba(255, 255, 255, 0.2)`, backdrop blur 8px.
- **Cards**: Glassmorphic dark card, 16px border-radius, subtle drop-shadow `0 20px 25px -5px rgba(0, 0, 0, 0.5)`.
- **Form Inputs**: Slate surface `#1E293B`, focus ring `#4F46E5`, rounded 8px.

## 4. Spacing & Container Grid
- **Container Max Width**: 1280px (Centered)
- **Grid Gaps**: 24px / 32px
- **Padding**: Mobile 16px, Desktop 48px
```

---

## Workflow: Applying `DESIGN.md` to Stitch

### Step 1: Upload `DESIGN.md` Content
Use `upload_design_md` to send the markdown design specification to your Stitch project:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "upload_design_md",
  Arguments: {
    "projectId": "<YOUR_PROJECT_ID>",
    "designMdContent": "<CONTENT_OF_DESIGN_MD>"
  }
)
```

### Step 2: Convert Uploaded `DESIGN.md` into Design System
Once uploaded, bind the generated screen instance to create the design system:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "create_design_system_from_design_md",
  Arguments: {
    "projectId": "<YOUR_PROJECT_ID>",
    "selectedScreenInstance": {
      "id": "<SCREEN_INSTANCE_ID>",
      "sourceScreen": "projects/<PROJECT_ID>/screens/<SCREEN_ID>"
    }
  }
)
```

### Step 3: Enforce Design System on New & Existing Screens
When generating screens, pass the newly created `designSystem` ID to ensure brand consistency:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "generate_screen_from_text",
  Arguments: {
    "projectId": "<YOUR_PROJECT_ID>",
    "designSystem": "assets/<DESIGN_SYSTEM_ID>",
    "prompt": "Dashboard analytics screen for automotive service tracking."
  }
)
```
