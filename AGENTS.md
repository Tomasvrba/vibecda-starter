# vibeCDA starter instructions

This repository contains Phaser 3 and Three.js browser examples using Vite and
TypeScript, plus public participant guides. Participant game changes belong in
src/ and public/. The Three.js example is src/three-game.ts; both engines are
installed in the default Codespace.

- Read package.json before installing anything. The devcontainer already has
  Node, Claude Code, Codex, Gemini CLI, Chromium/Playwright, ffmpeg, ImageMagick,
  zip, and ripgrep. Participants authenticate their own AI accounts.
- Run npm run dev for port 5173, npm run build for type/build checks, and
  npm run package for artifacts/game.zip. Run npm run test:browser when changing
  controls or the submission path. Update the browser test if changing mechanics.
- Use relative asset paths; the production build must work inside itch.io's
  iframe and from subdirectories. Keep index.html at the root of the ZIP.
- The starter has no game backend or runtime AI API. Do not add either without
  discussing the requirement with the team. Do not put secrets in public/,
  VITE_ variables, Git, built assets, or container images.
- Keep gameplay small and playable. Preserve keyboard and touch controls where
  possible. Record third-party asset licenses and AI usage in credits.
- Do not change event/ rules or event settings during gameplay work. Internal
  organizer operations and scoring tools live in a separate private repository.
- Commit and push useful milestones to the team's repository. Before publishing
  or uploading, check the target account and destination with the participant.
