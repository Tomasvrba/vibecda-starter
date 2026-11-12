import { mkdir, writeFile } from 'node:fs/promises';
import { loadEvent } from './event-config.mjs';

const event = await loadEvent();
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const link = (name, label, description) => event.links[name]
  ? `<a class="card" href="${esc(event.links[name])}"><strong>${esc(label)} <span aria-hidden="true">↗</span></strong><p>${esc(description)}</p></a>`
  : `<div class="card pending"><strong>${esc(label)}</strong><p>Link coming soon.</p></div>`;
const trackClass = { freeplay: 'freeplay', 'wizards-and-lizards': 'wizards', 'gta-cda': 'gta' };
const date = key => new Intl.DateTimeFormat('en-US', {
  timeZone: event.timezone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
}).format(new Date(event[key]));
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${event.status !== 'ready' ? '<meta name="robots" content="noindex,nofollow">' : ''}
<title>${esc(event.name)} · Participant guide</title>
<meta name="theme-color" content="#0b0f2a">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&amp;display=swap" rel="stylesheet">
<style>
:root {
  color-scheme: dark;
  --bg: #0b0f2a;
  --bg-deep: #060918;
  --panel: #12183a;
  --panel-2: #1a2250;
  --border: #2a3570;
  --cyan: #3de0ff;
  --cyan-dim: #1aa8c4;
  --gold: #f0a830;
  --green: #5dff9a;
  --purple: #9b7bff;
  --orange: #ff8c2a;
  --text: #e8ecff;
  --muted: #a8b0d8;
  --pixel-font: "Press Start 2P", monospace;
  background: var(--bg);
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
body {
  margin: 0;
  font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--text);
  background:
    radial-gradient(at 20% 0%, #1a1450 0%, transparent 50%),
    radial-gradient(at 80% 10%, #0e2a4a 0%, transparent 45%),
    linear-gradient(#060918 0%, #0b0f2a 40%, #0d1235 100%);
  background-attachment: fixed;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 8% 12%, #ffffffb3, transparent),
    radial-gradient(1px 1px at 22% 38%, #ffffff73, transparent),
    radial-gradient(1.5px 1.5px at 41% 8%, #3de0ff8c, transparent),
    radial-gradient(1px 1px at 58% 55%, #ffffff66, transparent),
    radial-gradient(1px 1px at 73% 18%, #ffffffa6, transparent),
    radial-gradient(1.5px 1.5px at 88% 42%, #f0a83080, transparent),
    radial-gradient(1px 1px at 15% 72%, #ffffff59, transparent),
    radial-gradient(1px 1px at 67% 80%, #ffffff80, transparent),
    radial-gradient(1px 1px at 93% 88%, #3de0ff66, transparent);
  opacity: .85;
}
.wrap { position: relative; max-width: 860px; margin: auto; padding: 0 1.1rem 4rem; }
a { color: var(--cyan); text-underline-offset: 3px; }
a:hover { color: white; }
a:focus-visible { outline: 3px solid var(--gold); outline-offset: 5px; }
.skip-link { position: fixed; top: -10rem; left: 1rem; z-index: 10; padding: .7rem 1rem; background: var(--bg-deep); }
.skip-link:focus { top: 1rem; }
.topnav {
  position: sticky;
  top: 0;
  z-index: 2;
  margin: 0 -1.1rem 1.25rem;
  padding: .55rem 1.1rem;
  border-bottom: 2px solid var(--border);
  background: #060918f2;
}
.topnav ul { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: .3rem; list-style: none; padding: 0; margin: 0; }
.topnav a { display: block; padding: .6rem .65rem; font: .58rem/1.6 var(--pixel-font); color: var(--text); text-decoration: none; border-radius: 8px; }
.topnav a:hover { background: var(--panel-2); color: var(--cyan); }
.topnav .nav-cta { color: var(--bg-deep); background: var(--gold); }
.topnav .nav-cta:hover { color: var(--bg-deep); background: #ffc461; }
.hero { text-align: center; padding-top: .5rem; }
.hero-banner { display: block; width: 100%; height: auto; aspect-ratio: 5 / 2; border: 3px solid var(--border); border-radius: 12px; background: var(--panel); box-shadow: 0 12px 40px #0007, 0 0 60px #3de0ff14; margin-bottom: 1.5rem; }
.eyebrow { font: .58rem/1.9 var(--pixel-font); color: var(--muted); margin: 0 0 .75rem; }
h1, h2, h3 { font-family: var(--pixel-font); font-weight: 400; letter-spacing: .02em; line-height: 1.6; }
h1 { font-size: clamp(1rem, 4vw, 1.8rem); color: white; text-shadow: 0 0 18px #3de0ff59; margin: 0 0 1rem; }
.cda { color: var(--cyan); }
h2 { font-size: clamp(.78rem, 2.8vw, .95rem); color: var(--cyan); margin: 2.4rem 0 1rem; padding-bottom: .55rem; border-bottom: 3px solid var(--border); text-shadow: 0 0 12px #3de0ff40; }
p { margin: 0 0 1rem; }
.lead { color: var(--muted); font-size: 1.15rem; }
.lead strong { color: var(--text); font-weight: 600; }
.dates { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; background: linear-gradient(145deg, var(--panel), var(--panel-2)); border: 3px solid var(--cyan-dim); border-radius: 12px; padding: 1.15rem 1.25rem; margin: 1.5rem 0; text-align: left; box-shadow: 0 0 24px #3de0ff1f; }
.dates p { margin: 0; }
.dates strong { display: block; color: var(--gold); font-size: .95rem; margin-bottom: .25rem; }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .85rem; }
.card { display: block; min-width: 0; background: var(--panel); border: 3px solid var(--border); border-radius: 12px; padding: 1rem 1.1rem; text-decoration: none; color: var(--text); }
.card > strong, .card h3 { display: block; color: var(--gold); font: .62rem/1.9 var(--pixel-font); margin: 0 0 .5rem; }
.card p { margin: 0; font-size: .98rem; }
a.card { transition: border-color .15s, background .15s; }
a.card:hover { border-color: var(--cyan-dim); background: var(--panel-2); color: var(--text); }
.pending { border-style: dashed; }
.pending p { color: var(--muted); }
.tracks { grid-template-columns: 1fr; }
.track-card.freeplay h3 { color: var(--green); }
.track-card.wizards h3 { color: var(--purple); }
.track-card.gta h3 { color: var(--orange); }
.track-card .criteria { color: var(--muted); font-size: .92rem; margin-top: .75rem; }
.track-card .track-link { margin-top: 1rem; }
.btn { display: inline-block; font: .6rem/1.7 var(--pixel-font); padding: .85rem 1rem; border-radius: 8px; border: 3px solid var(--cyan); background: linear-gradient(#1ee8ff, #0ab8d4); color: #041018; text-decoration: none; text-align: center; box-shadow: 0 4px 0 #067a8c, 0 0 20px #3de0ff33; }
.btn:hover { color: #041018; filter: brightness(1.08); }
.notice { border: 2px solid var(--gold); border-radius: 12px; background: var(--panel); padding: 1rem; margin-bottom: 1.5rem; }
ol { padding-left: 1.35rem; margin: 0 0 1rem; }
li { padding-left: .1rem; }
ol li { margin-bottom: .65rem; }
ol li::marker { color: var(--gold); font-weight: 700; }
code { font-size: .93em; color: var(--cyan); background: var(--bg-deep); padding: .15rem .35rem; border: 1px solid var(--border); border-radius: 4px; overflow-wrap: anywhere; }
.resources { background: var(--panel); border-left: 4px solid var(--cyan); border-radius: 0 8px 8px 0; padding: 1rem; }
.resources a { display: block; }
.resources a + a { margin-top: .6rem; }
.judging-times { list-style: none; padding: 0; margin: 1rem 0; }
.judging-times li { border-left: 4px solid var(--cyan); background: var(--panel); border-radius: 0 8px 8px 0; padding: .75rem 1rem; margin-bottom: .6rem; }
.judging-times strong { color: var(--gold); display: block; }
.muted { color: var(--muted); }
footer { text-align: center; border-top: 2px solid var(--border); margin-top: 3rem; padding-top: 1.5rem; color: var(--muted); font-size: .9rem; }
footer .pixel { font: .6rem/1.8 var(--pixel-font); color: var(--text); }
@media (max-width: 560px) {
  html { scroll-padding-top: 8rem; }
  .wrap { padding: 0 .75rem 3rem; }
  .topnav { margin: 0 -.75rem 1rem; padding: .5rem; }
  .topnav a { font-size: .5rem; padding: .55rem .5rem; }
  .grid, .dates { grid-template-columns: 1fr; }
  .dates { padding: 1rem; gap: 1rem; }
  .dates p + p { border-top: 1px solid var(--border); padding-top: .75rem; }
  .btn { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  a.card { transition: none; }
}
</style></head><body>
<a class="skip-link" href="#content">Skip to participant guide</a>
<div class="wrap">
<nav class="topnav" aria-label="Guide sections"><ul>
<li><a href="#start">Get started</a></li><li><a href="#prepare">Prepare</a></li><li><a href="#tracks">Tracks</a></li><li><a href="#submit">Submit</a></li><li><a href="#judging">Judging</a></li><li><a class="nav-cta" href="${esc(event.links.home)}">Event site ↗</a></li>
</ul></nav>
<main id="content">
${event.status !== 'ready' ? '<aside class="notice"><strong>Organizer draft</strong> · Event settings and missing links still need confirmation.</aside>' : ''}
<header class="hero">
<img class="hero-banner" src="https://vibecda.com/assets/vibecda-notion-cover.png" width="1500" height="600" alt="vibeCDA — Build a game with AI in a weekend. Pixel-art island with a cabin, trees, and a game controller." fetchpriority="high">
<p class="eyebrow">${esc(event.name)} / Coeur d'Alene, ID</p>
<h1>vibe<span class="cda">CDA</span><br>Participant guide</h1>
<p class="lead"><strong>Arrive ready. Build something playable.</strong><br>${esc(event.description)}</p>
<div class="dates"><p><strong>Building starts</strong>${esc(date('startsAt'))}</p><p><strong>Submission deadline</strong>${esc(date('submissionDeadline'))}</p></div>
</header>
<section aria-labelledby="start"><h2 id="start">Get started</h2>
<div class="grid">
${link('registration', '1. Register', 'Reserve your place. Jam signup is a separate step.')}
${link('jam', '2. Join the jam', 'See the rules, enter your project, and browse submissions.')}
${link('codespaces', '3. Start building', 'Open the prepared web-game environment. Use your own AI login.')}
${link('community', '4. Get help', 'Find teammates, ask mentors, and follow announcements.')}
${link('starterRepository', 'Starter & instructions', 'Read the participant guide or run the starter locally.')}
${link('results', 'Projects & results', 'Explore what the community built this weekend.')}
</div></section>
<section aria-labelledby="prepare"><h2 id="prepare">Before you arrive</h2><ol><li>Create GitHub and itch.io accounts and choose your AI tool.</li><li>Open the starter, publish it to a team repository, and run <code>npm run dev</code>.</li><li>Check your game opens and your AI login works. Check remaining cloud/AI allowances.</li><li>Bring your charger. Native-engine users should install their editor on their own laptop.</li></ol>
<div class="resources"><a href="${esc(event.links.starterRepository)}/blob/main/docs/tools.md">Installed tools &amp; game resources ↗</a><a href="${esc(event.links.starterRepository)}/blob/main/docs/editors.md">Connect desktop VS Code, SSH editors, or T3 Code ↗</a></div></section>
<section aria-labelledby="tracks"><h2 id="tracks">Pick a track</h2><div class="grid tracks">${event.tracks.map(t => `<article class="card track-card ${trackClass[t.id] ?? ''}"><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p>${t.judged ? `<p class="criteria">${t.criteria.map(c => esc(c.name)).join(' · ')}. Each criterion has equal weight.</p>${t.jamUrl ? `<p class="track-link"><a class="btn" href="${esc(t.jamUrl)}">Join / submit to ${esc(t.name)} ↗</a></p>` : '<p class="criteria">Jam link coming soon.</p>'}` : ''}</article>`).join('')}</div></section>
<section aria-labelledby="submit"><h2 id="submit">Submit your project</h2><ol><li>Save, commit, and push your final code. Record the submitted commit.</li><li>Run <code>npm run package</code> for the web starter and download <code>artifacts/game.zip</code>.</li><li>Create an itch.io project, upload the build, and test it as a visitor. Native games upload the appropriate platform build.</li><li>Use <strong>Submit your project</strong> on the jam page and complete the submission fields. Uploading alone does not enter the jam.</li></ol>
<p class="muted">Your Codespaces preview is temporary; use the submitted build or a durable hosted demo for judging.</p></section>
<section aria-labelledby="judging"><h2 id="judging">Judging</h2><p>Freeplay and Wizards and Lizards each have five criteria scored 1–5 with equal weight. GTA Cda is a community build and is not judged.</p>
<ul class="judging-times"><li><strong>Judging closes</strong>${esc(date('judgingEndsAt'))}</li><li><strong>Awards</strong>${esc(date('awardsAt'))}<br><span class="muted">${esc(event.sundayVenue)}</span></li></ul></section>
</main>
<footer><p class="pixel">${esc(event.name)}</p><p><a href="${esc(event.links.home)}">Back to vibeCDA ↗</a></p><p>Keep your project, credits, and source links available after the event.</p></footer>
</div></body></html>`;
await mkdir('dist-hub', { recursive: true });
await writeFile('dist-hub/index.html', html);
console.log(`Built dist-hub/index.html (${event.status}). Publish this under the event site after event:check passes.`);
