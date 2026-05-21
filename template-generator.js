#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { buildConfigFromPrompt } = require('./prompt-mapping');

const BASE_TEMPLATE_PATH = path.join(__dirname, 'base-template.html');
const DEFAULT_OUTPUT_DIR = path.join(__dirname, 'generated');

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;

    const key = arg.replace(/^--/, '');
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    options[key] = value;
  }
  return options;
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9äöüß\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-]+|[-]+$/g, '')
    .slice(0, 72);
}

function escapeHtml(input = '') {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toTitleCase(input) {
  return input
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

function deriveTitleFromPrompt(prompt) {
  const stopwords = new Set([
    'the', 'and', 'for', 'with', 'from', 'that', 'this', 'eine', 'einen', 'und', 'mit', 'für', 'der', 'die', 'das',
    'to', 'of', 'a', 'an', 'in', 'on', 'at', 'by', 'is', 'as'
  ]);

  const tokens = (prompt || '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stopwords.has(t));

  if (!tokens.length) return 'Hypnotic Core';

  return toTitleCase(tokens.slice(0, 3).join(' '));
}

function deriveSubtitle(prompt) {
  const compact = String(prompt || '').trim();
  if (!compact) return 'Digital Art Experiment No. 01';
  if (compact.length <= 72) return compact;
  return `${compact.slice(0, 69)}...`;
}

function injectTemplate(baseTemplate, data) {
  return baseTemplate
    .replace(/__PAGE_TITLE__/g, escapeHtml(data.pageTitle))
    .replace(/__BRAND_NAME__/g, escapeHtml(data.brandName))
    .replace(/__MAIN_TITLE__/g, escapeHtml(data.mainTitle))
    .replace(/__SUB_TITLE__/g, escapeHtml(data.subTitle))
    .replace('__CONFIG_JSON__', JSON.stringify(data.config, null, 2));
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function run() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    console.log(`\nTemplate Generator Usage:\n\nnode template-generator.js --prompt "luxury neon skincare" [--brand "Nova Skin"] [--title "Nova Core"] [--subtitle "..."] [--output /abs/path/file.html] [--slug optional-name]\n`);
    process.exit(0);
  }

  const prompt = String(args.prompt || '').trim();
  if (!prompt) {
    console.error('Error: --prompt is required');
    process.exit(1);
  }

  const { config, appliedRules } = buildConfigFromPrompt(prompt);

  const brandName = args.brand ? String(args.brand).trim() : config.brandName;
  const mainTitle = args.title ? String(args.title).trim() : deriveTitleFromPrompt(prompt);
  const subTitle = args.subtitle ? String(args.subtitle).trim() : deriveSubtitle(prompt);

  config.brandName = brandName;
  config.title = mainTitle;
  config.subtitle = subTitle;
  config.metadata = {
    sourcePrompt: prompt,
    appliedRules,
    generatedAt: new Date().toISOString()
  };

  const baseTemplate = fs.readFileSync(BASE_TEMPLATE_PATH, 'utf8');
  const outputSlug = args.slug ? slugify(args.slug) : slugify(mainTitle || prompt) || `template-${Date.now()}`;

  let outputPath;
  if (args.output) {
    outputPath = path.isAbsolute(args.output)
      ? args.output
      : path.resolve(process.cwd(), args.output);
  } else {
    ensureDir(DEFAULT_OUTPUT_DIR);
    outputPath = path.join(DEFAULT_OUTPUT_DIR, `${outputSlug}.html`);
  }

  const metadataPath = outputPath.replace(/\.html$/i, '.json');
  const pageTitle = `${mainTitle} | Generated 3D Experience`;

  const html = injectTemplate(baseTemplate, {
    pageTitle,
    brandName,
    mainTitle,
    subTitle,
    config
  });

  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, html, 'utf8');
  fs.writeFileSync(metadataPath, JSON.stringify(config, null, 2), 'utf8');

  console.log(JSON.stringify({
    outputHtml: outputPath,
    outputMetadata: metadataPath,
    appliedRules,
    summary: {
      title: mainTitle,
      subtitle: subTitle,
      colors: config.colors,
      particles: config.particles.count,
      introDuration: config.intro.duration,
      scrollHeightVh: config.scroll.heightVh
    }
  }, null, 2));
}

run();
