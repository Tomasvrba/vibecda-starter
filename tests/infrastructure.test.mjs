import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';
import { packageGame } from '../scripts/package-game.mjs';
import { loadEvent, validateEvent } from '../scripts/event-config.mjs';

const event = await loadEvent();
test('launch guard rejects draft event settings and missing destinations', () => {
  validateEvent(event);
  assert.throws(() => validateEvent({ ...event, status: 'draft' }, { launch: true }));
  assert.throws(() => validateEvent({ ...event, status: 'ready', links: { ...event.links, jam: '' } }, { launch: true }), /links.jam/);
  assert.throws(() => validateEvent({ ...event, links: { home: 'javascript:alert(1)' } }), /HTTPS/);
  assert.throws(() => validateEvent({ ...event, submissionDeadline: event.startsAt }), /chronological/);
});
test('submission ZIP has root index, nested assets, and no source or credentials', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'vibecda-package-'));
  const input = join(dir, 'build');
  await mkdir(join(input, 'assets'), { recursive: true });
  await writeFile(join(input, 'index.html'), '<script src="./assets/game.js"></script>');
  await writeFile(join(input, 'assets/game.js'), 'console.log("play")');
  const result = await packageGame(input, join(dir, 'game.zip'));
  const files = unzipSync(await readFile(result.output));
  assert.deepEqual(Object.keys(files).sort(), ['assets/game.js', 'index.html']);
  assert.match(strFromU8(files['index.html']), /\.\/assets\/game.js/);
  await assert.rejects(packageGame(join(input, 'assets'), join(dir, 'invalid.zip')), /index.html/);
});
