import { mkdir, writeFile } from 'node:fs/promises';
import { loadEvent } from './event-config.mjs';

const event = await loadEvent();
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const link = (name, label, description) => event.links[name]
  ? `<a class="card" href="${esc(event.links[name])}"><strong>${esc(label)} <span aria-hidden="true">↗</span></strong><p>${esc(description)}</p></a>`
  : `<div class="card pending"><strong>${esc(label)}</strong><p>Link coming soon.</p></div>`;
const date = key => new Intl.DateTimeFormat('en-US', {
  timeZone: event.timezone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
}).format(new Date(event[key]));
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${event.status !== 'ready' ? '<meta name="robots" content="noindex,nofollow">' : ''}
<title>${esc(event.name)} · Participant guide</title>
<style>
:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#10231f;color:#f4ead8}*{box-sizing:border-box}body{margin:0}main{max-width:1000px;margin:auto;padding:48px 24px}a{color:#ffd477}a:focus-visible{outline:3px solid white;outline-offset:4px}.eyebrow{letter-spacing:.2em;text-transform:uppercase;font-size:.75rem;color:#9dcbaf}h1{font-size:clamp(2.6rem,8vw,5rem);line-height:1.05;max-width:780px;margin:16px 0}p,li{line-height:1.7;color:#c4d3c8}h2{margin-top:44px}.lead{font-size:1.2rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.card{display:block;border:1px solid #4c7160;border-radius:12px;padding:22px;text-decoration:none;background:#19392f}.card p{margin-bottom:0}.card strong{font-size:1.1rem}.pending{opacity:.65}.notice{padding:16px;border:1px solid #ffd477;border-radius:8px;margin-bottom:30px}code{color:#ffe3a5}footer{border-top:1px solid #355347;margin-top:48px;padding-top:24px}ol{padding-left:22px}.dates{display:flex;flex-wrap:wrap;gap:20px}.dates p{flex:1;min-width:230px}
</style></head><body><main>
${event.status !== 'ready' ? '<aside class="notice"><strong>Organizer draft</strong> · Event settings and missing links still need confirmation.</aside>' : ''}
<span class="eyebrow">${esc(event.name)} / participant guide</span><h1>Arrive ready.<br>Build something playable.</h1>
<p class="lead">${esc(event.description)}</p>
<div class="dates"><p><strong>Building starts</strong><br>${esc(date('startsAt'))}</p><p><strong>Submission deadline</strong><br>${esc(date('submissionDeadline'))}</p></div>
<div class="grid">
${link('registration', '1. Register', 'Reserve your place. Jam signup is a separate step.')}
${link('jam', '2. Join the jam', 'See the rules, enter your project, and browse submissions.')}
${link('codespaces', '3. Start building', 'Open the prepared web-game environment. Use your own AI login.')}
${link('community', '4. Get help', 'Find teammates, ask mentors, and follow announcements.')}
${link('starterRepository', 'Starter & instructions', 'Read the participant guide or run the starter locally.')}
${link('results', 'Projects & results', 'Explore what the community built this weekend.')}
</div>
<h2>Before you arrive</h2><ol><li>Create GitHub and itch.io accounts and choose your AI tool.</li><li>Open the starter, publish it to a team repository, and run <code>npm run dev</code>.</li><li>Check your game opens and your AI login works. Check remaining cloud/AI allowances.</li><li>Bring your charger. Native-engine users should install their editor on their own laptop.</li></ol>
<h2>Pick a track</h2><div class="grid">${event.tracks.map(t => `<article class="card"><strong>${esc(t.name)}</strong><p>${esc(t.description)}</p></article>`).join('')}</div>
<h2>Submit your project</h2><ol><li>Save, commit, and push your final code. Record the submitted commit.</li><li>Run <code>npm run package</code> for the web starter and download <code>artifacts/game.zip</code>.</li><li>Create an itch.io project, upload the build, and test it as a visitor. Native games upload the appropriate platform build.</li><li>Use <strong>Submit your project</strong> on the jam page and complete the submission fields. Uploading alone does not enter the jam.</li></ol>
<p>Your Codespaces preview is temporary; use the submitted build or a durable hosted demo for judging.</p>
<h2>Judging</h2><p>Freeplay and Wizards and Lizards each have five criteria scored 1–5 with equal weight. GTA Cda is a community build and is not judged. The ${event.links.home ? `<a href="${esc(event.links.home)}#judging">event rules and rubrics</a>` : 'event rules and rubrics'} should reflect these settings before launch.</p>
<p>Awards: ${esc(date('awardsAt'))}. ${esc(event.sundayVenue)}</p>
<footer><a href="${esc(event.links.home)}">Back to vibeCDA</a><p>Keep your project, credits, and source links available after the event.</p></footer>
</main></body></html>`;
await mkdir('dist-hub', { recursive: true });
await writeFile('dist-hub/index.html', html);
console.log(`Built dist-hub/index.html (${event.status}). Publish this under the event site after event:check passes.`);
