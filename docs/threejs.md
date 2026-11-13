# Your first Three.js 3D scene

**Three.js is included in the default Codespace**, with TypeScript types and a
working example. There is no separate installation or GPU-cloud setup. The
starter includes both the Phaser 2D game and the Three.js 3D demo.

## Open the demo

1. [Create your own repository and Codespace](beginners.md#1-create-your-own-copy).
2. In its terminal, run `npm run dev`.
3. Open **Ports → 5173 → Open in Browser**.
4. Click **Three.js 3D demo** at the top of the game page. You should see a
   yellow cube spinning above a green island.
5. Drag to move the camera around the cube. Scroll or pinch to zoom. Click/tap
   the canvas to focus it, then use arrow keys to pan the camera.
6. Use **Pause rotation** to inspect the scene and **Reset view** to start over.
   Click **Phaser 2D game** to return to the original treasure hunt.

The 3D page has `?demo=3d` at the end of its address. Both examples are included
in the normal Vite build and game ZIP; you do not need a second server.

## Make your first change

1. Open **src → three-game.ts** in the editor. This is the complete 3D example.
2. Find `color: '#ffd477'` in the cube's material. Change it to `'#3de0ff'`.
3. Save. The preview should reload with a cyan cube.
4. Change `new THREE.BoxGeometry(1.2, 1.2, 1.2)` to
   `new THREE.BoxGeometry(1.2, 2, 1.2)` to make a taller box. Adjust
   `cube.position.y` if it overlaps the island.
5. Near the end, change `delta * 0.7` to `delta * 1.4` to make it spin faster.
6. Run `npm run build` in a second terminal to check for errors, then commit
   and push your work as described in the [beginner guide](beginners.md#4-save-a-version-on-github).

| Part of the example | What it does |
| --- | --- |
| `scene` | Holds the objects and background |
| `camera` | Chooses the viewpoint and perspective |
| `renderer` | Draws the scene into the browser canvas |
| `BoxGeometry` / `CylinderGeometry` | Define the shapes |
| `MeshStandardMaterial` | Defines the surface color and how light affects it |
| `Mesh` | Combines a shape and a material into a visible object |
| Hemisphere/directional lights | Make the shapes look three-dimensional |
| `OrbitControls` | Lets mouse, touch, and keyboard control the camera |
| `setAnimationLoop` | Updates the scene and renders each frame |

For an AI assistant, try:

> Start from src/three-game.ts and explain how it works. Help me turn it into a
> small 3D game with one playable mechanic. Keep Vite, TypeScript, keyboard and
> touch controls, relative asset paths, and npm run package for itch.io. Update
> the browser tests when changing behavior. Do not add a backend or runtime AI API.

Three.js handles rendering and scenes. You still create the game rules,
collisions, UI, and audio; it is not a full visual editor or physics engine.

## Make 3D the opening page of your submission

During development, the links let you try either example. To make your game
open directly in 3D, change the selection in **src/main.ts** to:

```ts
import './style.css';
import './three-game';
```

Then update **index.html** to your game's title, description, instructions, and
navigation. Remove the demo selector links if you no longer need them. Adjust
the browser tests to your final game.

Run `npm run package`, then [upload **artifacts/game.zip** to itch.io](beginners.md#8-upload-your-game-to-itchio).
Use the HTML/browser-playable setting and test the actual itch.io embed.
Do not expect judges to add `?demo=3d` themselves; make your finished game the
opening page before submitting.

## Does Codespaces support 3D graphics?

Yes. Codespaces runs Node, Vite, your editor, and AI tools. The game runs in the
browser on your laptop or phone and uses that device's graphics hardware through
**WebGL 2**. You do not need a GPU cloud machine or remote desktop. Open port 5173
in your ordinary browser to test graphics and audio.

Use a current browser with WebGL 2 and hardware acceleration available. Large
models, shadows, and effects can still run poorly on older laptops or phones;
test on the devices your players and judges will use. Headless browser tests can
use software rendering and are not a performance benchmark for a player's GPU.

## Models, textures, and performance

- Put assets in `public/` and record their licenses in `public/ASSETS.md`.
  The included example draws its own shapes and downloads no external assets.
  A `.glb` model can contain geometry and textures in one file. Blender is not
  installed in the Codespace; create/export models on your laptop or use
  appropriately licensed assets.
- Load a model with the included Three.js add-on:

  ```ts
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

  const loader = new GLTFLoader();
  loader.load(import.meta.env.BASE_URL + 'models/scene.glb', model => {
    scene.add(model.scene);
  });
  ```

  This example expects `public/models/scene.glb` and an existing `scene`.
  Avoid `/models/scene.glb`, which can break under itch.io or a subdirectory.
- Start with a few objects, simple lighting, small textures, and limited shadows.
  The demo already resizes the canvas and caps pixel ratio at 2 for larger screens.
- Sound normally needs a player's click/tap first. Include touch controls if you
  claim mobile support, and test keyboard focus inside the itch.io iframe.

## What about an existing Codespace or older copy of the starter?

A fresh copy includes everything above. An older team repository does not
receive template updates automatically. Commit/push your current work first,
then ask a mentor to bring over the updated files and lockfile without replacing
your game. Run `npm ci` afterward. Rebuild the container to use the latest
prepared image once its configuration has been updated. Back up any unpushed
work before rebuilding or changing repositories.

Reference: [Three.js installation and Vite guide](https://threejs.org/manual/#en/installation).
