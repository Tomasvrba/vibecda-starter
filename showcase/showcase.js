// vibeCDA showcase: renders games.json as a scrolling deck. No dependencies, no build step.
const MODELS = { fable: 'Fable 5.2', opus: 'Opus 5.5' };
const $ = (selector, root = document) => root.querySelector(selector);
const pad = (n) => String(n).padStart(2, '0');

/** Tiny element builder: h('a', { href }, 'text', child). Falsy children are skipped. */
function h(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (key === 'onclick') node.addEventListener('click', value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  node.append(...children.flat().filter((child) => child || child === 0));
  return node;
}
const svg = (markup) => {
  const span = h('span', { class: 'play', 'aria-hidden': 'true' });
  span.innerHTML = markup;
  return span;
};
const external = (href, label, cls) => h('a', { href, target: '_blank', rel: 'noopener', class: cls }, label);
const duration = (s) => (s ? `${Math.floor(s / 60)}:${pad(s % 60)}` : '');

function poster(game, eager = false) {
  const box = h('span', { class: 'poster' }, h('span', { class: 'poster-fallback', 'aria-hidden': 'true' }, game.title));
  if (game.poster) {
    const img = h('img', { src: game.poster, alt: '', loading: eager ? 'eager' : 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' });
    img.addEventListener('error', () => img.remove());
    box.append(img);
  }
  return box;
}

/** The picture. Its play button plays the video right here; without a video it opens the game. */
function media(game, eager, live = false) {
  const { video, clip } = game;
  const play = svg('<svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z"/></svg>');
  if (!video) {
    return h('a', { class: 'media', href: game.play, target: '_blank', rel: 'noopener', 'aria-label': `Play ${game.title} in a new tab` },
      poster(game, eager), h('span', { class: 'media-label' }, 'No video · opens the game'));
  }
  if (!clip && video.type !== 'youtube') {
    return h('a', { class: 'media', href: video.url, target: '_blank', rel: 'noopener', 'aria-label': `Watch the ${game.title} video on X` },
      poster(game, eager), play, h('span', { class: 'media-label' }, 'Watch on X'));
  }
  const label = clip ? `${clip.sound ? 'Play with sound' : 'Play clip'} · ${duration(clip.seconds)}` : 'Watch · YouTube';
  const box = h('div', { class: live && clip ? 'media live' : 'media' }, poster(game, eager), live && clip && clipVideo(game));
  box.append(h('button', { type: 'button', class: 'media-play', 'aria-label': `Play the ${game.title} video`, onclick: () => playHere(box) }, play, h('span', { class: 'media-label' }, label)));
  box.game = game;
  box.live = Boolean(live && clip);
  return box;
}

const tags = (game, count) => h('p', { class: 'sheet-top' },
  h('span', { class: `tag tag-${game.model}` }, MODELS[game.model]),
  game.weekend && h('span', { class: 'tag tag-weekend' }, 'Weekend-sized'),
  game.fan && h('span', { class: 'tag tag-fan' }, 'Fan game'),
  h('span', { class: 'genre' }, game.genre),
  count && h('span', { class: 'count' }, count));

const byline = (game) => h('p', { class: 'by' }, 'by ', external(game.creatorUrl, game.creator));

function actions(game, small) {
  const { video } = game;
  return h('p', { class: 'actions' },
    external(game.play, 'Play it', small ? 'btn btn-small' : 'btn'),
    video && external(video.url, video.type === 'x' ? `Full video on X${video.seconds ? ` (${duration(video.seconds)})` : ''}` : 'Video on YouTube'),
    game.links.map((link) => external(link.url, link.label)));
}

function featureScene(game, index, total) {
  return h('section', { class: 'scene feature', id: `g-${game.id}`, 'data-model': game.model, 'data-title': game.title, 'aria-labelledby': `t-${game.id}` },
    h('div', { class: 'wrap feature-inner' },
      h('div', { class: 'feature-media r r-media', style: '--i:0' }, media(game, index === 0, true)),
      h('div', { class: 'sheet r', style: '--i:2' },
        tags(game, `${pad(index + 1)} / ${pad(total)}`),
        h('h2', { id: `t-${game.id}` }, game.title),
        byline(game),
        h('p', { class: 'blurb' }, game.blurb),
        game.specs.length > 0 && h('dl', { class: 'stats' }, game.specs.map((spec) => h('div', { class: 'stat' },
          h('dt', {}, spec.label),
          h('dd', {}, h('span', { class: 'stat-value' }, spec.value), spec.note && h('span', { class: 'stat-note' }, spec.note))))),
        game.stack.length > 0 && h('ul', { class: 'chips', 'aria-label': 'Built with' }, game.stack.map((item) => h('li', {}, item))),
        game.story && h('p', { class: 'story' }, game.story),
        game.caveat && h('p', { class: 'caveat' }, h('strong', {}, 'Good to know: '), game.caveat),
        actions(game, false))));
}

function gridCard(game, index) {
  const card = h('article', { class: 'card r', 'data-model': game.model, style: `--i:${Math.min(index, 11) + 4}` },
    media(game, false),
    h('div', { class: 'card-body' },
      tags(game),
      h('h3', {}, game.title),
      byline(game),
      h('p', { class: 'blurb' }, game.blurb),
      game.fact && h('p', { class: 'fact' }, game.fact),
      game.featured && h('p', { class: 'fact' }, h('a', { href: `#g-${game.id}` }, 'See the full spec sheet ↑')),
      actions(game, true)));
  card.game = game;
  return card;
}


// ---------- playing a video in place ----------
let playing; // the .media box that is playing with sound, if any

function clipVideo(game) {
  const video = h('video', { class: 'clip', src: game.clip.src, loop: true, playsinline: true, preload: 'none', tabindex: '-1' });
  video.muted = true;
  video.addEventListener('playing', () => video.classList.add('on'), { once: true });
  return video;
}

function playHere(box) {
  if (playing && playing !== box) stopHere(playing);
  playing = box;
  box.classList.add('playing');
  const { game } = box;
  if (!game.clip) {
    const start = game.video.start ? `&start=${game.video.start}` : '';
    box.append(h('iframe', { src: `https://www.youtube-nocookie.com/embed/${game.video.id}?autoplay=1&rel=0${start}`, title: `${game.title} video`, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: true, referrerpolicy: 'strict-origin-when-cross-origin' }));
    return;
  }
  let video = $('video.clip', box);
  if (!video) box.append(video = clipVideo(game));
  video.loop = false;
  video.muted = false;
  video.controls = true;
  video.tabIndex = 0;
  video.currentTime = 0;
  video.onended = () => stopHere(box);
  video.play().catch(() => {});
}

/** Back to the picture (or, in a featured scene, the muted loop). */
function stopHere(box) {
  if (playing === box) playing = undefined;
  box.classList.remove('playing');
  $('iframe', box)?.remove();
  const video = $('video.clip', box);
  if (!video) return;
  if (!box.live) return video.remove();
  video.onended = null;
  video.controls = false;
  video.tabIndex = -1;
  video.muted = true;
  video.loop = true;
  if (box.visible) video.play().catch(() => {}); else video.pause();
}

// ---------- deck navigation ----------
let scenes = [];
function currentScene() {
  let index = 0;
  scenes.forEach((scene, i) => { if (scene.getBoundingClientRect().top <= innerHeight * 0.4) index = i; });
  return index;
}
function go(direction) {
  const index = currentScene();
  const box = scenes[index].getBoundingClientRect();
  // A scene taller than the screen (the grid, or any scene on a phone) scrolls through before moving on.
  if (direction > 0 && box.bottom > innerHeight + 40) return scrollBy({ top: innerHeight * 0.85, behavior: 'smooth' });
  if (direction < 0 && box.top < -40) {
    return box.top < -innerHeight ? scrollBy({ top: -innerHeight * 0.85, behavior: 'smooth' }) : scenes[index].scrollIntoView({ behavior: 'smooth' });
  }
  scenes[Math.max(0, Math.min(scenes.length - 1, index + direction))].scrollIntoView({ behavior: 'smooth' });
}
addEventListener('keydown', (event) => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target instanceof Element ? event.target : document.body;
  if (target.closest('input, textarea, select, video, [contenteditable]')) return;
  const onControl = target.closest('button, a');
  const key = event.key;
  let direction = 0;
  if (key === 'ArrowDown' || key === 'PageDown' || key === 'ArrowRight') direction = 1;
  else if (key === 'ArrowUp' || key === 'PageUp' || key === 'ArrowLeft') direction = -1;
  else if (key === ' ' && !onControl) direction = event.shiftKey ? -1 : 1;
  else if (key === 'Home') { scenes[0].scrollIntoView({ behavior: 'smooth' }); event.preventDefault(); return; }
  else if (key === 'End') { scenes.at(-1).scrollIntoView({ behavior: 'smooth' }); event.preventDefault(); return; }
  if (!direction) return;
  event.preventDefault();
  go(direction);
});

function setUpDeck() {
  scenes = [...document.querySelectorAll('.scene')];
  $('#total').textContent = pad(scenes.length);
  const dots = scenes.map((scene, i) => {
    scene.id ||= `scene-${i}`;
    const color = scene.dataset.model === 'opus' ? 'var(--gold)' : 'var(--cyan)';
    return h('a', { href: `#${scene.id}`, 'aria-label': scene.dataset.title, title: scene.dataset.title, style: `--dot:${color}` });
  });
  $('#dots').replaceChildren(...dots);

  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('in'); reveal.unobserve(entry.target); }
  }, { rootMargin: '0px 0px -18% 0px' });
  scenes.forEach((scene) => reveal.observe(scene));

  const navLinks = [...document.querySelectorAll('.topbar nav a')];
  let queued = false;
  const update = () => {
    queued = false;
    const index = currentScene();
    $('#counter').textContent = pad(index + 1);
    dots.forEach((dot, i) => (i === index ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')));
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 0);
    const scene = scenes[index];
    const section = scene.classList.contains('feature') ? 'featured' : scene.id;
    navLinks.forEach((link) => (link.hash === `#${section}` ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current')));
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}

// ---------- hero tilt and starfield ----------
function setUpHero() {
  const hero = $('.hero');
  if (!matchMedia('(hover: hover)').matches) return;
  hero.addEventListener('pointermove', (event) => {
    hero.style.setProperty('--mx', (event.clientX / innerWidth - 0.5).toFixed(3));
    hero.style.setProperty('--my', (event.clientY / innerHeight - 0.5).toFixed(3));
  });
}

function setUpSky() {
  const canvas = $('#sky');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0;
  let height = 0;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth; height = innerHeight;
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from({ length: Math.round((width * height) / 7000) }, () => {
      const pick = Math.random();
      return { x: Math.random() * width, y: Math.random() * height, size: Math.random() < 0.18 ? 2 : 1, depth: 0.05 + Math.random() * 0.3, phase: Math.random() * 6.28, speed: 0.5 + Math.random() * 1.6, color: pick < 0.14 ? '#3de0ff' : pick < 0.22 ? '#f0a830' : '#ffffff' };
    });
    draw(0);
  };
  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      const y = (((star.y - scrollY * star.depth) % height) + height) % height;
      ctx.globalAlpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(star.phase + time * 0.001 * star.speed));
      ctx.fillStyle = star.color;
      ctx.fillRect(Math.round(star.x), Math.round(y), star.size, star.size);
    }
  };
  const loop = (time) => { draw(time); requestAnimationFrame(loop); };
  addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
}

/** Clips play only while on screen: featured scenes loop theirs muted, and one playing with sound stops when it leaves. */
function setUpClips() {
  const watch = new IntersectionObserver((entries) => {
    for (const { target: box, isIntersecting } of entries) {
      box.visible = isIntersecting;
      const video = $('video.clip', box);
      if (!isIntersecting) { if (box === playing) stopHere(box); else video?.pause(); }
      else if (box.live && box !== playing) video?.play().catch(() => {});
    }
  }, { threshold: 0.35 });
  document.querySelectorAll('div.media').forEach((box) => watch.observe(box));
}

/** The hero showreel: one silent video of short cuts, with a title card and a progress segment per game. */
function setUpReel(reel, games) {
  const stage = $('#stage');
  const video = $('#reel');
  const byId = new Map(games.map((game) => [game.id, game]));
  const clips = (reel?.clips ?? []).map((id) => byId.get(id));
  if (!clips.length || clips.includes(undefined)) return stage.closest('.stage-wrap').remove();

  let wanted = true; // false once the visitor pauses it
  let visible = false;
  const play = () => { if (wanted && visible) video.play().catch(() => {}); };
  const segs = clips.map((game, i) => h('button', { type: 'button', 'data-model': game.model, title: game.title, 'aria-label': `Jump to ${game.title}`,
    onclick: () => { video.currentTime = i * reel.clipSeconds + 0.02; wanted = true; play(); } }));
  $('#segs').append(...segs);
  $('#reel-total').textContent = pad(clips.length);

  let shown = -1;
  const show = (index) => {
    shown = index;
    const game = clips[index];
    const stat = game.specs[0];
    stage.dataset.model = game.model;
    $('#reel-count').textContent = pad(index + 1);
    segs.forEach((seg, i) => seg.style.setProperty('--p', i < index ? 1 : 0));
    const link = game.featured ? { href: `#g-${game.id}` } : { href: game.play, target: '_blank', rel: 'noopener' };
    $('#lower').replaceChildren(
      h('span', { class: `tag tag-${game.model}`, style: '--k:0' }, MODELS[game.model]),
      h('a', { class: 'lower-title', style: '--k:1', ...link }, game.title),
      h('span', { class: 'lower-by', style: '--k:2' }, `by ${game.creator}`, stat && h('b', {}, ` · ${stat.label}: ${stat.value}`)));
    $('#wipe').animate([{ translate: '-180% 0' }, { translate: '820% 0' }], { duration: 560, easing: 'cubic-bezier(.6, 0, .2, 1)' });
  };
  const update = () => {
    const at = video.currentTime / reel.clipSeconds;
    const index = Math.min(clips.length - 1, Math.floor(at));
    if (index !== shown) show(index);
    segs[index].style.setProperty('--p', Math.min(1, at - index).toFixed(3));
  };
  let ticking = false;
  const tick = () => {
    update();
    if (video.paused) ticking = false; else requestAnimationFrame(tick);
  };
  video.addEventListener('playing', () => { stage.classList.remove('paused'); if (!ticking) { ticking = true; requestAnimationFrame(tick); } });
  video.addEventListener('pause', () => stage.classList.add('paused'));
  video.addEventListener('seeked', update);
  const toggle = () => { wanted = video.paused; if (wanted) play(); else video.pause(); };
  $('#reel-toggle').addEventListener('click', toggle);
  video.addEventListener('click', toggle);

  video.muted = true;
  video.poster = reel.poster;
  video.src = reel.src;
  show(0);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) play(); else video.pause(); }, { threshold: 0.3 }).observe(stage);
  // Browsers that hold back autoplay (battery saver, strict settings) start it on the first tap, click or key.
  for (const type of ['pointerdown', 'keydown', 'touchstart']) addEventListener(type, () => { if (video.paused) play(); }, { passive: true });
}

// ---------- gallery filters ----------
function setUpFilters() {
  const state = { model: 'all', weekend: false, twoD: false, video: false };
  const cards = [...document.querySelectorAll('#grid .card')];
  const apply = () => {
    let shown = 0;
    for (const card of cards) {
      const game = card.game;
      const visible = (state.model === 'all' || game.model === state.model) && (!state.weekend || game.weekend) && (!state.twoD || game.dim === '2D') && (!state.video || Boolean(game.video));
      card.hidden = !visible;
      if (visible) shown++;
    }
    $('#shown').textContent = shown === cards.length ? `Showing all ${shown} games` : `Showing ${shown} of ${cards.length} games`;
    $('#empty').hidden = shown > 0;
  };
  for (const button of document.querySelectorAll('.filters button')) {
    button.addEventListener('click', () => {
      if (button.dataset.model) {
        state.model = button.dataset.model;
        document.querySelectorAll('.filters [data-model]').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      } else {
        state[button.dataset.flag] = !state[button.dataset.flag];
        button.setAttribute('aria-pressed', String(state[button.dataset.flag]));
      }
      apply();
    });
  }
  apply();
}

// ---------- start ----------
async function start() {
  setUpSky();
  let games = [];
  let reel;
  try {
    const response = await fetch('./games.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`games.json: HTTP ${response.status}`);
    ({ games, reel } = await response.json());
  } catch (error) {
    console.error(error);
    $('#featured').append(h('p', { class: 'noscript' }, 'The game list did not load. Serve this folder over http (for example, npm run dev) instead of opening the file directly.'));
  }
  const featured = games.filter((game) => game.featured);
  // Alternate the two models so the deck keeps changing colour.
  const fable = featured.filter((game) => game.model === 'fable');
  const opus = featured.filter((game) => game.model === 'opus');
  const order = [];
  for (let i = 0; i < Math.max(fable.length, opus.length); i++) order.push(fable[i], opus[i]);
  const deck = order.filter(Boolean);

  $('#featured').append(...deck.map((game, i) => featureScene(game, i, deck.length)));
  $('#grid').append(...[...games].sort((a, b) => Number(b.weekend) - Number(a.weekend)).map(gridCard));
  for (const id of ['game-count', 'all-count']) $(`#${id}`).textContent = games.length || '';

  setUpFilters();
  setUpClips();
  setUpReel(reel, games);
  setUpDeck();
  setUpHero();
  if (location.hash) $(location.hash)?.scrollIntoView();
}
start();
