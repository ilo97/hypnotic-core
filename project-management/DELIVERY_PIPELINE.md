# Delivery Pipeline & Team Workflow

This document defines the automated and manual steps from a Client Order to final Delivery.

## Step 1: Client Onboarding & Briefing (Project Manager)
- Fill out the `order-template.md`.
- Assign Task IDs in the team database.
- Deadline: **T+0**

## Step 2: AI Foundation & Scene Generation (AI Engineer)
- Input Brief into the AI Pipeline (`run_pipeline.py`).
- Generate initial Style Detection & 3D Auto-Config.
- Artifact: `scene-config.json`.
- Deadline: **T+1**

## Step 3: Creative 3D Development (3D Developer & GLSL Engineer)
- Load `scene-config.json` into the engine.
- Refine 3D models, textures, and custom shaders.
- Implement high-end interactions (GSAP/ScrollTrigger).
- Deadline: **T+3**

## Step 4: Sound Design Integration (Sound Designer)
- Select/Create sound profile based on `scene-config.json` mood.
- Integrate Web Audio API or ASMR layers.
- Deadline: **T+4**

## Step 5: Quality Assurance & Creative Direction (Creative Director)
- Review against "Satisfying" & "Hypnotic" standards.
- Check Performance (60 FPS) and cross-device stability.
- Approval/Request for iteration.
- Deadline: **T+5**

## Step 6: Client Delivery & Handoff (Project Manager)
- Final deployment to Vercel/Netlify.
- Handoff of source code or hosted link.
- Client Follow-up.
- Deadline: **T+6**

---
*Note: Timelines are indicative and depend on the Budget Tier.*
