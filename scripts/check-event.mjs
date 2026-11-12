import { loadEvent, validateEvent } from './event-config.mjs';
const event = await loadEvent();
validateEvent(event, { launch: true });
console.log(`${event.name}: launch configuration complete. Still run the participant rehearsal before publishing.`);
