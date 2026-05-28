/**
 * Puppeteer Export Service – Render 3D experiences to video/stills.
 * 
 * This service provides:
 * - POST /render/screenshot – Capture a screenshot of a 3D page
 * - POST /render/video – Capture a video (screen recording) of scroll animations
 * 
 * ⚠️ Puppeteer requires Chrome/Chromium. Install with:
 *    npx playwright install chromium
 *    or set PUPPETEER_EXECUTABLE_PATH to your Chrome binary.
 * 
 * Environment:
 *   - CHROMIUM_PATH: Path to Chrome/Chromium executable
 *   - PORT: Server port (default: 3002)
 */

const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3002;
const CHROMIUM_PATH = process.env.CHROMIUM_PATH || '/usr/bin/chromium';

let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  console.warn('⚠️  puppeteer not installed. Install with: npm install puppeteer');
  console.warn('   Service will return mock responses.');
}

/**
 * Launch a headless browser instance.
 */
async function getBrowser() {
  if (!puppeteer) return null;
  try {
    return await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--renderer-process-limit=1',
      ],
    });
  } catch (err) {
    console.error('❌ Failed to launch browser:', err.message);
    return null;
  }
}

// POST /render/screenshot
app.post('/render/screenshot', async (req, res) => {
  const { url, fullPage, viewport, waitFor } = req.body;

  if (!puppeteer) {
    return res.json({
      mock: true,
      message: 'Install puppeteer to enable real rendering. npm install puppeteer',
      requestedUrl: url || '(none)',
    });
  }

  const browser = await getBrowser();
  if (!browser) {
    return res.status(500).json({ error: 'Failed to launch browser' });
  }

  try {
    const page = await browser.newPage();
    if (viewport) await page.setViewport(viewport);
    else await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url || 'https://ilo97.github.io/hypnotic-core/', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for custom selector or just wait
    if (waitFor) {
      await page.waitForSelector(waitFor, { timeout: 10000 }).catch(() => {});
    } else {
      await page.waitForTimeout(2000);
    }

    const screenshot = await page.screenshot({ 
      encoding: 'base64', 
      fullPage: fullPage || false,
      type: 'png',
    });

    await browser.close();
    console.log(`📸 Screenshot captured: ${url || 'default'} (${(screenshot.length * 0.75 / 1024 / 1024).toFixed(1)} MB base64)`);
    res.json({ screenshot: `data:image/png;base64,${screenshot}`, format: 'base64' });
  } catch (err) {
    await browser.close().catch(() => {});
    console.error('❌ Screenshot error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /render/video – Creates a timelapse video of scroll animation
// (Note: Real video rendering requires ffmpeg. This captures sequential frames.)
app.post('/render/video', async (req, res) => {
  const { url, scrollSteps, delay, viewport } = req.body;

  if (!puppeteer) {
    return res.json({
      mock: true,
      message: 'Install puppeteer + ffmpeg to enable video rendering',
      requestedUrl: url || '(none)',
    });
  }

  const browser = await getBrowser();
  if (!browser) {
    return res.status(500).json({ error: 'Failed to launch browser' });
  }

  try {
    const page = await browser.newPage();
    if (viewport) await page.setViewport(viewport);
    else await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url || 'https://ilo97.github.io/hypnotic-core/', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.waitForTimeout(2000); // Let intro animation play

    const frames = [];
    const steps = scrollSteps || 30;
    const scrollDelay = delay || 100;

    // Scroll step by step, capturing frames
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate((p) => {
        window.scrollTo(0, p * (document.body.scrollHeight - window.innerHeight));
      }, progress);

      await page.waitForTimeout(scrollDelay);

      const frame = await page.screenshot({ encoding: 'base64', type: 'png' });
      frames.push({ frame: i, progress: progress.toFixed(2), data: frame });
    }

    await browser.close();
    console.log(`🎬 Video captured: ${frames.length} frames from ${url || 'default'}`);
    res.json({ frames, totalFrames: frames.length, message: 'Use ffmpeg to stitch frames into video: ffmpeg -framerate 30 -i frame_%d.png -c:v libx264 output.mp4' });
  } catch (err) {
    await browser.close().catch(() => {});
    console.error('❌ Video error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'puppeteer-export', chromiumAvailable: !!puppeteer });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎬 Puppeteer Export Service on http://0.0.0.0:${PORT}`);
  console.log(`   Chromium: ${CHROMIUM_PATH} ${puppeteer ? '(available)' : '(NOT installed)'}`);
});