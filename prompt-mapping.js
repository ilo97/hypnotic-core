const DEFAULT_CONFIG = {
  brandName: 'Aesthetic.Studio',
  title: 'Hypnotic Core',
  subtitle: 'Digital Art Experiment No. 01',
  colors: {
    background: '#030303',
    base: '#00ffcc',
    accent: '#8800ff'
  },
  particles: {
    count: 25000,
    sphereRadius: 1.3,
    scatterSpread: 10,
    size: 0.012,
    opacity: 0.8,
    waveAmplitude: 0.12,
    waveFrequency: 2,
    mouseInfluence: 0.15,
    colorMorphStrength: 8
  },
  intro: {
    duration: 2.5,
    delay: 0.2,
    ease: 'power2.inOut',
    overlayOffset: 0.3
  },
  mouse: {
    quickToDuration: 0.8,
    quickToEase: 'power3.out',
    cameraInfluence: 0.35
  },
  scroll: {
    heightVh: 320,
    scrub: 1.2,
    titleFadeEnd: 45,
    hintFadeEnd: 30,
    cameraEnd: {
      x: 0.95,
      y: 0.7,
      z: 2.55
    },
    rotation: {
      y: 0.95,
      x: 0.22
    }
  }
};

const RULES = [
  {
    id: 'luxury',
    keywords: ['luxury', 'premium', 'elegant', 'high-end', 'luxus', 'edel', 'fashion', 'vogue'],
    patch: {
      colors: { base: '#d4af37', accent: '#ffffff', background: '#0a0a0a' },
      intro: { duration: 3.2, ease: 'power3.inOut' },
      scroll: { scrub: 1.8, cameraEnd: { x: 0.7, y: 0.5, z: 2.8 } },
      particles: { count: 30000, size: 0.01, opacity: 0.7 }
    }
  },
  {
    id: 'tech-cyber',
    keywords: ['tech', 'neon', 'cyber', 'digital', 'ai', 'future', 'robotics'],
    patch: {
      colors: { base: '#00ffcc', accent: '#0066ff', background: '#020205' },
      particles: { count: 40000, size: 0.015, colorMorphStrength: 12 },
      mouse: { quickToDuration: 0.5, cameraInfluence: 0.45 }
    }
  },
  {
    id: 'beverage-refreshing',
    keywords: ['beverage', 'drink', 'refreshing', 'water', 'ice', 'cold', 'soda'],
    patch: {
      colors: { base: '#70d6ff', accent: '#ffffff', background: '#001524' },
      particles: { count: 22000, waveAmplitude: 0.18, waveFrequency: 3 },
      scroll: { scrub: 1.0 }
    }
  },
  {
    id: 'automotive-speed',
    keywords: ['car', 'automotive', 'speed', 'racing', 'engine', 'power', 'fast'],
    patch: {
      colors: { base: '#ff0033', accent: '#ffffff', background: '#050505' },
      particles: { count: 45000, size: 0.02, waveAmplitude: 0.05 },
      scroll: { scrub: 0.5, rotation: { y: 2.5, x: 0.5 } },
      intro: { duration: 1.5, ease: 'expo.out' }
    }
  },
  {
    id: 'food-organic',
    keywords: ['food', 'organic', 'nature', 'fresh', 'healthy', 'cooking'],
    patch: {
      colors: { base: '#a7c957', accent: '#f2e8cf', background: '#132a13' },
      particles: { count: 18000, sphereRadius: 1.5, waveAmplitude: 0.1 },
      mouse: { quickToDuration: 1.2 }
    }
  },
  {
    id: 'cosmetics-beauty',
    keywords: ['cosmetics', 'beauty', 'skincare', 'makeup', 'soft', 'glow'],
    patch: {
      colors: { base: '#ffccd5', accent: '#ffffff', background: '#1a0a0c' },
      particles: { count: 28000, size: 0.008, opacity: 0.6, waveAmplitude: 0.05 },
      intro: { duration: 4.0, ease: 'sine.inOut' }
    }
  },
  {
    id: 'music-mystic',
    keywords: ['music', 'mystic', 'vibe', 'psychedelic', 'sound', 'beats', 'art'],
    patch: {
      colors: { base: '#8a2be2', accent: '#00ffcc', background: '#05000a' },
      particles: { count: 35000, waveAmplitude: 0.25, waveFrequency: 4, colorMorphStrength: 15 },
      scroll: { scrub: 1.5 }
    }
  },
  {
    id: 'minimal-zen',
    keywords: ['minimal', 'zen', 'clean', 'simple', 'white', 'pure'],
    patch: {
      colors: { base: '#ffffff', accent: '#888888', background: '#000000' },
      particles: { count: 12000, size: 0.007, opacity: 0.5, waveAmplitude: 0.04 },
      scroll: { scrub: 2.5, cameraEnd: { x: 0.3, y: 0.3, z: 3.5 } }
    }
  }
];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyPromptDirectives(config, prompt, applied) {
  const lower = prompt.toLowerCase();

  const colors = lower.match(/#(?:[0-9a-f]{3}){1,2}\b/gi);
  if (colors?.length) {
    config.colors.base = colors[0];
    applied.push(`custom-base-color:${colors[0]}`);
  }
  if (colors?.[1]) {
    config.colors.accent = colors[1];
    applied.push(`custom-accent-color:${colors[1]}`);
  }

  const countMatch = lower.match(/(\d{4,6})\s*(particles|partikel)/);
  if (countMatch?.[1]) {
    const parsed = clamp(Number(countMatch[1]), 5000, 80000);
    if (!Number.isNaN(parsed)) {
      config.particles.count = parsed;
      applied.push(`custom-particles:${parsed}`);
    }
  }
}

function buildConfigFromPrompt(prompt = '') {
  const config = deepClone(DEFAULT_CONFIG);
  const lowerPrompt = prompt.toLowerCase();
  const applied = [];

  for (const rule of RULES) {
    const matched = rule.keywords.some((kw) => lowerPrompt.includes(kw));
    if (matched) {
      deepMerge(config, rule.patch);
      applied.push(rule.id);
    }
  }

  applyPromptDirectives(config, prompt, applied);

  return {
    config,
    appliedRules: applied
  };
}

// Export for Node and Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEFAULT_CONFIG,
    RULES,
    buildConfigFromPrompt,
    deepMerge,
    deepClone
  };
}

if (typeof window !== 'undefined') {
  window.PromptMapping = {
    buildConfigFromPrompt,
    RULES
  };
}
