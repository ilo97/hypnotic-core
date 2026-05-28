/**
 * Foley Generator — Procedural Product Sound Synthesis
 * ------------------------------------------------------
 * Generates data URI WAV sounds for common product categories.
 * No external samples needed — all sounds are synthesized at runtime.
 *
 * Categories:
 *  - Glass / Crystal / Clink
 *  - Silk / Fabric / Velvet
 *  - Liquid / Bubble / Pour
 *  - Click / Switch / Digital
 *  - Engine / Purr / Mechanical
 *  - Organic / Crunch / Rustle
 *  - Air / Wind / Whoosh
 *  - Metallic / Bell / Chime
 */

window.FoleyGenerator = class FoleyGenerator {

  /**
   * Generate a product foley sound as a base64 data URI.
   *
   * @param {string} type  — Foley type key (see _synthesizers)
   * @param {Object} [opts] — Overrides for frequency, duration, volume
   * @returns {string} data:audio/wav;base64,...
   */
  static generate(type, opts = {}) {
    const synth = this._synthesizers[type];
    if (!synth) return this._silence();
    return synth(opts);
  }

  /**
   * Pre-generate a batch of common foley sounds and return
   * an object mapping type keys to data URIs.
   */
  static generateAll(overrides = {}) {
    const result = {};
    for (const key of Object.keys(this._synthesizers)) {
      result[key] = this.generate(key, overrides[key] || {});
    }
    return result;
  }

  // ──────────────────────────────────────
  //  INTERNAL
  // ──────────────────────────────────────

  static _silence() {
    return this._buildWav(100, 0, 0.01);
  }

  static _buildWav(freq, volume, durationSec, waveform = 'sine', decay = 18) {
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * durationSec);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);

    const writeStr = (off, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, samples * 2, true);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * decay);
      let sample;

      switch (waveform) {
        case 'triangle':
          sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t));
          break;
        case 'saw':
          sample = 2 * ((freq * t) % 1) - 1;
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1;
          break;
        case 'noise-blend': {
          const tone = Math.sin(2 * Math.PI * freq * t);
          const noise = Math.random() * 2 - 1;
          sample = tone * 0.6 + noise * 0.4;
          break;
        }
        case 'fm-bell': {
          // FM synthesis for bell/chime tones
          const mod = Math.sin(2 * Math.PI * freq * 2.76 * t);
          sample = Math.sin(2 * Math.PI * freq * t + mod * 3);
          break;
        }
        default:
          sample = Math.sin(2 * Math.PI * freq * t);
      }

      view.setInt16(44 + i * 2, sample * env * volume * 32767, true);
    }

    // Convert to base64 data URI
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return 'data:audio/wav;base64,' + btoa(binary);
  }

  /** Multi-tone chime (crystal glass) */
  static _glassClink(opts) {
    const f = opts.freq || 1420;
    const v = opts.volume || 0.32;
    const d = opts.duration || 0.18;
    return this._buildWav(f, v, d, 'fm-bell', 38);
  }

  /** Soft silk rustle — filtered noise */
  static _silkRustle(opts) {
    const v = opts.volume || 0.15;
    const d = opts.duration || 0.35;
    return this._buildWav(60, v, d, 'noise-blend', 12);
  }

  /** Small bubbles in liquid */
  static _bubblePop(opts) {
    const f = opts.freq || 3200;
    const v = opts.volume || 0.18;
    const d = opts.duration || 0.04;
    return this._buildWav(f, v, d, 'sine', 80);
  }

  /** Can / bottle opening — pressurized hiss + tone */
  static _canOpen(opts) {
    const f = opts.freq || 900;
    const v = opts.volume || 0.22;
    const d = opts.duration || 0.22;
    return this._buildWav(f, v, d, 'noise-blend', 16);
  }

  /** Pouring liquid */
  static _liquidPour(opts) {
    const v = opts.volume || 0.14;
    const d = opts.duration || 0.45;
    return this._buildWav(200, v, d, 'noise-blend', 7);
  }

  /** Digital blip — clean sine ping */
  static _digitalBlip(opts) {
    const f = opts.freq || 1800;
    const v = opts.volume || 0.25;
    const d = opts.duration || 0.08;
    return this._buildWav(f, v, d, 'sine', 55);
  }

  /** Neural hum — low synth pulse */
  static _neuralHum(opts) {
    const f = opts.freq || 80;
    const v = opts.volume || 0.2;
    const d = opts.duration || 0.6;
    return this._buildWav(f, v, d, 'triangle', 5);
  }

  /** Scanner sweep — rising frequency whoosh */
  static _scannerSweep(opts) {
    const v = opts.volume || 0.2;
    const d = opts.duration || 0.5;
    return this._buildWav(400, v, d, 'noise-blend', 5);
  }

  /** Low engine growl */
  static _engineGrowl(opts) {
    const f = opts.freq || 55;
    const v = opts.volume || 0.28;
    const d = opts.duration || 0.7;
    return this._buildWav(f, v, d, 'saw', 4);
  }

  /** Tire whoosh / air pass */
  static _tireWhoosh(opts) {
    const v = opts.volume || 0.12;
    const d = opts.duration || 0.4;
    return this._buildWav(120, v, d, 'noise-blend', 8);
  }

  /** Power hit / transient burst */
  static _nitroHit(opts) {
    const f = opts.freq || 180;
    const v = opts.volume || 0.35;
    const d = opts.duration || 0.12;
    return this._buildWav(f, v, d, 'square', 34);
  }

  /** Velvet air — soft breathy texture */
  static _velvetAir(opts) {
    const v = opts.volume || 0.08;
    const d = opts.duration || 0.6;
    return this._buildWav(80, v, d, 'noise-blend', 4);
  }

  /** Sparkle / shimmer — high bell cascade */
  static _sparkle(opts) {
    const f = opts.freq || 2400;
    const v = opts.volume || 0.2;
    const d = opts.duration || 0.2;
    return this._buildWav(f, v, d, 'fm-bell', 30);
  }

  /** Gentle wind — filtered noise sweep */
  static _windSweep(opts) {
    const v = opts.volume || 0.1;
    const d = opts.duration || 0.8;
    return this._buildWav(100, v, d, 'noise-blend', 3);
  }

  /** Water droplet */
  static _waterDrop(opts) {
    const f = opts.freq || 2600;
    const v = opts.volume || 0.25;
    const d = opts.duration || 0.06;
    return this._buildWav(f, v, d, 'fm-bell', 65);
  }

  /** Mechanical click (precise switch) */
  static _mechanicalClick(opts) {
    const f = opts.freq || 1200;
    const v = opts.volume || 0.3;
    const d = opts.duration || 0.03;
    return this._buildWav(f, v, d, 'square', 100);
  }

  /** Soft chime (luxury notification) */
  static _softChime(opts) {
    const f = opts.freq || 880;
    const v = opts.volume || 0.22;
    const d = opts.duration || 0.4;
    return this._buildWav(f, v, d, 'fm-bell', 14);
  }

  /** Warm pad / ambient tone */
  static _warmPad(opts) {
    const f = opts.freq || 220;
    const v = opts.volume || 0.15;
    const d = opts.duration || 0.8;
    return this._buildWav(f, v, d, 'triangle', 2.5);
  }

  // Registry of all synthesizers
  static get _synthesizers() {
    return {
      'glass-clink':      this._glassClink.bind(this),
      'silk-rustle':      this._silkRustle.bind(this),
      'bubble-pop':       this._bubblePop.bind(this),
      'can-open':         this._canOpen.bind(this),
      'liquid-pour':      this._liquidPour.bind(this),
      'digital-blip':     this._digitalBlip.bind(this),
      'neural-hum':       this._neuralHum.bind(this),
      'scanner-sweep':    this._scannerSweep.bind(this),
      'engine-growl':     this._engineGrowl.bind(this),
      'tire-whoosh':      this._tireWhoosh.bind(this),
      'nitro-hit':        this._nitroHit.bind(this),
      'velvet-air':       this._velvetAir.bind(this),
      'sparkle':          this._sparkle.bind(this),
      'wind-sweep':       this._windSweep.bind(this),
      'water-drop':       this._waterDrop.bind(this),
      'mechanical-click': this._mechanicalClick.bind(this),
      'soft-chime':       this._softChime.bind(this),
      'warm-pad':         this._warmPad.bind(this),
    };
  }
};
