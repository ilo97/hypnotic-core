// Sound profile config for template categories
// Rule: no voice, no lyrics, no speaker tracks

window.SoundProfiles = {
  beverage: {
    label: 'Beverage',
    cues: ['glassy-clink', 'micro-bubble-pop', 'can-open-pssh'],
    synth: { baseHz: 240, shimmerHz: 960, noiseBand: 780, pulseRate: 1.2 },
    mix: { drone: 0.28, foley: 0.52, transient: 0.42 }
  },
  fashion: {
    label: 'Fashion',
    cues: ['silk-rustle', 'soft-chime', 'airy-sweep'],
    synth: { baseHz: 196, shimmerHz: 1200, noiseBand: 560, pulseRate: 0.85 },
    mix: { drone: 0.36, foley: 0.34, transient: 0.22 }
  },
  tech: {
    label: 'Tech',
    cues: ['digital-blip', 'neural-hum', 'scanner-sweep'],
    synth: { baseHz: 130.81, shimmerHz: 1320, noiseBand: 920, pulseRate: 1.8 },
    mix: { drone: 0.52, foley: 0.22, transient: 0.56 }
  },
  automotive: {
    label: 'Automotive',
    cues: ['engine-growl', 'tire-whoosh', 'nitro-hit'],
    synth: { baseHz: 82.4, shimmerHz: 720, noiseBand: 420, pulseRate: 2.2 },
    mix: { drone: 0.64, foley: 0.31, transient: 0.61 }
  },
  luxury: {
    label: 'Luxury',
    cues: ['glass-clink-soft', 'piano-pad', 'velvet-air'],
    synth: { baseHz: 110, shimmerHz: 1000, noiseBand: 520, pulseRate: 0.72 },
    mix: { drone: 0.44, foley: 0.24, transient: 0.18 }
  }
};

window.getSoundProfile = function getSoundProfile(category) {
  const key = String(category || '').toLowerCase();
  return window.SoundProfiles[key] || window.SoundProfiles.tech;
};
