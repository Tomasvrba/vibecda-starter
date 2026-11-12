# Setup status

Updated 2026-11-12. Live publication is in progress; this file is updated after
each verified milestone. Do not treat prepared files as configured live services.

## Completed locally

- Phaser/Vite/TypeScript starter with a playable original game.
- Build and itch.io ZIP packaging; production build passes.
- Chromium tests for keyboard movement, collecting, restart, and pointer controls
  at phone dimensions pass on this machine. A third browser test verifies the
  packaged ZIP under a nested path inside an iframe; all three pass in GitHub CI.
- Devcontainer image built and tested offline. All tools run; a fresh workspace
  passes eight infrastructure tests, build/ZIP packaging, and two browser tests.
- Participant guide, agent instructions, draft pre-arrival message, itch.io settings,
  event hub generator, scoring audit tool, and archive structure.
- Site schedule and criteria inspected. Tom requested equal-weight criteria,
  overriding the site's current weights; configuration updated accordingly.
- Published https://github.com/Tomasvrba/vibecda-starter as a public template.
  Discussions enabled. GitHub's Check starter workflow passes.
- Environment image publishing workflow completed successfully:
  https://github.com/Tomasvrba/vibecda-starter/actions/runs/43301359170
  Published image: ghcr.io/tomasvrba/vibecda-dev:f7779fb13b3c3910a7f9a189bc011b7085d9b68f
  The default devcontainer now references this prepared image. A local-build
  configuration is also available for Apple Silicon and image rebuilds.
- Native Chrome reached itch.io login after passing Cloudflare. GitHub OAuth login
  needs Tom to sign into GitHub in that native Chrome session.
- Two track jams and Sunday 5:30pm judging end confirmed by Tom. Jam configuration
  and descriptions are ready in itch-setup.md. A printable audience ballot is
  prepared in audience-ballot.html; per-track audience awards need confirmation.
- Tom does not manage the existing website. Prepared site-change-request.md for
  Tom to pass to the webmaster. The participant guide will be hosted on GitHub
  Pages at https://tomasvrba.github.io/vibecda-starter/. Deployment succeeded and
  the public page returns HTTP 200. It remains visibly labeled as a draft until
  the itch.io jams are configured.

## Pending live setup / human input

- Complete native-browser GitHub sign-in for itch.io and confirm the itch.io account.
- Create the two track jams with their respective equal-weight criteria.
- Tom forwards site-change-request.md to the webmaster to add guide links and
  update the displayed rubric weights.
- Add judge accounts, prepare the audience-choice ballot, and test a real submission.
- Test a participant-owned Codespace and AI login using that person's own account.

## Undo

Changes are additive in this repository. Once published, archive the new template
repo and remove the added participant hub/page links to retire the setup. Keep
participant projects and credentials. Docker image/cache and temporary Chromium
downloads can be removed selectively after testing.
