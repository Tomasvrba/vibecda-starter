# Installed tools and game resources

The prepared Codespace is a Linux environment for **Phaser 2D or Three.js 3D browser games**.
Your game renders on your laptop's browser; the cloud workspace runs the code,
build, AI tools, and tests. AI tools require your own eligible account and login.

## What is included

The base tools below were checked on November 12, 2026; Three.js was added on
November 13. Base system versions can change when rebuilding the Dockerfile.

| Area | Included |
| --- | --- |
| Runtime | Node.js 22.16.0, npm 10.9.2, Python 3.11.2 |
| Game and web build | Phaser 3.90.0, Three.js 0.187.0 with matching TypeScript types, Vite 7.3.8, TypeScript 5.9.3 |
| AI terminals | Claude Code 2.1.322, Codex 0.167.2, Gemini CLI 0.68.0 |
| Browser testing | Playwright 1.65.0 and its Chromium browser |
| Asset processing | ffmpeg, ImageMagick (`convert`) |
| General development | Git, ripgrep, SSH client, gcc/g++, make, zip/unzip |
| Submission | `npm run package` builds `artifacts/game.zip` for itch.io |
| External editor access | Official SSH server devcontainer feature; installed during container creation |

The game/build/test dependencies are cached in the image and restored when the
workspace is created. The SSH feature adds a small separate setup step. The
container also configures login shells so external tools can find the AI CLIs.
Existing Codespaces need **Codespaces: Rebuild Container** after pulling the new
configuration. Commit and push work before rebuilding.

No VS Code extensions are preselected. There is no Godot, Unity, Unreal, Tiled,
Blender, GUI desktop, GPU, or T3 server preinstalled. Python is available as a
utility; this is not a prepared Python game framework environment.

Run `npm run doctor` for the basic tool check. For development and submission,
use `npm run dev`, `npm run build`, and `npm run package`.

## Useful additions for this event

From [Awesome Hackathon's game-development list](https://github.com/HappyHackingSpace/Awesome-Hackathon#game-development),
these complement the starter without a large install:

| Need | Suggested tool | How to use it here |
| --- | --- | --- |
| Sprites and animation | [Piskel](https://www.piskelapp.com/) | Draw in your browser; export PNGs or sprite sheets into `public/` |
| Music | [BeepBox](https://www.beepbox.co/) | Compose in your browser; export audio into `public/` |
| Small generated sound effects | [ZzFX](https://github.com/KilledByAPixel/ZzFX) | Optional per-project library; trigger sounds after a click/tap to satisfy browser audio rules |
| Tile maps | [Tiled](https://www.mapeditor.org/) | Install on your laptop, export JSON and tileset images, then load them through Phaser's tilemap API |
| A native 2D/3D engine | [Godot](https://godotengine.org/) | Install the editor and export templates locally; use a separate engine project and test its target build before the event |

These are recommendations and links, not additional preinstalled packages.
Piskel and BeepBox work in participants' browsers. Tiled needs a local desktop;
copying its binary into this headless Codespace would not provide its editor UI.
Teams choosing Unity, Unreal, Blender, GIMP, or Audacity should likewise prepare
their laptops and any required licenses before arrival. A GPU cloud desktop would
be a separate setup with separate costs.

To bring assets into the Codespace, drag exported files into `public/` in VS Code
or use its file upload command. Load them with paths that work in the packaged
game; follow the examples in the starter and avoid paths starting with `/`.
Record the creator, source URL, license, and any required attribution in
`public/ASSETS.md`. Commit the assets with the game.

Use the included Phaser or Three.js example as a starting point. Native engine
projects need their own build/export workflow; the starter's ZIP command
packages the Vite web build.

For browser-based 3D, [Three.js and a working demo are included by default](threejs.md). They use the
same Vite and ZIP commands. Rendering uses the player's browser/GPU, so a GPU
Codespace is not needed. Native desktop engines still need their own setup.

See [editor and T3 Code connections](editors.md) and the
[participant guide](participants.md).
