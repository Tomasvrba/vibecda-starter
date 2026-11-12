# VibeCDA infrastructure setup plan

Drafted 2026-11-12. This is a proposed setup, not a record of deployed services.
The project currently contains a README and assets; the event site source and
live platform configuration have not been inspected here.

## Participant journey

vibecda.com event page → registration and jam signup → starter environment →
team repository → playable build or demo → itch.io project → jam entry →
judging → results and event archive.

The event page should be the central directory. Keep registration in the existing
form if one is already in use; joining an itch.io jam is not venue registration.
Link to one persistent community space for announcements, teams, and help.
No custom account system or integration service is needed for this first event.

## 1. Confirm event settings

- [ ] Confirm event dates, explicit timezone, submission deadline, judging window,
      and awards time. Do not reuse dates from previous discussions without checking.
- [ ] Confirm allowed projects: games only, or games plus apps/tools/hardware.
- [ ] Confirm team rules, tracks, AI policy, existing-code policy, and asset credits.
- [ ] Confirm judging criteria, weights if any, tie handling, conflicts of interest,
      and separate audience-choice rules if wanted.
- [ ] Identify the itch.io host account, GitHub template owner, site source,
      community invite, and registration link.

## 2. Configure the itch.io jam

- [ ] Create one jam for this event, with a reusable event naming convention.
- [ ] Add rules, schedule, submission instructions, help link, and starter link.
- [ ] Add organizers and judges with appropriate roles.
- [ ] Select judges-only voting for native scoring, or manual ranking for a
      separately calculated weighted rubric. Configure ranking criteria before
      the submission deadline.
- [ ] Enable upload locking during judging for a ranked jam. This locks uploaded
      files during the rating period; it does not freeze externally hosted demos
      or repository commits. Record a commit/release for externally hosted work.
- [ ] Decide when results become public and configure visibility accordingly.
- [ ] Ensure platform/project-type requirements admit the intended entries;
      do not require browser builds if native projects are welcome.
- [ ] Add public submission fields for track, team display names, source URL
      where required, build instructions, demo URL/video, and asset/AI disclosures.
- [ ] If collecting organizer contact details, mark those fields private.
- [ ] Make clear that creating an itch.io project and submitting it to the jam
      are two separate steps. A team submits one project and credits contributors.

## 3. Build the starter environment

Proposed first starter: Phaser + Vite + TypeScript for browser games. This is
optional for participants; Codespaces is not a GPU desktop for native editors.
Add other starters only if participant demand warrants them.

- [ ] Create a GitHub template repository and a minimal playable example.
- [ ] Add a devcontainer, selected AI CLIs, asset utilities, and clear tool versions.
      No participant credentials belong in images or template files.
- [ ] Configure the game server to bind to 0.0.0.0 and forward its development port.
- [ ] Provide development, production build, and downloadable ZIP commands.
      Browser build assets must work from the published subdirectory.
- [ ] Keep tool installation in the image/container build and dependency setup in
      lifecycle commands. Agents should not have to discover/install the toolchain.
- [ ] Evaluate Codespaces prebuilds after measuring a cold start. A custom image
      and a repository prebuild solve different portions of startup; copied team
      repositories do not automatically inherit the template's prebuild settings.
- [ ] Add short agent instructions documenting installed tools, commands, and
      where game code/assets live.
- [ ] Provide a launch link plus instructions to publish the workspace to a team
      repository immediately, invite teammates, and commit/push regularly.
- [ ] Test each included AI CLI's remote authentication with a participant's own
      account. Installation does not provide a subscription or usage allowance.
- [ ] Provide local Node instructions and optional local devcontainer instructions.
      Native-engine teams use their own prepared host installations.
- [ ] Start with manual ZIP upload instructions. Automated itch.io publishing is
      optional after the full submission path works; keep each team's credentials
      scoped to its own environment/repository.

Personal Codespaces quotas belong to each account and may already be partly used.
Choose a small machine, configure an idle timeout, explain storage usage, and
verify billing ownership. Do not enable organizer-paid usage unintentionally.
Custom images consume more metered storage than the default image. Prebuild
settings also depend on account/organization plan and can consume resources.

## 4. Connect the event hub and coordination

- [ ] Add event-page links for Register, Join the jam, Start building, Get help,
      Submit, and View projects/results.
- [ ] Cross-link the event page, jam, starter README, and community welcome post.
- [ ] Use one persistent community space, with announcements, team finding,
      technical help, and asset sharing. The itch.io community board is an option
      if a separate chat service would add overhead.
- [ ] Publish one short preflight guide: accounts, environment choice, AI login,
      quota check, starter launch, and a working first build before arrival.
- [ ] Name a technical help owner and a submission/judging owner.

## 5. Rehearse before participant launch

- [ ] With a participant-level account, open the exact published launch link,
      record cold-start time, authenticate tools, edit the game, and preview it.
- [ ] Publish the workspace to a repository; verify saving survives stopping and
      restarting the codespace. Verify a teammate can access the intended repo.
- [ ] Build a ZIP, upload it to itch.io, configure browser playback where relevant,
      and test as a visitor without creator permissions.
- [ ] On a test jam, submit the project, complete required fields, and verify a
      judge can access and score it. Exercise deadline/upload locking separately
      without changing the live event's dates.
- [ ] Check a native build submission if that format is welcome.
- [ ] Verify the local fallback and document recovery for exhausted AI/Codespaces
      allowances, broken previews, lost sessions, and late submissions.
- [ ] Check venue Wi-Fi, power, and demo display/audio with the intended workflow.

Ready means a participant can get from the event page to a playable submission
without organizer-only privileges or an agent installing the base toolchain.

## 6. Preserve the event

- [ ] Keep a versioned event folder with rules, schedule, rubric, public project
      links, results, and retrospective. Exclude private registration/judge data.
- [ ] Record submitted commits/releases and arrange permission for any copies of
      participant builds or photos retained in the organizer archive.
- [ ] Add a permanent event page linking winners, gallery, and lessons learned.
- [ ] Before codespace cleanup, remind participants to push/export their work;
      an unpublished template codespace is not a durable GitHub repository.
- [ ] Review ongoing prebuild/storage use and disable event-only automation.

Suggested build order: rules and jam draft → starter → full rehearsal → hub links
and preflight guide → judging rehearsal → launch → archive.

## Verified references

- itch.io jam settings, submissions, scoring, and file locking:
  https://itch.io/docs/creators/game-jams
- GitHub template launch and publishing behavior:
  https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-from-a-template
- Codespaces prebuild behavior and plan restrictions:
  https://docs.github.com/en/codespaces/prebuilding-your-codespaces/about-github-codespaces-prebuilds
- Codespaces quotas, billing ownership, and storage:
  https://docs.github.com/en/billing/concepts/product-billing/github-codespaces

## Changes and undo

This planning step adds only docs/setup-plan.md. No accounts, services, event
pages, or repositories were created or published. Undo by removing this file.
