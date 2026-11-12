import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { unzipSync } from 'fflate';
import { packageGame } from '../../scripts/package-game.mjs';

test('production build loads, collects a spark, and restarts', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const failures = [];
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Sparks: 0 / 8');
  // Movement should drive the real production game, without test-only hooks.
  await page.keyboard.down('ArrowRight');
  await expect(page.getByRole('status')).toHaveText('Sparks: 1 / 8');
  await page.keyboard.up('ArrowRight');
  await page.getByRole('button', { name: 'Restart game' }).click();
  await expect(page.getByRole('status')).toHaveText('Sparks: 0 / 8');
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
});

test('pointer controls work at phone dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * 180 / 800, box.y + box.height * 300 / 450);
  await page.mouse.down();
  await expect(page.getByRole('status')).toHaveText('Sparks: 1 / 8');
  await page.mouse.up();
});

test('the actual submission ZIP runs under a subdirectory inside an iframe', async ({ page }) => {
  const dir = await mkdtemp(join(tmpdir(), 'vibecda-iframe-'));
  const { output } = await packageGame('dist', join(dir, 'game.zip'));
  const files = unzipSync(await readFile(output));
  const server = createServer((req, res) => {
    if (req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      res.end('<!doctype html><title>Upload rehearsal</title><iframe title="Submitted game" src="/uploads/team-game/" width="960" height="800"></iframe>');
      return;
    }
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/uploads\/team-game\//, '') || 'index.html';
    const file = files[path];
    if (!file) { res.statusCode = 404; res.end('Missing file'); return; }
    res.setHeader('Content-Type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(path)] || 'application/octet-stream');
    res.end(file);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  try {
    await page.goto(`http://127.0.0.1:${port}/`);
    const frame = page.frameLocator('iframe[title="Submitted game"]');
    await expect(frame.locator('canvas')).toBeVisible();
    await expect(frame.getByRole('status')).toHaveText('Sparks: 0 / 8');
    await frame.locator('canvas').click();
    await page.keyboard.down('ArrowRight');
    await expect(frame.getByRole('status')).toHaveText('Sparks: 1 / 8');
    await page.keyboard.up('ArrowRight');
  } finally {
    await page.goto('about:blank');
    await new Promise(resolve => server.close(resolve));
  }
});
