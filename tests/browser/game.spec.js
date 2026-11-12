import { test, expect } from '@playwright/test';

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
