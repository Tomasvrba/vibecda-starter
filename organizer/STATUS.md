# Setup status

Updated 2026-11-13. Live publication is in progress; this file is updated after
each verified milestone. Do not treat prepared files as configured live services.

## Completed and published

- Phaser/Vite/TypeScript starter with a playable original game.
- Build and itch.io ZIP packaging; production build passes.
- Chromium tests for keyboard movement, collecting, restart, and pointer controls
  at phone dimensions pass on this machine. A third browser test verifies the
  packaged ZIP under a nested path inside an iframe; all three pass in GitHub CI.
- Devcontainer image built and tested offline. All tools run; a fresh workspace
  passes eight infrastructure tests, build/ZIP packaging, and two browser tests.
- Added the official SSH server feature to both container configurations and a
  login-shell PATH fix for the AI CLIs. A fresh local devcontainer built and
  bootstrapped successfully; real SSH login resolved and ran Claude, Codex, and
  Gemini. Existing Codespaces must pull and rebuild to get this configuration.
  docs/tools.md inventories installed tools and recommends optional game resources;
  docs/editors.md covers desktop VS Code, SSH editors, and T3 Code's SSH route.
- Participant guide, agent instructions, draft pre-arrival message, itch.io settings,
  event hub generator, scoring audit tool, and archive structure.
- Site schedule and criteria inspected. Tom requested equal-weight criteria,
  overriding the site's current weights; configuration updated accordingly.
- Published https://github.com/VibeCdA/vibecda-starter as a public template.
  Discussions enabled. GitHub's Check starter workflow passes.
- Environment image publishing workflow completed successfully:
  https://github.com/VibeCdA/vibecda-starter/actions/runs/43484301173
  Published image: ghcr.io/vibecda/vibecda-dev:cc01609ba690d06f763ff1b689468ef27b12bcce
  The default devcontainer now references this prepared image. A local-build
  configuration is also available for Apple Silicon and image rebuilds. Anonymous
  registry access to the organization image was verified. The old personal image
  remains available as a fallback.
- Transferred the starter to VibeCdA, preserving repository ID and history.
  Added a public organization profile in VibeCdA/.github. Base member access is
  None; Organizers has Maintain and Mentors has Triage on the starter. Main branch
  changes require CI, review, and resolved conversations for non-admins; force
  pushes and deletion are blocked. Member deletion/transfer, visibility changes,
  private repository creation, and team creation are restricted to owners.
  See GITHUB-ADMIN.md for settings, migration details, and rollback instructions.
- Tom completed itch.io login and email verification. Host account: tmsvr.
- Published Freeplay: https://itch.io/jam/vibecda-2026-freeplay (jam ID 422198).
- Published Wizards and Lizards:
  https://itch.io/jam/vibecda-2026-wizards-and-lizards (jam ID 422199).
  Both have five voted criteria, no primary-criterion override, judges-only voting,
  no rating queue, new uploads locked during judging, and results hidden.
  Saved UTC dates were checked against the confirmed Pacific schedule.
  The jams are unlisted in the global calendar and accessible by direct link;
  anonymous access to both jams was verified. Judges will be added when Tom supplies
  their usernames. Reusable public jam copy is archived under organizer/jams/.
- Editable SVG and 630 × 500 PNG covers are saved in organizer/assets/. Both
  track covers are attached to the live jams and their saved thumbnails verified.
- A separate upload rehearsal passed anonymous itch.io iframe rendering,
  keyboard collection, and restart with no page errors. Tom requested removal
  afterwards; project 5349310 is now unpublished (Draft), verified in its settings,
  and participant-facing links and demo cover files have been removed.
- Two track jams and Sunday 5:30pm judging end confirmed by Tom. A printable audience ballot is
  prepared in audience-ballot.html; per-track audience awards need confirmation.
- Tom does not manage the existing website. Prepared site-change-request.md for
  Tom to pass to the webmaster. The participant guide is hosted on GitHub
  Pages at https://vibecda.github.io/vibecda-starter/. Deployment succeeded and
  the public page returns HTTP 200. Both jam links are configured and event:check
  passes. The updated guide is deployed without a draft banner, both jam links
  are visible, and GitHub CI passes. Website rubric changes still need the webmaster.

## Pending live setup / human input

- Tom forwards site-change-request.md to the webmaster to add guide links and
  update the displayed rubric weights.
- Add judge accounts (Tom will supply usernames later), confirm audience-choice
  policy, and rehearse a jam entry and rating with a real judge account.
- Test a participant-owned Codespace and AI login using that person's own account.
  Include a full T3 Code desktop → Codespace pilot if participants want T3;
  the local SSH test does not verify that complete integration.
- Require organization-wide two-factor authentication manually if GitHub allows
  the save. The sole owner's 2FA is enabled, but GitHub's native-browser form
  redirected to a 404 at /organizations/VibeCdA/settings/two_factor_enforcement.
  The API did not change the setting. The org requirement remains off.

## Undo

Changes are additive in this repository. Archive the new template repo and remove
the added participant hub/page links to retire the setup. Unpublish the two event
jams to withdraw the event pages without deleting their data. The retired
rehearsal project is already Draft. Keep participant projects and credentials.
Docker image/cache and temporary Chromium
downloads can be removed selectively after testing.
The demo can be republished from its itch.io dashboard if desired. Repository
changes can be reverted with Git; reverting the SSH changes requires another
container rebuild and removes that external-editor connection route.
