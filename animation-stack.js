(function initAnimationStack(global) {
  const state = {
    lottieLoaded: false,
    theatreLoaded: false,
    remotionMode: 'payload-only'
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[data-src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.src = src;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  async function ensureDotLottie() {
    if (global.lottie) {
      state.lottieLoaded = true;
      return true;
    }

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js');
      state.lottieLoaded = !!global.lottie;
      return state.lottieLoaded;
    } catch (error) {
      console.warn('[AnimationStack] Lottie konnte nicht geladen werden.', error);
      return false;
    }
  }

  async function mountLottiePreview({ container, src, loop = true, autoplay = true, speed = 1 } = {}) {
    if (!container || !src) return false;

    const ok = await ensureDotLottie();
    if (!ok || !global.lottie) return false;

    container.innerHTML = '';

    const instance = global.lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop,
      autoplay,
      path: src
    });

    instance.setSpeed(speed);
    return true;
  }

  async function ensureTheatreCore() {
    if (global.TheatreCore || global.theatre) {
      state.theatreLoaded = true;
      return true;
    }

    try {
      await loadScript('https://unpkg.com/@theatre/core@0.7.2/dist/core.umd.js');
      state.theatreLoaded = !!(global.TheatreCore || global.theatre);
      return state.theatreLoaded;
    } catch (error) {
      console.warn('[AnimationStack] Theatre.js konnte nicht geladen werden. Fallback auf GSAP.', error);
      state.theatreLoaded = false;
      return false;
    }
  }

  function createTheatreLikeSequence({ target, duration = 2.4 } = {}) {
    if (!target || !global.gsap) return null;

    return global.gsap.timeline({ defaults: { ease: 'power3.inOut' } })
      .fromTo(target, { opacity: 0.2, scale: 0.96 }, { opacity: 1, scale: 1.02, duration: duration * 0.5 })
      .to(target, { scale: 1, duration: duration * 0.5 });
  }

  function buildRemotionPayload({ prompt = '', theme = 'default', params = {} } = {}) {
    return {
      composition: 'HypnoticLanding',
      fps: 30,
      durationInFrames: 300,
      width: 1920,
      height: 1080,
      inputProps: {
        prompt,
        theme,
        params,
        generatedAt: new Date().toISOString()
      }
    };
  }

  function applyRemotionPreset(keyword) {
    const k = String(keyword || '').toLowerCase();
    if (k.includes('luxury') || k.includes('premium')) {
      return { scene: 'luxury', cameraEase: 'expo.out', grain: 0.08 };
    }
    if (k.includes('cyber') || k.includes('tech') || k.includes('neon')) {
      return { scene: 'cyber', cameraEase: 'power4.out', grain: 0.18 };
    }
    if (k.includes('nature') || k.includes('organic')) {
      return { scene: 'organic', cameraEase: 'sine.inOut', grain: 0.04 };
    }
    return { scene: 'default', cameraEase: 'power2.inOut', grain: 0.1 };
  }

  global.AnimationStack = {
    state,
    ensureDotLottie,
    mountLottiePreview,
    ensureTheatreCore,
    createTheatreLikeSequence,
    buildRemotionPayload,
    applyRemotionPreset
  };
})(window);
