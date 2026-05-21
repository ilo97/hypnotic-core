(function initHypnoticAudio(global) {
  const state = {
    started: false,
    muted: false,
    intensity: 0.45,
    context: null,
    masterGain: null,
    nodes: []
  };

  function createContext() {
    if (!state.context) {
      const Ctx = global.AudioContext || global.webkitAudioContext;
      if (!Ctx) return null;
      state.context = new Ctx();
      state.masterGain = state.context.createGain();
      state.masterGain.gain.value = 0;
      state.masterGain.connect(state.context.destination);
    }
    return state.context;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeDrone(freq, type = 'sine', gain = 0.05) {
    const ctx = state.context;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.8;

    amp.gain.value = 0;

    osc.connect(filter);
    filter.connect(amp);
    amp.connect(state.masterGain);

    osc.start();
    amp.gain.linearRampToValueAtTime(gain * state.intensity, ctx.currentTime + 3.2);

    state.nodes.push({ osc, amp, filter });
  }

  function makeBreathingNoise() {
    const ctx = state.context;
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 640;
    filter.Q.value = 0.5;

    const amp = ctx.createGain();
    amp.gain.value = 0;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = rand(0.06, 0.12);
    lfoGain.gain.value = 420;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(amp);
    amp.connect(state.masterGain);

    source.start();
    lfo.start();

    amp.gain.linearRampToValueAtTime(0.038 * state.intensity, ctx.currentTime + 4);

    state.nodes.push({ source, amp, filter, lfo, lfoGain });
  }

  function createShimmerPulse() {
    const ctx = state.context;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    const hp = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = 1200;

    hp.type = 'highpass';
    hp.frequency.value = 600;

    amp.gain.value = 0;

    osc.connect(hp);
    hp.connect(amp);
    amp.connect(state.masterGain);

    osc.start();

    const pulse = () => {
      const t = ctx.currentTime;
      const peak = 0.012 * state.intensity;
      amp.gain.cancelScheduledValues(t);
      amp.gain.setValueAtTime(0.0001, t);
      amp.gain.linearRampToValueAtTime(peak, t + 0.08);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + rand(1.2, 2.5));
    };

    pulse();
    const interval = global.setInterval(pulse, 1800);
    state.nodes.push({ osc, amp, hp, interval });
  }

  function triggerBlip(frequency = 880) {
    if (!state.started || state.muted) return;
    const ctx = state.context;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency;

    osc.connect(amp);
    amp.connect(state.masterGain);

    const t = ctx.currentTime;
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(0.07 * state.intensity, t + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc.start(t);
    osc.stop(t + 0.23);
  }

  async function start() {
    const ctx = createContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') await ctx.resume();

    if (!state.started) {
      makeDrone(110, 'sine', 0.07);
      makeDrone(164.81, 'triangle', 0.045);
      makeBreathingNoise();
      createShimmerPulse();
      state.started = true;
    }

    const t = ctx.currentTime;
    state.masterGain.gain.cancelScheduledValues(t);
    state.masterGain.gain.linearRampToValueAtTime(0.5, t + 1.6);
    state.muted = false;
    return true;
  }

  function stop() {
    if (!state.context) return;

    const t = state.context.currentTime;
    state.masterGain.gain.cancelScheduledValues(t);
    state.masterGain.gain.linearRampToValueAtTime(0.0001, t + 1.1);
    state.muted = true;
  }

  function setIntensity(value) {
    state.intensity = Math.min(1, Math.max(0.1, Number(value) || 0.45));
  }

  global.HypnoticAudio = {
    state,
    start,
    stop,
    setIntensity,
    triggerBlip
  };
})(window);
