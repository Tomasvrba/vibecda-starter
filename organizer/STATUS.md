# Setup status

Updated 2026-11-12. Live publication is in progress; this file is updated after
each verified milestone. Do not treat prepared files as configured live services.

## Completed locally

- Phaser/Vite/TypeScript starter with a playable original game.
- Build and itch.io ZIP packaging; production build passes.
- Chromium tests for keyboard movement, collecting, restart, and pointer controls
  at phone dimensions pass on this machine.
- Devcontainer image built and tested offline. All tools run; a fresh workspace
  passes eight infrastructure tests, build/ZIP packaging, and two browser tests.
- Participant guide, agent instructions, draft pre-arrival message, itch.io settings,
  event hub generator, scoring audit tool, and archive structure.
- Site schedule and criteria inspected. Tom requested equal-weight criteria,
  overriding the site's current weights; configuration updated accordingly.
- Published https://github.com/Tomasvrba/vibecda-starter as a public template.
  Discussions enabled. GitHub's Check starter workflow passes.
- Environment image publishing workflow running:
  https://github.com/Tomasvrba/vibecda-starter/actions/runs/43301359170
- Native Chrome reached itch.io login after passing Cloudflare. GitHub OAuth login
  needs Tom to sign into GitHub in that native Chrome session.
- Two track jams and Sunday 5:30pm judging end confirmed by Tom. Jam configuration
  and descriptions are ready in itch-setup.md. A printable audience ballot is
  prepared in audience-ballot.html; per-track audience awards need confirmation.
- Website repository not found yet; source/hosting location requested.

## Pending live setup / human input

- Publish the environment image, make it public, and reference it from devcontainer.
- Complete native-browser GitHub sign-in for itch.io and confirm the itch.io account.
- Create the two track jams with their respective equal-weight criteria.
- Identify site source/hosting so links and equal-weight rubrics can be updated.
- Add judge accounts, prepare the audience-choice ballot, and test a real submission.
- Test a participant-owned Codespace and AI login using that person's own account.

## Undo

Changes are additive in this repository. Once published, archive the new template
repo and remove the added participant hub/page links to retire the setup. Keep
participant projects and credentials. Docker image/cache and temporary Chromium
downloads can be removed selectively after testing.
