import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';
import { packageGame } from '../scripts/package-game.mjs';
import { parseCSV, writeCSV } from '../scripts/csv.mjs';
import { scoreProjects } from '../scripts/score.mjs';
import { loadEvent, validateEvent } from '../scripts/event-config.mjs';

const event = await loadEvent();
const projects = [
  { project_id: 'a', track: 'freeplay', title: 'A', itch_url: 'https://team.itch.io/a' },
  { project_id: 'b', track: 'freeplay', title: 'B', itch_url: 'https://team.itch.io/b' },
];
const assignments = projects.flatMap(p => ['j1', 'j2'].map(judge_id => ({ judge_id, project_id: p.project_id })));
const scoresFor = (values = {}) => assignments.flatMap(a => event.tracks[0].criteria.map(c => ({
  ...a, criterion_id: c.id, score: String(values[a.project_id]?.[c.id] ?? 3),
})));

test('CSV handles quoted titles, escaped quotes, BOM, and multiline fields', () => {
  const rows = parseCSV('\uFEFFid,title\r\na,"Game, with ""quotes""\nand a line"\r\n');
  assert.deepEqual(rows, [{ id: 'a', title: 'Game, with "quotes"\nand a line' }]);
  assert.deepEqual(parseCSV(writeCSV(['id', 'title'], rows)), rows);
  assert.throws(() => parseCSV('id,title\na,"broken'), /Unclosed/);
});
test('CSV exports neutralize spreadsheet formulas', () => {
  assert.match(writeCSV(['title'], [{ title: '=IMPORTDATA("https://example.com")' }]), /'=IMPORTDATA/);
});
test('equal-weight scores use each track rubric and flag unresolved ties', () => {
  const results = scoreProjects(event, projects, assignments, scoresFor());
  assert.equal(results[0].total, 60);
  assert.equal(results[0].judges, 2);
  assert.ok(results.every(r => r.tie_pending && r.rank === 1));
  const high = scoresFor({ a: { playable: 5 } });
  assert.equal(scoreProjects(event, projects, assignments, high)[0].total, 68);
  const wizards = [{ ...projects[0], track: 'wizards-and-lizards' }];
  const assigned = [{ judge_id: 'j', project_id: 'a' }];
  const scored = event.tracks[1].criteria.map(c => ({ ...assigned[0], criterion_id: c.id, score: c.id === 'creativity' ? '5' : '1' }));
  assert.equal(scoreProjects(event, wizards, assigned, scored)[0].total, 36);
});
test('published Freeplay tie-breaker takes precedence over entry order', () => {
  // A: +2 learning (8 points), B: +1 playable and +1 demo (also 8).
  const results = scoreProjects(event, projects, assignments, scoresFor({ a: { learning: 5 }, b: { playable: 4, demo: 4 } }));
  assert.equal(results[0].project_id, 'a');
  assert.equal(results[0].tie_pending, false);
});
test('missing, duplicate, invalid, and unassigned scores stop the ranking', () => {
  const scores = scoresFor();
  assert.throws(() => scoreProjects(event, projects, assignments, scores.slice(1)), /Missing scores/);
  assert.throws(() => scoreProjects(event, projects, assignments, [...scores, scores[0]]), /Duplicate criterion/);
  assert.throws(() => scoreProjects(event, projects, assignments, [{ ...scores[0], score: '6' }, ...scores.slice(1)]), /whole numbers/);
  assert.throws(() => scoreProjects(event, projects, assignments, [{ ...scores[0], judge_id: 'unknown' }]), /without assignment/);
  assert.throws(() => scoreProjects(event, projects, [...assignments, assignments[0]], scores), /Duplicate judge/);
});
test('community track is excluded from ranking', () => {
  const all = [...projects, { project_id: 'community', track: 'gta-cda' }];
  assert.equal(scoreProjects(event, all, assignments, scoresFor()).length, 2);
});
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
