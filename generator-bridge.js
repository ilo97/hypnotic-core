/**
 * Generator Bridge
 *
 * Connects the platform UI (prompt input + "Begin Evolution" button) to
 * PromptMapping (prompt-mapping.js). Takes a free-text prompt, resolves it
 * to a visual config (colors, particle behaviour, headline/subtitle), and
 * live-applies that config to the page so the visitor sees an immediate
 * result — instead of the button doing nothing.
 */
(function initGeneratorBridge(global) {
  const root = document.documentElement;

  function applyConfigToPage(config) {
    if (!config) return;

    // Live-restyle accent colors via CSS custom properties
    if (config.colors) {
      if (config.colors.base) root.style.setProperty('--cyan', config.colors.base);
      if (config.colors.background) root.style.setProperty('--bg', config.colors.background);
    }

    // Update hero copy to reflect the generated concept
    const titleEl = document.querySelector('.hero-title h1');
    const subtitleEl = document.querySelector('.hero-title p');
    if (titleEl && config.title) titleEl.textContent = config.title;
    if (subtitleEl && config.subtitle) subtitleEl.textContent = config.subtitle;

    // Nudge the prompt box border/glow to the new accent color
    const promptBox = document.querySelector('.prompt-box');
    if (promptBox && config.colors && config.colors.base) {
      promptBox.style.transition = 'box-shadow .6s ease, border-color .6s ease';
      promptBox.style.borderColor = config.colors.base;
      promptBox.style.boxShadow = `0 0 40px ${config.colors.base}33`;
    }
  }

  async function generate(prompt) {
    const cleaned = String(prompt || '').trim();
    if (!cleaned) {
      return { success: false, error: 'Prompt is empty.' };
    }

    if (!global.PromptMapping || typeof global.PromptMapping.buildConfigFromPrompt !== 'function') {
      return { success: false, error: 'PromptMapping module not loaded.' };
    }

    // Small artificial delay so "Synthesizing reality..." status is readable
    await new Promise((resolve) => setTimeout(resolve, 550));

    try {
      const { config, appliedRules } = global.PromptMapping.buildConfigFromPrompt(cleaned);
      applyConfigToPage(config);

      const statusEl = document.getElementById('stack-status');
      if (statusEl) {
        const ruleSummary = appliedRules.length ? appliedRules.join(', ') : 'default';
        statusEl.textContent = `Stack: GSAP active • Reality synthesized (${ruleSummary})`;
      }

      return { success: true, config, appliedRules };
    } catch (error) {
      console.error('[GeneratorBridge] generate() failed:', error);
      return { success: false, error: error.message || 'Unknown generation error.' };
    }
  }

  global.GeneratorBridge = { generate, applyConfigToPage };
})(window);
