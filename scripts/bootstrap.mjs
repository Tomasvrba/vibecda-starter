import { spawnSync } from 'node:child_process';
import { readFile, cp } from 'node:fs/promises';

// Reuse the exact dependency tree baked into the image. If a team changes its
// lockfile, install that tree using the image's warm npm cache instead.
let matches = false;
try {
  matches = (await readFile('package-lock.json', 'utf8')) ===
    (await readFile('/opt/vibecda/starter/package-lock.json', 'utf8'));
} catch { /* Local container variations can use npm ci below. */ }
if (matches) {
  await cp('/opt/vibecda/starter/node_modules', 'node_modules', { recursive: true });
  console.log('Restored the preinstalled starter dependencies.');
} else {
  const result = spawnSync('npm', ['ci', '--prefer-offline', '--no-audit', '--no-fund'], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log('Ready. Run npm run dev, then open forwarded port 5173.');
