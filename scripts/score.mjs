import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCSV, writeCSV } from './csv.mjs';
import { loadEvent } from './event-config.mjs';

const key = (...parts) => JSON.stringify(parts);
export function scoreProjects(event, projects, assignments, scores) {
  const projectMap = new Map();
  const tracks = new Map(event.tracks.map(t => [t.id, t]));
  for (const project of projects) {
    if (!project.project_id || projectMap.has(project.project_id)) throw new Error('Missing or duplicate project ID');
    if (!tracks.has(project.track)) throw new Error(`Unknown track: ${project.track}`);
    projectMap.set(project.project_id, project);
  }
  const assigned = new Map();
  for (const row of assignments) {
    const project = projectMap.get(row.project_id);
    if (!project || !tracks.get(project.track).judged) throw new Error(`Assignment has unknown/unjudged project: ${row.project_id}`);
    if (!row.judge_id) throw new Error('Assignment needs a judge ID');
    const id = key(row.judge_id, row.project_id);
    if (assigned.has(id)) throw new Error(`Duplicate judge assignment: ${id}`);
    assigned.set(id, { ...row, values: new Map() });
  }
  for (const row of scores) {
    const assignment = assigned.get(key(row.judge_id, row.project_id));
    if (!assignment) throw new Error(`Score without assignment: ${row.judge_id}/${row.project_id}`);
    const track = tracks.get(projectMap.get(row.project_id).track);
    if (!track.criteria.some(c => c.id === row.criterion_id)) throw new Error(`Unknown criterion: ${row.criterion_id}`);
    if (!/^[1-5]$/.test(row.score)) throw new Error(`Scores must be whole numbers 1–5: ${row.score}`);
    if (assignment.values.has(row.criterion_id)) throw new Error('Duplicate criterion score');
    assignment.values.set(row.criterion_id, Number(row.score));
  }
  const results = [];
  for (const project of projects) {
    const track = tracks.get(project.track);
    if (!track.judged) continue;
    const judges = [...assigned.values()].filter(a => a.project_id === project.project_id);
    if (!judges.length) throw new Error(`No judges assigned: ${project.project_id}`);
    for (const judge of judges) {
      if (judge.values.size !== track.criteria.length) throw new Error(`Missing scores: ${judge.judge_id}/${project.project_id}`);
    }
    const means = Object.fromEntries(track.criteria.map(c => [c.id, judges.reduce((sum, j) => sum + j.values.get(c.id), 0) / judges.length]));
    const total = track.criteria.reduce((sum, c) => sum + means[c.id] / 5 * c.weight, 0);
    results.push({ ...project, total, judges: judges.length, means });
  }
  const output = [];
  for (const track of event.tracks.filter(t => t.judged)) {
    const compare = (a, b) => {
      for (const difference of [b.total - a.total, ...track.tieBreakers.map(id => b.means[id] - a.means[id])]) {
        if (Math.abs(difference) > 1e-9) return difference;
      }
      return 0;
    };
    const ranked = results.filter(r => r.track === track.id).sort(compare);
    for (let i = 0; i < ranked.length; i++) {
      const tiedBefore = i > 0 && compare(ranked[i - 1], ranked[i]) === 0;
      ranked[i].rank = tiedBefore ? ranked[i - 1].rank : i + 1;
      ranked[i].tie_pending = tiedBefore || (i < ranked.length - 1 && compare(ranked[i], ranked[i + 1]) === 0);
      output.push(ranked[i]);
    }
  }
  if (!output.length) throw new Error('No judged projects to score');
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [projectsPath, assignmentsPath, scoresPath, outputPath = 'organizer/private/results.csv'] = process.argv.slice(2);
  if (!scoresPath) throw new Error('Usage: npm run judging -- PROJECTS.csv ASSIGNMENTS.csv SCORES.csv [OUTPUT.csv]');
  const [event, projects, assignments, scores] = await Promise.all([
    loadEvent(), ...[projectsPath, assignmentsPath, scoresPath].map(async path => parseCSV(await readFile(path, 'utf8'))),
  ]);
  const results = scoreProjects(event, projects, assignments, scores);
  await mkdir(resolve(outputPath, '..'), { recursive: true });
  const rows = results.map(r => ({ ...r, score_out_of_100: r.total.toFixed(4) }));
  await writeFile(outputPath, writeCSV(['track', 'rank', 'project_id', 'title', 'itch_url', 'score_out_of_100', 'judges', 'tie_pending'], rows));
  console.log(`Wrote ${outputPath}. Resolve tie_pending by judges' majority vote before entering final ranks on itch.io.`);
}
