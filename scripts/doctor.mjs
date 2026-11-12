import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

let missing = false;
for (const [tool, args, required] of [
  ['node', ['--version'], true], ['npm', ['--version'], true],
  ['git', ['--version'], true], ['claude', ['--version'], false],
  ['codex', ['--version'], false], ['gemini', ['--version'], false],
  ['ffmpeg', ['-version'], false], ['convert', ['-version'], false],
]) {
  const result = spawnSync(tool, args, { encoding: 'utf8', timeout: 20000, shell: process.platform === 'win32' });
  const ok = result.status === 0;
  console.log(`${ok ? 'OK' : required ? 'MISSING' : 'OPTIONAL'} ${tool}: ${ok ? result.stdout.trim().split('\n')[0] : 'not available'}`);
  if (required && !ok) missing = true;
}
if (!existsSync('node_modules/phaser')) { console.log('MISSING dependencies: run npm ci'); missing = true; }
console.log('\nAI tools need your own login. Local Node-only setup does not require AI CLIs or asset utilities.');
console.log('Next: npm run dev → open forwarded port 5173. Save and push your work to GitHub.');
process.exitCode = Number(missing);
