# vibeCDA starter instructions

This repository contains a Phaser 3 + Vite + TypeScript browser game and event
organizer materials. Participant game changes belong in src/ and public/.

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
- Do not change organizer/ rules, scores, or event settings during gameplay work.
- Commit and push useful milestones to the team's repository. Before publishing
  or uploading, check the target account and destination with the participant.
