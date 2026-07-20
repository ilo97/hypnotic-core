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
  },
  {
    id: 'fashion-clothing',
    keywords: ['fashion', 'clothing', 'apparel', 'kıyafet', 'moda', 'giyim', 'elbise', 'tekstil'],
    patch: {
      colors: { base: '#ff2d55', accent: '#111111', background: '#0a0a0a' },
      particles: { count: 26000, size: 0.011, opacity: 0.65 },
      intro: { duration: 2.2, ease: 'power3.out' }
    }
  },
  {
    id: 'jewelry-watch',
    keywords: ['jewelry', 'ring', 'watch', 'takı', 'yüzük', 'küpe', 'kol saati', 'mücevher'],
    patch: {
      colors: { base: '#f2c14e', accent: '#ffffff', background: '#0d0a05' },
      particles: { count: 20000, size: 0.006, opacity: 0.8, waveAmplitude: 0.03 },
      intro: { duration: 3.5, ease: 'sine.inOut' }
    }
  },
  {
    id: 'electronics-gadget',
    keywords: ['electronics', 'gadget', 'phone', 'headphones', 'elektronik', 'telefon', 'kulaklık'],
    patch: {
      colors: { base: '#4dd0ff', accent: '#1a1a2e', background: '#050510' },
      particles: { count: 38000, size: 0.013, colorMorphStrength: 10 },
      mouse: { quickToDuration: 0.4 }
    }
  },
  {
    id: 'real-estate',
    keywords: ['real estate', 'property', 'villa', 'house', 'emlak', 'ev', 'daire', 'gayrimenkul'],
    patch: {
      colors: { base: '#c9a15a', accent: '#f5f0e6', background: '#0f0c08' },
      particles: { count: 16000, size: 0.009, opacity: 0.55, waveAmplitude: 0.06 },
      scroll: { scrub: 2.0 }
    }
  },
  {
    id: 'furniture-home',
    keywords: ['furniture', 'home decor', 'mobilya', 'dekorasyon', 'mefruşat', 'ev eşyası'],
    patch: {
      colors: { base: '#c17f4e', accent: '#f2e6d8', background: '#12100c' },
      particles: { count: 14000, size: 0.01, opacity: 0.5 },
      intro: { duration: 3.0, ease: 'power2.out' }
    }
  },
  {
    id: 'personal-branding',
    keywords: ['personal', 'portrait', 'influencer', 'cv', 'kişisel', 'portre', 'özgeçmiş', 'kendi reklamım'],
    patch: {
      colors: { base: '#e8e8e8', accent: '#b8a9ff', background: '#0a0a0c' },
      particles: { count: 20000, size: 0.008, opacity: 0.6 },
      intro: { duration: 2.8, ease: 'power2.inOut' }
    }
  },
  {
    id: 'fitness-sports',
    keywords: ['fitness', 'gym', 'sports', 'workout', 'spor', 'antrenman', 'egzersiz'],
    patch: {
      colors: { base: '#ff4d00', accent: '#111111', background: '#050505' },
      particles: { count: 42000, size: 0.018, waveAmplitude: 0.08 },
      intro: { duration: 1.2, ease: 'expo.out' }
    }
  },
  {
    id: 'baby-kids',
    keywords: ['baby', 'kids', 'toy', 'bebek', 'çocuk', 'oyuncak'],
    patch: {
      colors: { base: '#ffb3c6', accent: '#a0e7e5', background: '#100a0d' },
      particles: { count: 15000, size: 0.009, opacity: 0.55, waveAmplitude: 0.1 },
      intro: { duration: 3.2, ease: 'sine.inOut' }
    }
  },
  {
    id: 'pet-animal',
    keywords: ['pet', 'dog', 'cat', 'evcil hayvan', 'kedi', 'köpek', 'pati'],
    patch: {
      colors: { base: '#e0a458', accent: '#6b9080', background: '#0d0c08' },
      particles: { count: 17000, size: 0.01, opacity: 0.6 },
      mouse: { quickToDuration: 1.0 }
    }
  },
  {
    id: 'travel-tourism',
    keywords: ['travel', 'tourism', 'vacation', 'seyahat', 'tatil', 'tur', 'uçak bileti'],
    patch: {
      colors: { base: '#3ec6e0', accent: '#ffb26b', background: '#04141a' },
      particles: { count: 24000, waveAmplitude: 0.15, waveFrequency: 2.5 },
      scroll: { scrub: 1.3 }
    }
  },
  {
    id: 'wedding-event',
    keywords: ['wedding', 'event', 'invitation', 'düğün', 'nişan', 'davet', 'organizasyon'],
    patch: {
      colors: { base: '#f5d6ba', accent: '#d4af37', background: '#120d0f' },
      particles: { count: 20000, size: 0.007, opacity: 0.65, waveAmplitude: 0.05 },
      intro: { duration: 3.8, ease: 'sine.inOut' }
    }
  },
  {
    id: 'finance-crypto',
    keywords: ['finance', 'crypto', 'investment', 'finans', 'kripto', 'yatırım', 'borsa'],
    patch: {
      colors: { base: '#00e08a', accent: '#0a0a0a', background: '#020705' },
      particles: { count: 30000, size: 0.01, colorMorphStrength: 6 },
      scroll: { scrub: 1.0 }
    }
  },
  {
    id: 'education-course',
    keywords: ['education', 'course', 'school', 'eğitim', 'kurs', 'okul', 'öğretim'],
    patch: {
      colors: { base: '#4a7dff', accent: '#ffd166', background: '#060810' },
      particles: { count: 18000, size: 0.009, opacity: 0.6 },
      intro: { duration: 2.4, ease: 'power2.out' }
    }
  },
  {
    id: 'health-medical',
    keywords: ['health', 'medical', 'clinic', 'sağlık', 'klinik', 'doktor', 'tıbbi'],
    patch: {
      colors: { base: '#4fd1c5', accent: '#ffffff', background: '#040808' },
      particles: { count: 16000, size: 0.007, opacity: 0.5 },
      scroll: { scrub: 2.2 }
    }
  },
  {
    id: 'gaming-esports',
    keywords: ['gaming', 'esports', 'console', 'oyun', 'konsol'],
    patch: {
      colors: { base: '#b026ff', accent: '#00ffcc', background: '#05000a' },
      particles: { count: 45000, size: 0.016, colorMorphStrength: 18 },
      mouse: { quickToDuration: 0.3 }
    }
  },
  {
    id: 'coffee-cafe',
    keywords: ['coffee', 'cafe', 'espresso', 'kahve', 'kafe'],
    patch: {
      colors: { base: '#a9744f', accent: '#f2e2ce', background: '#100b08' },
      particles: { count: 15000, size: 0.009, opacity: 0.55, waveAmplitude: 0.07 },
      intro: { duration: 2.9, ease: 'sine.inOut' }
    }
  },
  {
    id: 'bakery-dessert',
    keywords: ['bakery', 'dessert', 'cake', 'pasta', 'tatlı', 'fırın', 'çikolata'],
    patch: {
      colors: { base: '#f7a1c4', accent: '#fff1e6', background: '#120a0d' },
      particles: { count: 16000, size: 0.009, opacity: 0.6, waveAmplitude: 0.08 },
      intro: { duration: 3.0, ease: 'sine.inOut' }
    }
  },
  {
    id: 'sneakers-street',
    keywords: ['sneakers', 'shoes', 'streetwear', 'ayakkabı', 'sneaker'],
    patch: {
      colors: { base: '#ffe600', accent: '#111111', background: '#050505' },
      particles: { count: 34000, size: 0.017, waveAmplitude: 0.06 },
      intro: { duration: 1.3, ease: 'expo.out' }
    }
  },
  {
    id: 'flowers-florist',
    keywords: ['flowers', 'florist', 'bouquet', 'çiçek', 'çiçekçi', 'buket'],
    patch: {
      colors: { base: '#ff8fab', accent: '#a3c9a8', background: '#0d0a0c' },
      particles: { count: 14000, size: 0.008, opacity: 0.55, waveAmplitude: 0.09 },
      intro: { duration: 3.4, ease: 'sine.inOut' }
    }
  },
  {
    id: 'photography-camera',
    keywords: ['photography', 'camera', 'photographer', 'fotoğraf', 'kamera', 'çekim'],
    patch: {
      colors: { base: '#c0c0c0', accent: '#ff6b3d', background: '#030303' },
      particles: { count: 19000, size: 0.008, opacity: 0.55 },
      scroll: { scrub: 1.7 }
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
