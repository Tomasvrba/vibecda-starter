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
  // The first spark sits at (246, 104) in the game's 400 × 225 pixel world.
  await page.mouse.move(box.x + box.width * 246 / 400, box.y + box.height * 104 / 225);
  await page.mouse.down();
  await expect(page.getByRole('status')).toHaveText('Sparks: 1 / 8');
  await page.mouse.up();
});

test('Three.js renders in WebGL 2 and its camera, pause, pixel, and reset controls work', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: 'Three.js 3D demo' }).click();
  const scene = page.locator('canvas[aria-label="Interactive 3D canvas"]');
  await expect(scene).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('3D demo · animation on');
  expect(await scene.evaluate(element => {
    const gl = element.getContext('webgl2');
    return gl !== null && !gl.isContextLost();
  })).toBe(true);
  // The pixel look draws a small picture and scales it up; the smooth look draws every pixel.
  const pixelWidth = await scene.evaluate(element => element.width);
  await page.getByRole('button', { name: 'Smooth look' }).click();
  await expect.poll(() => scene.evaluate(element => element.width)).toBeGreaterThan(pixelWidth);
  await page.getByRole('button', { name: 'Pixel look' }).click();
  await expect.poll(() => scene.evaluate(element => element.width)).toBe(pixelWidth);
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await expect(page.getByRole('status')).toHaveText('3D demo · animation off');
  const originalView = (await scene.screenshot()).toString('base64');
  await scene.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(async () => (await scene.screenshot()).toString('base64')).not.toBe(originalView);
  await page.setViewportSize({ width: 390, height: 844 });
  const phoneView = (await scene.screenshot()).toString('base64');
  const box = await scene.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await scene.screenshot()).toString('base64')).not.toBe(phoneView);
  await page.getByRole('button', { name: 'Reset view' }).click();
  await expect(page.getByRole('status')).toHaveText('3D demo · animation on');
  expect(errors).toEqual([]);
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
    // The same uploaded ZIP also includes the Three.js demo, with relative chunks.
    await frame.getByRole('link', { name: 'Three.js 3D demo' }).click();
    await expect(frame.locator('canvas[aria-label="Interactive 3D canvas"]')).toBeVisible();
    await expect(frame.getByRole('status')).toHaveText('3D demo · animation on');
    await frame.getByRole('button', { name: 'Pause animation' }).click();
    await expect(frame.getByRole('status')).toHaveText('3D demo · animation off');
  } finally {
    await page.goto('about:blank');
    await new Promise(resolve => server.close(resolve));
  }
});
