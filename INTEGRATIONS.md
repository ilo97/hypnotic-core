# Animation & Sound Integrations

## Added by Animations Specialist

### 1) Lottie / Theatre.js / Remotion bridge

Files:
- `animation-stack.js`
- `templates/lottie/presets.json`
- `templates/theatre/shot-sequence.json`
- `templates/remotion/compositions.json`

What it does:
- Loads Lottie dynamically (`lottie-web`) and mounts preview animations in the UI.
- Attempts to load Theatre.js core; if unavailable, falls back to GSAP timeline sequencing.
- Builds Remotion payload objects (`composition`, `inputProps`) for backend video rendering/export.

### 2) Web Audio API (hypnotic, no voice)

Files:
- `sound-engine.js`
- `templates/sound/presets.json`

What it does:
- Generates synthetic brand-safe ambient audio (drones, filtered noise, shimmer pulse).
- No vocal tracks, no speech synthesis.
- Provides `start()`, `stop()`, `setIntensity()`, `triggerBlip()` APIs.

### 3) Platform UI wiring

Updated:
- `index.html`

What changed:
- Added controls for audio toggle and Lottie preview.
- Added stack status output.
- Evolution button now triggers:
  - GSAP micro feedback,
  - Audio blip,
  - Theatre.js loading/fallback,
  - Remotion payload generation logging.

## Notes
- Browser autoplay restrictions apply: audio starts only after user interaction.
- Theatre.js is optional at runtime; fallback keeps UX smooth.
- Remotion integration is payload-level for server-side rendering pipelines.
