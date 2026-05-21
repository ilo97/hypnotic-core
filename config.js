const DEFAULT_PARAMS = {
  primaryColor: '#00ffcc',
  secondaryColor: '#8800ff',
  headline: 'Hypnotic Core',
  subtitle: 'Digital Art Experiment No. 01',
  particleCount: 25000,
  bgColor: '#030303',
  rotationSpeed: 0.05,
  introEnabled: true,
  scrollEnabled: true
};

const PROMPT_MAPPINGS = [
  {
    id: 'luxury-premium-gold',
    keywords: ['luxury', 'gold', 'premium', 'luxus', 'edel'],
    params: {
      primaryColor: '#d4af37',
      secondaryColor: '#ffdf73',
      bgColor: '#0c0904',
      rotationSpeed: 0.025,
      headline: 'Pure Opulence',
      subtitle: 'The Essence of Luxury'
    }
  },
  {
    id: 'tech-neon-cyber',
    keywords: ['tech', 'neon', 'cyber', 'digital', 'future'],
    params: {
      primaryColor: '#00eaff',
      secondaryColor: '#ff00f5',
      bgColor: '#070617',
      rotationSpeed: 0.085,
      headline: 'Cyber Reality',
      subtitle: 'Neural Network Active'
    }
  },
  {
    id: 'beverage-refreshing',
    keywords: ['beverage', 'drink', 'refreshing', 'water', 'cold'],
    params: {
      primaryColor: '#70d6ff',
      secondaryColor: '#ffffff',
      bgColor: '#001524',
      rotationSpeed: 0.04,
      headline: 'Liquid Frost',
      subtitle: 'Pure Refreshment'
    }
  },
  {
    id: 'fashion-vogue',
    keywords: ['fashion', 'vogue', 'style', 'runway'],
    params: {
      primaryColor: '#ff0055',
      secondaryColor: '#ffffff',
      bgColor: '#0a0a0a',
      rotationSpeed: 0.03,
      headline: 'Aesthetic Motion',
      subtitle: 'Design in Flux'
    }
  },
  {
    id: 'automotive-speed',
    keywords: ['car', 'automotive', 'speed', 'racing'],
    params: {
      primaryColor: '#ff0000',
      secondaryColor: '#ffffff',
      bgColor: '#050505',
      rotationSpeed: 0.09,
      headline: 'Raw Power',
      subtitle: 'Engineered Velocity'
    }
  },
  {
    id: 'food-organic',
    keywords: ['food', 'organic', 'nature', 'fresh'],
    params: {
      primaryColor: '#7ddf64',
      secondaryColor: '#8f6b3f',
      bgColor: '#0a1208',
      rotationSpeed: 0.03,
      headline: 'Organic Bloom',
      subtitle: 'Grown by Nature'
    }
  },
  {
    id: 'cosmetics-beauty',
    keywords: ['cosmetics', 'beauty', 'skincare', 'soft'],
    params: {
      primaryColor: '#ffccd5',
      secondaryColor: '#ffffff',
      bgColor: '#1a0a0c',
      rotationSpeed: 0.02,
      headline: 'Soft Radiance',
      subtitle: 'Luminous Beauty'
    }
  },
  {
    id: 'music-mystic',
    keywords: ['music', 'mystic', 'sound', 'beats'],
    params: {
      primaryColor: '#8a2be2',
      secondaryColor: '#00ffcc',
      bgColor: '#05000a',
      rotationSpeed: 0.06,
      headline: 'Sonic Waves',
      subtitle: 'Hypnotic Vibrations'
    }
  }
];

function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof out[key] === 'object' &&
      out[key] !== null
    ) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeHex(color, fallback) {
  if (typeof color !== 'string') return fallback;
  const c = color.trim();
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c) ? c : fallback;
}

function toBoolean(value, fallback = true) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;
  const v = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(v)) return true;
  if (['false', '0', 'no', 'off'].includes(v)) return false;
  return fallback;
}

function normalizeParams(input = {}) {
  const merged = deepMerge(DEFAULT_PARAMS, input);

  return {
    primaryColor: sanitizeHex(merged.primaryColor, DEFAULT_PARAMS.primaryColor),
    secondaryColor: sanitizeHex(merged.secondaryColor, DEFAULT_PARAMS.secondaryColor),
    headline: String(merged.headline || DEFAULT_PARAMS.headline).slice(0, 120),
    subtitle: String(merged.subtitle || DEFAULT_PARAMS.subtitle).slice(0, 220),
    particleCount: clamp(Number(merged.particleCount) || DEFAULT_PARAMS.particleCount, 5000, 50000),
    bgColor: sanitizeHex(merged.bgColor, DEFAULT_PARAMS.bgColor),
    rotationSpeed: clamp(Number(merged.rotationSpeed) || DEFAULT_PARAMS.rotationSpeed, 0.01, 0.1),
    introEnabled: toBoolean(merged.introEnabled, DEFAULT_PARAMS.introEnabled),
    scrollEnabled: toBoolean(merged.scrollEnabled, DEFAULT_PARAMS.scrollEnabled)
  };
}

function mapPromptToParams(prompt = '') {
  const lower = String(prompt).toLowerCase();
  const applied = [];
  let params = { ...DEFAULT_PARAMS };

  for (const rule of PROMPT_MAPPINGS) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      params = deepMerge(params, rule.params);
      applied.push(rule.id);
    }
  }

  return {
    params: normalizeParams(params),
    applied
  };
}

module.exports = {
  DEFAULT_PARAMS,
  PROMPT_MAPPINGS,
  mapPromptToParams,
  normalizeParams
};
