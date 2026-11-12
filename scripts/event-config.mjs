import { readFile } from 'node:fs/promises';

export async function loadEvent(path = 'organizer/event.json') {
  const event = JSON.parse(await readFile(path, 'utf8'));
  validateEvent(event);
  return event;
}

export function validateEvent(event, { launch = false } = {}) {
  for (const field of ['name', 'id', 'timezone', 'description']) {
    if (typeof event[field] !== 'string' || !event[field].trim()) throw new Error(`Missing event ${field}`);
  }
  new Intl.DateTimeFormat('en', { timeZone: event.timezone });
  const times = ['startsAt', 'submissionDeadline', 'judgingEndsAt', 'awardsAt'].map(field => {
    if (!/(Z|[+-]\d{2}:\d{2})$/.test(event[field] || '') || !Number.isFinite(Date.parse(event[field]))) {
      throw new Error(`Invalid timestamp with timezone: ${field}`);
    }
    return Date.parse(event[field]);
  });
  if (times.some((time, i) => i && time <= times[i - 1])) throw new Error('Event times must be in chronological order');
  if (!Number.isInteger(event.maxTeamSize) || event.maxTeamSize < 1) throw new Error('Invalid maximum team size');
  for (const [name, value] of Object.entries(event.links)) {
    if (value && new URL(value).protocol !== 'https:') throw new Error(`Use an HTTPS URL for ${name}`);
  }
  const trackIds = new Set();
  for (const track of event.tracks) {
    if (!track.id || trackIds.has(track.id)) throw new Error('Track IDs must be unique');
    trackIds.add(track.id);
    if (!track.judged) continue;
    const ids = new Set(track.criteria.map(c => c.id));
    if (ids.size !== track.criteria.length || !ids.size) throw new Error(`Invalid criteria for ${track.id}`);
    if (track.criteria.some(c => !Number.isFinite(c.weight) || c.weight <= 0)) throw new Error(`Invalid weights for ${track.id}`);
    if (track.criteria.reduce((sum, c) => sum + c.weight, 0) !== 100) throw new Error(`Weights for ${track.id} must total 100`);
    if (track.tieBreakers.some(id => !ids.has(id))) throw new Error(`Unknown tie-breaker for ${track.id}`);
  }
  if (launch) {
    if (!event.confirmed || event.status !== 'ready') throw new Error('Organizer must confirm event settings and set status to ready');
    for (const name of ['home', 'registration', 'jam', 'starterRepository', 'codespaces', 'community']) {
      if (!event.links[name]) throw new Error(`Launch needs links.${name}`);
    }
  }
}
