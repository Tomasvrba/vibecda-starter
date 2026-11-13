# Participant guide

New to this? Follow [the step-by-step beginner guide](beginners.md) for clicking
through setup, saving work, desktop/T3 connections, local downloads, and itch.io.
This page is the shorter reference, including AI login details.

## Before arriving

1. Register at [vibecda.com](https://vibecda.com), create GitHub and itch.io
   accounts, and choose your development environment.
2. Create your own repository with **Use this template → Create a new repository**,
   then open that repository in Codespaces, or install Node 22.12+ locally and run
   `npm ci`. Native Godot, Unity, Unreal, or other engine users should install
   and test their own editor and export tools before arrival.
3. Invite collaborators to your team repository and run `npm run dev`.
4. Open the game, change something small, and verify your AI login. Check remaining
   GitHub Codespaces and AI allowances; the event doesn't supply subscriptions.

Use your preferred editor: [browser, desktop VS Code, SSH editors, and T3 Code
connection instructions](editors.md). See [installed tools and game resources](tools.md)
for graphics, audio, maps, and alternatives to Phaser.

## AI login in the prepared environment

Pick whichever tool you already use. You do not need to log into all three.
Never put credentials in the repository or browser game. A subscription login
and an API key are separate billing paths.

**Claude Code:** run `claude`, choose your subscription account, and follow the
login link. If the browser doesn't open automatically, copy the URL to your
browser. If it returns a login code, paste it into the CLI when prompted. See
[Claude authentication](https://code.claude.com/docs/en/authentication).

**Codex:** run `codex login --device-auth`, open the displayed link in your own
browser, and enter the one-time code yourself. You may need to enable device-code
login in your ChatGPT security settings or ask your workspace admin. Then run
`codex` from the project directory. See [official OpenAI authentication
instructions](https://developers.openai.com/codex/auth).

**Gemini CLI:** run `gemini` and select Sign in with Google. Remote browser
callbacks can need additional configuration; test this before the event. If your
Google account can't complete the remote flow, use the CLI locally or an
account-specific API key stored in Codespaces secrets. API-key usage follows its
own billing/limits. See [Gemini authentication](https://geminicli.com/docs/get-started/authentication/).

No organizer login or shared credentials are included. Login success and actual
model access must be tested with your account; the build only verifies tools run.

## Build your game

- `src/game.ts`: the game scene and mechanics.
- `src/three-game.ts`: working Three.js 3D example; click **Three.js 3D demo**
  above the game and follow [the 3D walkthrough](threejs.md).
- `src/main.ts`: chooses the demo; `src/phaser-game.ts`: Phaser configuration.
- `src/style.css` and `index.html`: the page surrounding your game.
- `public/`: images, sounds, and other files copied into the build. Use
  `import.meta.env.BASE_URL` for assets loaded by code when needed; avoid root-only
  paths in production. Record credits in `public/ASSETS.md`.
- `AGENTS.md`: installed tools and instructions for your coding assistant.

Use `npm run build` periodically so errors don't collect before the deadline.
Save, commit, and push useful milestones. Each teammate can have their own
Codespace against the same team repository; coordinate branches and merges.

## Publish a browser game to itch.io

Choose your track: [Freeplay](https://itch.io/jam/vibecda-2026-freeplay) or
[Wizards and Lizards](https://itch.io/jam/vibecda-2026-wizards-and-lizards).
Submit by Sunday November 15, 2026 at noon Pacific. GTA Cda is unjudged.

1. Run `npm run package`. Download `artifacts/game.zip` from the editor.
2. Create a project in your itch.io dashboard. Set its type to HTML, add the ZIP,
   and mark the uploaded file as played in the browser.
3. Start with a 960 × 720 embed or enable fullscreen/resizing. The game's canvas
   scales to the available width. Test the page, including controls on a phone
   if you claim mobile support.
4. Add a title, cover image/screenshot, controls, credits, team members, source
   link or commit where requested, and AI-use disclosure.
5. Make the project available to judges/visitors. Test without creator privileges.
6. Open the event's jam link and select **Submit your project**. Complete every
   required field and verify your entry appears in the submissions list.

The ZIP contains index.html at its root, not inside a dist folder. The temporary
Codespaces preview isn't your submission. Native games use platform builds and
must state supported systems and controls; include a video for access problems.

## When something goes wrong

- **No preview:** run `npm run dev`, confirm port 5173 in Ports, and open its URL.
  The server binds to 0.0.0.0. Keep the port private for development.
- **Build fails:** run `npm run build` and fix the first reported error. Avoid
  asking an agent to reinstall the entire toolchain.
- **AI allowance exhausted:** keep editing manually, switch to your own other
  eligible account/tool, or ask a mentor. There is no shared organizer key.
- **Codespaces allowance exhausted:** export/push work if possible, clone your
  repository locally, and run `npm ci`. Never delete the Codespace before saving
  its work. See [billing and recovery](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces).
- **itch.io blank screen:** inspect the production build and confirm index.html
  is at the ZIP root; confirm HTML/browser-playable upload settings and asset paths.
- **Late entry:** contact the event host. A late upload does not automatically
  create a jam entry, and any deadline exception is the host's decision.

After the event, retain the repository and submitted release, then stop or delete
unneeded Codespaces only after confirming your work is pushed/exported. Don't
share account credentials or a logged-in workspace with other participants.
