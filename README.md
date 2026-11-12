# vibeCDA game starter

A small Phaser 3 + Vite + TypeScript game, with a prepared Codespaces environment
and a direct route to an itch.io submission. Use your own AI account; the game
itself needs no API key, backend, or paid service.

**Event:** [vibecda.com](https://vibecda.com) · November 13–15, 2026 · Pacific time.
Code freeze: Sunday noon. Awards: Sunday 6pm. The event site has the schedule,
venue updates, and registration. This starter is optional; native games are welcome.

## Start in Codespaces

On this repository, select **Use this template → Open in a codespace**.
Publish the workspace to **your team's new repository** using Source Control →
Publish Branch before doing substantial work. Invite teammates to that repository.
An unpublished Codespace is not a durable repository backup.

In the terminal:

```sh
npm run dev
```

Open **port 5173** in the Ports tab. Move with arrow keys, WASD, or by holding a
point on the game. Change `src/game.ts` to make it yours.

The prepared container includes Claude Code, Codex, Gemini CLI, Chromium with
Playwright, ffmpeg, ImageMagick, zip, and ripgrep. Pick one AI tool and log into
your own account; see [participant instructions](docs/participants.md).

## Run locally

Install Node.js 22.12 or newer (Node 22 LTS recommended), then:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. You can also use VS Code's **Reopen in Container**
with Docker installed. The Node-only route doesn't install the optional AI CLIs
or asset utilities on your computer.

## Submit

```sh
npm run package
```

Upload **artifacts/game.zip** to an itch.io project. Choose **HTML** for the
project and mark the ZIP as playable in the browser, then test the public page.
Finally, use **Submit your project** on the event's jam page. Uploading a build
alone does not enter it in the jam. Record the submitted Git commit and credits.

The source and asset credits are yours to maintain; add third-party attribution
to `public/ASSETS.md`. Native-engine projects submit their own platform builds.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Develop with live reload on port 5173 |
| `npm run build` | Type-check and create `dist/` |
| `npm run package` | Build and create the itch.io ZIP |
| `npm run doctor` | Check installed development tools |
| `npm test` | Check scoring, packaging, and event configuration |
| `npm run test:browser` | Exercise the production game in Chromium |
| `npm run hub:build` | Generate the participant event hub in `dist-hub/` |
| `npm run event:check` | Check that event settings and destinations are ready |

For browser checks outside the prepared container, first run
`npx playwright install --with-deps chromium`. Commit and push milestones;
stopping a Codespace saves compute usage, but its storage can still count.

## Organizers

- [Live setup status and remaining human steps](organizer/STATUS.md)
- [Platform configuration and launch runbook](organizer/RUNBOOK.md)
- [itch.io copy and settings](organizer/itch-setup.md)
- [Draft pre-arrival message](organizer/pre-arrival.md)
- [Event configuration](organizer/event.json) and [archive](organizer/archive/README.md)

The event hub reads from one configuration file. Missing links remain visibly
unavailable; the draft hub is marked noindex until the event is ready. Public
platform settings must agree with the event site's rules.
