# vibeCDA game starter

A Phaser 2D game and Three.js 3D example, using Vite and TypeScript, with a prepared
Codespaces environment and a direct route to an itch.io submission. Use your own AI account; the game
itself needs no API key, backend, or paid service.

**Event:** [vibecda.com](https://vibecda.com) · November 13–15, 2026 · Pacific time.
Code freeze: Sunday noon. Awards: Sunday 6pm. The event site has the schedule,
venue updates, and registration. This starter is optional; native games are welcome.

[Participant guide](https://vibecda.github.io/vibecda-starter/) ·
[Freeplay jam](https://itch.io/jam/vibecda-2026-freeplay) ·
[Wizards and Lizards jam](https://itch.io/jam/vibecda-2026-wizards-and-lizards).
Judging closes Sunday at 5:30pm Pacific. Each track uses its own five criteria,
weighted equally at 20% each.

**First time using GitHub or Codespaces? [Start with the step-by-step beginner
guide](docs/beginners.md).** It covers making your own copy, running the game,
saving work, connecting VS Code/T3 Code, downloading files, and submitting to itch.io.

## Start in Codespaces

On this repository, select **Use this template → Create a new repository**.
Create it under your own account, then choose **Code → Codespaces → Create
codespace on main** in that new repository. Invite teammates to your team's
repository. Follow the [beginner walkthrough](docs/beginners.md#1-create-your-own-copy)
if you already opened a Codespace directly from the template.

In the terminal:

```sh
npm run dev
```

Open **port 5173** in the Ports tab. Move with arrow keys, WASD, or by holding a
point on the game. Change `src/game.ts` to make it yours.

Click **Three.js 3D demo** at the top of the page to try the included 3D scene.
Drag to orbit, scroll/pinch to zoom, and use Pause/Reset. Edit `src/three-game.ts`
to make it yours; follow the [3D walkthrough](docs/threejs.md) for your first changes.

The prepared container includes Claude Code, Codex, Gemini CLI, Chromium with
Playwright, ffmpeg, ImageMagick, zip, and ripgrep. Pick one AI tool and log into
your own account; see [participant instructions](docs/participants.md).

See [installed tools and game resources](docs/tools.md) and
[connect VS Code, SSH editors, or T3 Code](docs/editors.md).

**The default Codespace includes Phaser, Three.js, and Three.js TypeScript types.**
Both examples use the same Vite preview and itch.io ZIP workflow. Only the
selected example's engine loads in the browser.

## Run locally

Install Node.js 22.12 or newer (Node 22 LTS recommended), then:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. You can also use VS Code's **Reopen in Container**
with Docker installed. The default image targets Codespaces/Linux x64. On Apple
Silicon, select the **local build** configuration to build for your machine.
The Node-only route doesn't install the optional AI CLIs or asset utilities on
your computer.

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
| `npm test` | Check packaging and public event configuration |
| `npm run test:browser` | Exercise the production game in Chromium |
| `npm run hub:build` | Generate the participant event hub in `dist-hub/` |
| `npm run event:check` | Check that event settings and destinations are ready |

For browser checks outside the prepared container, first run
`npx playwright install --with-deps chromium`. Commit and push milestones;
stopping a Codespace saves compute usage, but its storage can still count.
