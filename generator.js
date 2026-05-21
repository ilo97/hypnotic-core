#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { mapPromptToParams, normalizeParams } = require('./config');

const PROTOTYPE_PATH = '/home/team/shared/prototype/index.html';
const OUTPUT_DIR = '/home/team/shared/platform/generated';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      out[key] = true;
      continue;
    }
    out[key] = next;
    i += 1;
  }
  return out;
}

function parseBool(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return value;
  const v = value.toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(v)) return true;
  if (['false', '0', 'no', 'off'].includes(v)) return false;
  return value;
}

function buildHtml(params) {
  const cfg = JSON.stringify(params, null, 2);

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${params.headline} | Generated 3D Experience</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400&family=Playfair+Display:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:100%;background:${params.bgColor};font-family:'Inter',sans-serif;color:#fff}
    body{min-height:${params.scrollEnabled ? '320vh' : '100vh'};overflow-x:hidden;overflow-y:${params.scrollEnabled ? 'auto' : 'hidden'}}
    canvas{position:fixed;inset:0;width:100%;height:100%;z-index:1}
    .overlay{position:fixed;inset:0;z-index:2;display:flex;flex-direction:column;justify-content:space-between;padding:60px;pointer-events:none;opacity:0}
    header{display:flex;justify-content:space-between;align-items:flex-start;pointer-events:auto}
    .logo{font-size:16px;font-weight:300;letter-spacing:.4em;text-transform:uppercase}
    nav ul{list-style:none;display:flex;gap:30px;opacity:0;transform:translateY(-10px);transition:.5s cubic-bezier(.19,1,.22,1)}
    header:hover nav ul{opacity:1;transform:translateY(0)}
    nav a{color:rgba(255,255,255,.55);text-decoration:none;font-size:11px;letter-spacing:.2em;text-transform:uppercase;transition:.3s}
    nav a:hover{color:${params.primaryColor}}
    .main-title{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}
    .main-title h1{font-family:'Playfair Display',serif;font-size:clamp(40px,8vw,80px);font-weight:400;font-style:italic;letter-spacing:.05em;margin-bottom:10px}
    .main-title p{font-size:12px;font-weight:200;letter-spacing:.5em;text-transform:uppercase;color:rgba(255,255,255,.42)}
    footer{display:flex;justify-content:space-between;align-items:flex-end}
    .footer-text{font-size:10px;letter-spacing:.2em;color:rgba(255,255,255,.3);text-transform:uppercase}
    .scroll-hint{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:${params.primaryColor};display:${params.scrollEnabled ? 'flex' : 'none'};align-items:center;gap:15px}
    .scroll-line{width:1px;height:40px;background:linear-gradient(to bottom, ${params.primaryColor}, transparent)}
    .scroll-space{height:${params.scrollEnabled ? '320vh' : '100vh'};opacity:0}
  </style>
</head>
<body>
  <div class="overlay">
    <header>
      <div class="logo">Aesthetic.Studio</div>
      <nav><ul><li><a href="#">Works</a></li><li><a href="#">Process</a></li><li><a href="#">Connect</a></li></ul></nav>
    </header>
    <div class="main-title"><h1>${params.headline}</h1><p>${params.subtitle}</p></div>
    <footer>
      <div class="footer-text">Built with Passion & Code</div>
      <div class="scroll-hint"><span>Explore</span><div class="scroll-line"></div></div>
    </footer>
  </div>
  <canvas id="webgl"></canvas>
  <div class="scroll-space" aria-hidden="true"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script>
    const CONFIG = ${cfg};
    gsap.registerPlugin(ScrollTrigger);

    const scene = new THREE.Scene();
    const canvas = document.querySelector('#webgl');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4;

    const count = CONFIG.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const scatteredPositions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = 1.3;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      originalPositions[i] = x;
      originalPositions[i + 1] = y;
      originalPositions[i + 2] = z;

      scatteredPositions[i] = (Math.random() - 0.5) * 10;
      scatteredPositions[i + 1] = (Math.random() - 0.5) * 10;
      scatteredPositions[i + 2] = (Math.random() - 0.5) * 10;

      positions[i] = CONFIG.introEnabled ? scatteredPositions[i] : x;
      positions[i + 1] = CONFIG.introEnabled ? scatteredPositions[i + 1] : y;
      positions[i + 2] = CONFIG.introEnabled ? scatteredPositions[i + 2] : z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const intro = { progress: CONFIG.introEnabled ? 0 : 1 };
    if (CONFIG.introEnabled) {
      gsap.to(intro, { progress: 1, duration: 2.5, delay: 0.2, ease: 'power2.inOut' });
    }

    const material = new THREE.PointsMaterial({
      size: 0.012,
      color: CONFIG.primaryColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    const mouse = { x: 0, y: 0 };
    const setMouseX = gsap.quickTo(mouse, 'x', { duration: 0.8, ease: 'power3.out' });
    const setMouseY = gsap.quickTo(mouse, 'y', { duration: 0.8, ease: 'power3.out' });

    let mouseSpeed = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    window.addEventListener('mousemove', (event) => {
      const targetX = (event.clientX / window.innerWidth) * 2 - 1;
      const targetY = -(event.clientY / window.innerHeight) * 2 + 1;
      setMouseX(targetX);
      setMouseY(targetY);
    });

    const scrollState = { progress: 0 };
    if (CONFIG.scrollEnabled) {
      gsap.to(scrollState, {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.scroll-space', start: 'top top', end: 'bottom bottom', scrub: 1.2 }
      });

      gsap.to('.main-title', {
        opacity: 0,
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: '.scroll-space', start: 'top top', end: '45% top', scrub: true }
      });
    }

    gsap.to('.scroll-line', { scaleY: 0.15, transformOrigin: 'top', repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut' });

    gsap.timeline({ delay: CONFIG.introEnabled ? 3.0 : 0.2, defaults: { ease: 'power3.out' } })
      .to('.overlay', { opacity: 1, duration: 1.2 }, 0)
      .from('.main-title h1', { y: 30, opacity: 0, duration: 0.95 }, 0.15)
      .from('.main-title p', { y: 18, opacity: 0, duration: 0.8 }, 0.35)
      .from('.logo', { y: -14, opacity: 0, duration: 0.75 }, 0.25)
      .from('.footer-text, .scroll-hint', { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.45);

    const clock = new THREE.Clock();
    const baseColor = new THREE.Color(CONFIG.primaryColor);
    const targetColor = new THREE.Color(CONFIG.secondaryColor);

    const tick = () => {
      const elapsed = clock.getElapsedTime();
      const dx = mouse.x - lastMouseX;
      const dy = mouse.y - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      mouseSpeed += (dist - mouseSpeed) * 0.1;
      lastMouseX = mouse.x;
      lastMouseY = mouse.y;

      material.color.copy(baseColor).lerp(targetColor, Math.min(mouseSpeed * 8, 1));

      const scrollP = scrollState.progress;
      const rotBase = CONFIG.rotationSpeed;
      particleSystem.rotation.y = elapsed * rotBase + scrollP * (CONFIG.scrollEnabled ? 0.95 : 0);
      particleSystem.rotation.x = elapsed * (rotBase * 0.4) + scrollP * (CONFIG.scrollEnabled ? 0.22 : 0);

      const pos = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const sx = scatteredPositions[i3];
        const sy = scatteredPositions[i3 + 1];
        const sz = scatteredPositions[i3 + 2];
        const tx = originalPositions[i3];
        const ty = originalPositions[i3 + 1];
        const tz = originalPositions[i3 + 2];

        const cx = sx + (tx - sx) * intro.progress;
        const cy = sy + (ty - sy) * intro.progress;
        const cz = sz + (tz - sz) * intro.progress;

        const wave = Math.sin(tx * 2 + elapsed) * 0.12 * Math.cos(ty * 2 + elapsed) * intro.progress;
        pos.array[i3] = cx + tx * wave + mouse.x * 0.15 * intro.progress;
        pos.array[i3 + 1] = cy + ty * wave + mouse.y * 0.15 * intro.progress;
        pos.array[i3 + 2] = cz + tz * wave;
      }
      pos.needsUpdate = true;

      const cameraTargetX = THREE.MathUtils.lerp(0, 0.95, scrollP) + mouse.x * 0.35;
      const cameraTargetY = THREE.MathUtils.lerp(0, 0.7, scrollP) + mouse.y * 0.35;
      const cameraTargetZ = THREE.MathUtils.lerp(4, 2.55, scrollP);
      camera.position.x += (cameraTargetX - camera.position.x) * 0.05;
      camera.position.y += (cameraTargetY - camera.position.y) * 0.05;
      camera.position.z += (cameraTargetZ - camera.position.z) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };

    tick();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      ScrollTrigger.refresh();
    });
  </script>
</body>
</html>`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const prompt = args.prompt ? String(args.prompt) : '';

  const mapped = mapPromptToParams(prompt);

  const directParams = {};
  if (args.primaryColor !== undefined) directParams.primaryColor = args.primaryColor;
  if (args.secondaryColor !== undefined) directParams.secondaryColor = args.secondaryColor;
  if (args.headline !== undefined) directParams.headline = args.headline;
  if (args.subtitle !== undefined) directParams.subtitle = args.subtitle;
  if (args.particleCount !== undefined) directParams.particleCount = args.particleCount;
  if (args.bgColor !== undefined) directParams.bgColor = args.bgColor;
  if (args.rotationSpeed !== undefined) directParams.rotationSpeed = args.rotationSpeed;
  if (args.introEnabled !== undefined) directParams.introEnabled = parseBool(args.introEnabled);
  if (args.scrollEnabled !== undefined) directParams.scrollEnabled = parseBool(args.scrollEnabled);

  const params = normalizeParams({ ...mapped.params, ...directParams });

  if (!fs.existsSync(PROTOTYPE_PATH)) {
    console.warn(`Warning: Prototype not found at ${PROTOTYPE_PATH}. Generating from embedded template.`);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const outputPath = path.join(OUTPUT_DIR, 'index.html');
  const paramsPath = path.join(OUTPUT_DIR, 'index.params.json');

  fs.writeFileSync(outputPath, buildHtml(params), 'utf8');
  fs.writeFileSync(paramsPath, JSON.stringify({ prompt, appliedMappings: mapped.applied, params }, null, 2), 'utf8');

  console.log(JSON.stringify({
    output: outputPath,
    paramsFile: paramsPath,
    appliedMappings: mapped.applied,
    params
  }, null, 2));
}

main();
