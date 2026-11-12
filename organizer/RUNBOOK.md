# Organizer runbook

## GitHub and environment publication

1. Publish this project as Tomasvrba/vibecda-starter, a public template repository.
   Enable Discussions as a persistent community/help space if no existing chat
   is supplied. Use GitHub Issues for environment bugs.
2. Run the manual **Publish development environment** workflow. Its image name is
   ghcr.io/tomasvrba/vibecda-dev with an immutable source-commit tag. The first
   package publication may be private; make the package public before use.
3. Run `node scripts/use-prebuilt.mjs ghcr.io/tomasvrba/vibecda-dev:COMMIT` and commit
   the updated devcontainer. Keep the Dockerfile for future rebuilds. Image changes
   require a new build/tag; don't silently update tools during the event.
4. Check the Codespaces launch flow from a participant account with no write
   access to the source template. Confirm image access, startup time, own-account
   AI login, preview, and publishing to a team repo. No organizer-paid usage is
   enabled by this project.
5. Optional Codespaces prebuilds are separate from the tool image. For personal
   repositories they use the owner's allowances/billing; copied repositories
   don't inherit the original's repository settings. Don't enable billing or
   paid services just to get prebuilds without checking the budget with Tom.

Both devcontainer configurations add the official SSH server feature and set the
AI CLI PATH for login shells. Existing Codespaces must pull and rebuild. For
external editors and T3 Code, follow docs/editors.md and rehearse the full route
from a participant laptop; local SSH/container testing alone is not that pilot.
Keep docs/tools.md aligned with image versions. Browser art/audio resources need
no container installation; native desktop engines remain participant-managed.

## Event settings and hub

Edit organizer/event.json with the final URLs and settings. Dates, tracks, team
size, and eligibility come from vibecda.com; Tom explicitly changed scoring to
equal weight. Update the site's displayed weights before inviting participants.
The confirmed 5:30pm judging end is separate from the noon code freeze.

The `jam` link can point to a track-selector on the event site when using two
jams. Supply direct track jam links there. `results` can initially point to the
same gallery/track-selector, and then to final results after awards.

```sh
npm run hub:build
npm run event:check
```

`hub:build` makes a standalone static dist-hub/index.html; it can be served under
vibecda.com/build/ without a backend or external scripts. While status is draft,
the page says so and has noindex metadata. Missing destinations have no clickable
placeholder URLs. The hub is an addition to the existing website, not a replacement.
Set confirmed=true and status=ready only after checking all event data and links.
`event:check` intentionally fails until launch destinations are complete.

## Judging

Preferred equal-weight route: separate ranked track jams with their five criteria
and judges-only voting. Preserve the published tie-break policy. Do not rank GTA
Cda. Keep audience choice separate. Assign conflict-free judges and aim for the
same number of complete ratings per entry; establish abstentions ahead of time.

For a spreadsheet/manual audit, copy organizer/templates/*.csv into
organizer/private/. Record projects, judge assignments, and scores, one score per
assigned judge, project, and criterion. Use the criterion IDs in event.json.

```sh
npm run judging -- organizer/private/projects.csv organizer/private/assignments.csv organizer/private/scores.csv
```

The output is organizer/private/results.csv, ignored by Git. It refuses missing
ratings, duplicates, unassigned judges, and invalid scores. It averages each
criterion across the assigned judges, then applies the configured weights (now
20% each), producing a score out of 100. The score is equivalent to the mean
itch.io stars multiplied by 20 when all five ratings are present.

Ties first use the per-track criteria in tieBreakers. Remaining ties are marked
tie_pending and share a provisional rank. Ask judges for their majority decision;
do not publish those provisional ranks as a resolved result. The tool doesn't
check judge identities, conflicts, eligibility, or audience ballots.

## Human checks before launch

- Complete itch.io login and any security verification, confirm the owning account.
- Create the two confirmed track jams and add real judge accounts.
- Tom forwards site-change-request.md to the existing site's webmaster; Tom does
  not manage the site directly.
- Match the public rules to Tom's equal-weight judging instruction.
- Agree on audience-choice ballot and any unresolved rules (existing code, ties,
  late submissions). Do not invent eligibility or prizes.
- Rehearse a full participant upload/entry and a judge rating.
- Draft messages are ready locally; Tom must explicitly authorize sending them.

## After awards / undo

Archive public project links, final ranks, confirmed settings, and a retro under
organizer/archive/EVENT-ID/. Keep raw scores/contacts private. Seek permission
before copying participant assets/photos into a public archive.

Stop event-only workflows/prebuilds and remove unneeded codespaces only after work
is exported. To undo this setup, archive the new starter repository and remove
the added hub links/page; restore any website edits from their backup. Remove
only the event image tags/build caches created for this setup if storage matters.
Don't remove participant repositories, personal login caches, or other images.
