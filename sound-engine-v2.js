/**
 * Hypnotic Sound Engine — Web Audio API
 * ---------------------------------------
 * Core engine for the Nisro Creative Coding platform.
 * Rules: No voice, no lyrics, no speaker tracks.
 *
 * Architecture:
 *   Layer 1: Hypnotic Drone (sine + triangle, AM/FM modulated at Theta/Alpha rates)
 *   Layer 2: ASMR Noise Texture (pink / band-limited noise)
 *   Layer 3: Transient / Foley layer (synthesized product sounds)
 *   Layer 4: Scroll-based morphing between frequency states
 *   Layer 5: Mouse-speed reactive intensity modulation
 */

window.HypnoticSoundEngine = class HypnoticSoundEngine {
  /**
   * @param {Object} profile — Sound profile from SoundProfiles
   */
  constructor(profile) {
    this.profile = profile;
    this.ctx = null;
    this.started = false;
    this.mouseSpeed = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.scrollProgress = 0;

    // Audio nodes
    this.master = null;
    this.droneGain = null;
    this.tensionGain = null;
    this.noiseGain = null;
    this.subGain = null;
    this.thetaGain = null;

    // Oscillators
    this.droneOsc = null;
    this.tensionOsc = null;
    this.subOsc = null;
    this.thetaMod = null;       // LFO for Theta/Alpha wave modulation
    this.thetaModGain = null;
    this.ampMod = null;         // AM oscillator for hypnotic pulse
    this.ampModGain = null;

    // Noise
    this.noiseNode = null;
    this.noiseFilter = null;
    this.noiseGrainMod = null;  // LFO for grain texture

    // Foley tone generators (Howler-based) — created externally
    this.foleyLayers = [];

    // Callbacks
    this.onStatusChange = null;
  }

  // ──────────────────────────────────────
  //  PUBLIC API
  // ──────────────────────────────────────

  /** Initialise the AudioContext and build the node graph */
  init(profile) {
    this.profile = profile || this.profile;
    if (!this.profile) throw new Error('SoundEngine.init() requires a profile');

    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();

    this._buildGraph();
    this._connectGraph();
    this._startOscillators();
    this.started = true;

    return this;
  }

  /** Fade in over `duration` seconds */
  async start(duration = 1.4) {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    const t = this.ctx.currentTime;
    const p = this.profile;

    this._rampParam(this.master.gain, 0, p.mix.master, t, duration);
    this._rampParam(this.droneGain, 0, p.mix.drone * 0.18, t, duration + 0.2);
    this._rampParam(this.subGain, 0, p.mix.drone * 0.08, t, duration + 0.3);
    this._rampParam(this.tensionGain, 0, p.mix.transient * 0.06, t, duration + 0.2);
    this._rampParam(this.noiseGain, 0, p.mix.foley * 0.05, t, duration + 0.3);
    this._rampParam(this.thetaGain, 0, p.hypnosis.depth * 0.5, t, duration + 0.4);

    return this;
  }

  /** Fade out over `duration` seconds */
  stop(duration = 0.9) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.linearRampToValueAtTime(0.0001, t + duration);

    if (this.foleyLayers.length) {
      this.foleyLayers.forEach(l => {
        if (l.playing && l.playing()) {
          l.fade(l.volume(), 0, duration * 1000);
        }
      });
    }

    setTimeout(() => {
      if (this.ctx && this.ctx.state !== 'closed') this.ctx.close();
      this.started = false;
    }, (duration + 0.5) * 1000);

    return this;
  }

  /** Switch to a new sound profile mid-flight */
  morphToProfile(profile, transitionSec = 0.4) {
    this.profile = profile;
    if (!this.ctx || !this.started) return this;

    const t = this.ctx.currentTime;

    // Synth param transitions
    this.droneOsc.frequency.setTargetAtTime(profile.synth.baseHz, t, transitionSec);
    this.noiseFilter.frequency.setTargetAtTime(profile.synth.noiseBand, t, transitionSec);
    this.thetaMod.frequency.setTargetAtTime(profile.hypnosis.thetaHz, t, transitionSec);
    this.ampMod.frequency.setTargetAtTime(profile.hypnosis.alphaHz, t, transitionSec);
    this.noiseFilter.Q.setTargetAtTime(profile.synth.noiseQ, t, transitionSec);

    // Gain restaging
    this._rampParam(this.droneGain, null, profile.mix.drone * 0.18, t, transitionSec + 0.3);
    this._rampParam(this.subGain, null, profile.mix.drone * 0.08, t, transitionSec + 0.4);
    this._rampParam(this.tensionGain, null, profile.mix.transient * 0.06, t, transitionSec + 0.3);
    this._rampParam(this.noiseGain, null, profile.mix.foley * 0.05, t, transitionSec + 0.4);
    this._rampParam(this.thetaGain, null, profile.hypnosis.depth * 0.5, t, transitionSec + 0.5);

    return this;
  }

  /** Fire a transient "interaction pulse" */
  pulseInteraction() {
    if (!this.ctx || !this.started) return;
    const now = this.ctx.currentTime;
    this.tensionGain.gain.cancelScheduledValues(now);
    this.tensionGain.gain.setValueAtTime(this._currentValue(this.tensionGain.gain), now);
    this.tensionGain.gain.linearRampToValueAtTime(
      Math.min(0.35, this.profile.mix.transient * 0.5), now + 0.04
    );
    this.tensionGain.gain.exponentialRampToValueAtTime(
      this.profile.mix.transient * 0.06, now + 0.55
    );
  }

  /** Mouse movement → frequency/intensity modulation */
  onMouseMove(e) {
    const dx = e.clientX - this.prevX;
    const dy = e.clientY - this.prevY;
    const speed = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 45);
    this.mouseSpeed += (speed - this.mouseSpeed) * 0.14;
    this.prevX = e.clientX;
    this.prevY = e.clientY;

    if (!this.ctx || !this.started) return;

    const p = this.profile;
    const now = this.ctx.currentTime;
    const ms = this.mouseSpeed;

    // Hypnotic frequency shift with mouse speed
    const targetHz = p.synth.baseHz * (1 + ms * p.synth.mousePitchFactor);
    const targetTheta = p.hypnosis.thetaHz + ms * p.hypnosis.mouseThetaShift;
    const targetAlpha = p.hypnosis.alphaHz + ms * p.hypnosis.mouseAlphaShift;

    this.droneOsc.frequency.setTargetAtTime(targetHz, now, 0.15);
    this.thetaMod.frequency.setTargetAtTime(targetTheta, now, 0.15);
    this.ampMod.frequency.setTargetAtTime(targetAlpha, now, 0.15);
    this.noiseFilter.frequency.setTargetAtTime(
      p.synth.noiseBand + ms * p.synth.noiseMouseShift, now, 0.15
    );

    // Crossfade between calm and tension based on speed
    const calmTarget = Math.max(0.06, 0.35 - ms * 0.25);
    const tensionTarget = Math.min(0.4, 0.05 + ms * 0.35);
    this.droneGain.gain.setTargetAtTime(calmTarget, now, 0.15);
    this.tensionGain.gain.setTargetAtTime(tensionTarget, now, 0.12);
  }

  /** Scroll progress → tension/noise modulation */
  onScroll(scrollY, maxScroll = 1200) {
    this.scrollProgress = Math.min(1, scrollY / maxScroll);
    if (!this.ctx || !this.started) return;

    const now = this.ctx.currentTime;
    const sp = this.scrollProgress;
    const p = this.profile;

    // Tension builds with scroll
    this.tensionGain.gain.setTargetAtTime(
      0.03 + sp * p.scroll.tensionCurve * 0.2, now, 0.2
    );
    // Noise texture increases
    this.noiseGain.gain.setTargetAtTime(
      0.02 + sp * p.scroll.noiseCurve * 0.12, now, 0.2
    );
    // Drone frequency subtly rises
    this.droneOsc.frequency.setTargetAtTime(
      p.synth.baseHz * (1 + sp * p.scroll.pitchRise), now, 0.3
    );
    // Theta modulation slows down (deeper relaxation on scroll)
    this.thetaMod.frequency.setTargetAtTime(
      Math.max(1, p.hypnosis.thetaHz * (1 - sp * 0.3)), now, 0.3
    );
  }

  /** Register a Howler.js Foley layer for state tracking */
  addFoleyLayer(howlerInstance) {
    this.foleyLayers.push(howlerInstance);
  }

  /** Destroy and clean up all resources */
  destroy() {
    this.stop(0.3);
    this.foleyLayers = [];
    this.started = false;
  }

  // ──────────────────────────────────────
  //  INTERNAL
  // ──────────────────────────────────────

  _buildGraph() {
    const c = this.ctx;
    const p = this.profile;

    // Master out
    this.master = c.createGain();
    this.master.gain.value = 0;

    // Layer gains
    this.droneGain = c.createGain();
    this.droneGain.gain.value = 0;
    this.subGain = c.createGain();
    this.subGain.gain.value = 0;
    this.tensionGain = c.createGain();
    this.tensionGain.gain.value = 0;
    this.noiseGain = c.createGain();
    this.noiseGain.gain.value = 0;
    this.thetaGain = c.createGain();
    this.thetaGain.gain.value = 0;

    // ─── Drone Oscillator (Layer 1 - Hypnotic Bed) ───
    this.droneOsc = c.createOscillator();
    this.droneOsc.type = 'sine';
    this.droneOsc.frequency.value = p.synth.baseHz;

    // Sub oscillator (Layer 1b - Deep foundation)
    this.subOsc = c.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.value = p.synth.baseHz / 2;

    // Tension oscillator (Layer 2 - Triangle overtones)
    this.tensionOsc = c.createOscillator();
    this.tensionOsc.type = 'triangle';
    this.tensionOsc.frequency.value = p.synth.baseHz * 1.51;

    // ─── Theta/Alpha Modulator (Layer 3 - Hypnotic pulse) ───
    this.thetaMod = c.createOscillator();
    this.thetaMod.type = 'sine';
    this.thetaMod.frequency.value = p.hypnosis.thetaHz;
    this.thetaModGain = c.createGain();
    this.thetaModGain.gain.value = p.hypnosis.depth * 120;

    // Amplitude modulator for AM effect (alpha wave ripple)
    this.ampMod = c.createOscillator();
    this.ampMod.type = 'sine';
    this.ampMod.frequency.value = p.hypnosis.alphaHz;
    this.ampModGain = c.createGain();
    this.ampModGain.gain.value = p.hypnosis.amDepth;

    // ─── ASMR Noise Texture (Layer 4) ───
    const noiseBuffer = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    // Pink noise approximation (filtered white noise)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
      b6 = white * 0.115926;
    }

    this.noiseNode = c.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Band-pass filter for targeted ASMR texture
    this.noiseFilter = c.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.value = p.synth.noiseBand;
    this.noiseFilter.Q.value = p.synth.noiseQ;

    // Grain modulator — creates the "crackling / sparkling" ASMR texture
    this.noiseGrainMod = c.createOscillator();
    this.noiseGrainMod.type = 'sine';
    this.noiseGrainMod.frequency.value = p.synth.noiseGrainRate || 4.5;
    this.noiseGrainModGain = c.createGain();
    this.noiseGrainModGain.gain.value = 0.5;
  }

  _connectGraph() {
    const c = this.ctx;

    // Connection: Theta modulator → drone frequency (FM effect)
    this.thetaMod.connect(this.thetaModGain);
    this.thetaModGain.connect(this.droneOsc.frequency);

    // Connection: AM modulator → drone gain (tremolo)
    this.ampMod.connect(this.ampModGain);
    this.ampModGain.connect(this.droneGain.gain);

    // Connection: Grain modulator → noise filter frequency
    if (this.noiseGrainMod && this.noiseGrainModGain) {
      this.noiseGrainMod.connect(this.noiseGrainModGain);
      this.noiseGrainModGain.connect(this.noiseFilter.frequency);
    }

    // Connection: Oscillators → gains
    this.droneOsc.connect(this.droneGain);
    this.subOsc.connect(this.subGain);
    this.tensionOsc.connect(this.tensionGain);

    // Connection: Noise → filter → gain
    this.noiseNode.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);

    // Connection: Gains → master
    this.droneGain.connect(this.master);
    this.subGain.connect(this.master);
    this.tensionGain.connect(this.master);
    this.noiseGain.connect(this.master);

    // Master → output
    this.master.connect(c.destination);
  }

  _startOscillators() {
    this.droneOsc.start();
    this.subOsc.start();
    this.tensionOsc.start();
    this.thetaMod.start();
    this.ampMod.start();
    if (this.noiseGrainMod) this.noiseGrainMod.start();
    this.noiseNode.start();
  }

  _rampParam(param, from, to, t, duration) {
    param.cancelScheduledValues(t);
    if (from !== null) param.setValueAtTime(from, t);
    param.linearRampToValueAtTime(to, t + duration);
  }

  _currentValue(param) {
    // Get current value at precise time
    const val = param.value;
    return val > 0.001 ? val : 0.001;
  }
};
