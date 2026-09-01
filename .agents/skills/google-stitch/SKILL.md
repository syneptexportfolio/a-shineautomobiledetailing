---
name: google-stitch
description: Master guide and workflows for using Google Stitch MCP to design web and mobile interfaces, manage design systems, generate UI variants, edit screens, and convert designs into clean Next.js/HTML/CSS code.
---

# Google Stitch Design Skill Guide

## Overview
Google Stitch is an AI-powered UI design workbench and component generation system. Through the `StitchMCP` integration in Antigravity, you can create design projects, define design systems, generate full-page UI screens, produce visual variants, edit UI layouts with natural language, and convert Stitch outputs into production-grade frontend code.

---

## Available Stitch MCP Tools

| Action | Tool Name | Key Parameters |
| :--- | :--- | :--- |
| **Create Project** | `create_project` | `title` |
| **List Projects** | `list_projects` | `filter` ("view=owned" / "view=shared") |
| **Get Project Info** | `get_project` | `projectId` |
| **Delete Project** | `delete_project` | `projectId` |
| **Generate Screen** | `generate_screen_from_text` | `projectId`, `prompt`, `deviceType`, `modelId`, `designSystem` |
| **Get Screen Details** | `get_screen` | `projectId`, `screenId` |
| **List Screens** | `list_screens` | `projectId` |
| **Edit Screens** | `edit_screens` | `projectId`, `selectedScreenIds`, `prompt`, `deviceType`, `modelId` |
| **Generate Variants** | `generate_variants` | `projectId`, `selectedScreenId`, `prompt`, `variantCount` |
| **Create Design System** | `create_design_system` | `projectId`, `name`, `colorScheme`, `typography` |
| **Design System from MD** | `create_design_system_from_design_md` | `projectId`, `selectedScreenInstance` |
| **Upload DESIGN.md** | `upload_design_md` | `projectId`, `designMdContent` |
| **Apply Design System** | `apply_design_system` | `projectId`, `designSystemId`, `screenIds` |
| **List Design Systems** | `list_design_systems` | `projectId` |

---

## Workflow Guide: Designing a Web App with Stitch

### Step 1: Initialize Project
Start by listing existing projects or creating a dedicated project container:
```json
// Example: Creating a new project
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "create_project",
  Arguments: { "title": "Modern Auto Detailing Web App" }
)
```

### Step 2: Establish Design System (Optional but Recommended)
Define brand colors, typography, border styles, and theme parameters:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "create_design_system",
  Arguments: {
    "projectId": "<YOUR_PROJECT_ID>",
    "name": "Luxury Dark Mode System"
  }
)
```

### Step 3: Generate Initial UI Screens
Create landing pages, dashboards, or detail screens using detailed prompts:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "generate_screen_from_text",
  Arguments: {
    "projectId": "<YOUR_PROJECT_ID>",
    "deviceType": "DESKTOP",
    "modelId": "GEMINI_3_1_PRO",
    "prompt": "Sleek, high-converting landing page for an automotive detailing studio. Features: Dark glassmorphic navigation bar, Hero section with high-contrast headline, interactive package pricing cards, customer reviews slider, contact form, and footer."
  }
)
```

> [!NOTE]
> Screen generation is asynchronous and may take up to 2 minutes. If a timeout occurs, do not retry `generate_screen_from_text`. Periodically check status using `get_screen`.

### Step 4: Refine & Edit UI Elements
Use `edit_screens` to modify specific sections or introduce new features:
```json
call_mcp_tool(
  ServerName: "StitchMCP",
  ToolName: "edit_screens",
  Arguments: {
    "projectId": "<YOUR_PROJECT_ID>",
    "selectedScreenIds": ["<SCREEN_ID>"],
    "prompt": "Add a floating booking CTA button at the bottom right corner, and upgrade the pricing table to include badge tags for 'Most Popular'."
  }
)
```

### Step 5: Convert Stitch Output to Production Code
Once screen designs are finalized:
1. Retrieve component structure and screen specs using `get_screen`.
2. Implement clean React/Next.js/HTML components.
3. Apply modern CSS styling (smooth gradients, glassmorphism, responsive grid, Inter/Outfit typography, micro-interactions).
4. Verify layout responsiveness and visual appeal.
