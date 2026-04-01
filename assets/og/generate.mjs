import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Define OG images to generate — add new reports here
const cards = [
  {
    slug: 'ai-compute-policy-report',
    title: 'Powering AI Responsibly',
    description: 'Intelligence as infrastructure. AI energy, climate costs, H200 benchmarks, and a policy framework for compute sovereignty.',
    tags: 'Report // 2026,Climate + Innovation',
    meta: '12 sections',
  },
  {
    slug: 'index',
    title: 'Field Notes.',
    description: 'Research reports on compute infrastructure, energy policy, and the systems that power AI.',
    tags: '',
    meta: 'capccode',
  },
];

async function generate() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const templatePath = resolve(__dirname, 'template.html');

  for (const card of cards) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

    const params = new URLSearchParams({
      title: card.title,
      description: card.description,
      tags: card.tags,
      meta: card.meta,
    });

    await page.goto(`file://${templatePath}?${params.toString()}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const outputPath = resolve(__dirname, `${card.slug}.png`);
    const element = await page.$('#og-card');
    await element.screenshot({ path: outputPath, type: 'png' });

    console.log(`Generated: ${outputPath}`);
    await page.close();
  }

  await browser.close();
}

generate().catch(console.error);
