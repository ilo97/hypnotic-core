/**
 * Generator Bridge
 *
 * Connects the platform UI (prompt input + "Begin Evolution" button) to
 * PromptMapping (prompt-mapping.js). Takes a free-text prompt, resolves it
 * to a visual config (colors, particle behaviour, headline/subtitle), and
 * live-applies that config to the page so the visitor sees an immediate
 * result — instead of the button doing nothing.
 *
 * Also gates usage: admin (Ilayda) gets unlimited free generations via a
 * password unlock; everyone else gets a limited number of free tries before
 * being pointed to the pricing section.
 *
 * NOTE: this is a client-side soft gate (localStorage), not real security.
 * Anyone who reads the page source can find ADMIN_PASSWORD or clear
 * localStorage to reset their trial count. A hard gate would require a
 * backend session check tied to a verified Stripe payment.
 */
(function initGeneratorBridge(global) {
  const root = document.documentElement;

  // ─── Change this to your own secret before sharing the site widely ───
  const ADMIN_PASSWORD = 'ilayda-aesthetic-2026';
  const FREE_TRIAL_LIMIT = 3;
  const LS_ADMIN_KEY = 'hypnotic_admin_unlocked';
  const LS_TRIAL_KEY = 'hypnotic_trial_count';

  // ─── TESTING_MODE: set to false when ready to actually enforce limits/payment ───
  const TESTING_MODE = true;
  function isAdmin() {
    if (TESTING_MODE) return true;
    return global.localStorage.getItem(LS_ADMIN_KEY) === 'true' || global.localStorage.getItem('hypnotic_paid_unlock') === 'true';
  }

  function getTrialCount() {
    return parseInt(global.localStorage.getItem(LS_TRIAL_KEY) || '0', 10);
  }

  function incrementTrialCount() {
    global.localStorage.setItem(LS_TRIAL_KEY, String(getTrialCount() + 1));
  }

  function tryAdminUnlock() {
    const input = global.prompt('Admin password:');
    if (input === null) return false;
    if (input === ADMIN_PASSWORD) {
      global.localStorage.setItem(LS_ADMIN_KEY, 'true');
      global.alert('Admin unlocked. Unlimited generations enabled on this browser.');
      updateTrialBadge();
      return true;
    }
    global.alert('Wrong password.');
    return false;
  }

  function updateTrialBadge() {
    const badge = document.getElementById('trial-badge');
    if (!badge) return;
    if (isAdmin()) {
      badge.textContent = 'Admin • unlimited';
    } else {
      const remaining = Math.max(0, FREE_TRIAL_LIMIT - getTrialCount());
      badge.textContent = `${remaining} free ${remaining === 1 ? 'try' : 'tries'} left`;
    }
  }

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

    if (!isAdmin() && getTrialCount() >= FREE_TRIAL_LIMIT) {
      return {
        success: false,
        limitReached: true,
        error: 'Free trial limit reached. Upgrade below to keep generating.'
      };
    }

    if (!global.PromptMapping || typeof global.PromptMapping.buildConfigFromPrompt !== 'function') {
      return { success: false, error: 'PromptMapping module not loaded.' };
    }

    // Small artificial delay so "Synthesizing reality..." status is readable
    await new Promise((resolve) => setTimeout(resolve, 550));

    try {
      const { config, appliedRules } = global.PromptMapping.buildConfigFromPrompt(cleaned);
      applyConfigToPage(config);

      if (!isAdmin()) {
        incrementTrialCount();
        updateTrialBadge();
      }

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

  global.GeneratorBridge = { generate, applyConfigToPage, isAdmin, tryAdminUnlock, updateTrialBadge, FREE_TRIAL_LIMIT };

  document.addEventListener('DOMContentLoaded', updateTrialBadge);
})(window);
