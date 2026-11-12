# Setup status

Updated 2026-11-12. Live publication is in progress; this file is updated after
each verified milestone. Do not treat prepared files as configured live services.

## Completed locally

- Phaser/Vite/TypeScript starter with a playable original game.
- Build and itch.io ZIP packaging; production build passes.
- Chromium tests for keyboard movement, collecting, restart, and pointer controls
  at phone dimensions pass on this machine.
- Devcontainer definition and environment publishing workflow prepared; image
  build verification is running.
- Participant guide, agent instructions, draft pre-arrival message, itch.io settings,
  event hub generator, scoring audit tool, and archive structure.
- Site schedule and criteria inspected. Tom requested equal-weight criteria,
  overriding the site's current weights; configuration updated accordingly.
- Tomasvrba GitHub CLI authentication confirmed. Website repository not found yet.

## Pending live setup / human input

- Publish Tomasvrba/vibecda-starter and mark it as a template.
- Publish the environment image, make it public, and reference it from devcontainer.
- Complete itch.io login / Cloudflare verification and confirm the owning account.
- Choose track-specific jams versus one shared/manual-ranked jam.
- Confirm proposed judging end at 5:30pm Sunday; code freeze stays noon and awards 6pm.
- Identify site source/hosting so links and equal-weight rubrics can be updated.
- Add judge accounts, prepare the audience-choice ballot, and test a real submission.
- Test a participant-owned Codespace and AI login using that person's own account.

## Undo

Changes are additive in this repository. Once published, archive the new template
repo and remove the added participant hub/page links to retire the setup. Keep
participant projects and credentials. Docker image/cache and temporary Chromium
downloads can be removed selectively after testing.
