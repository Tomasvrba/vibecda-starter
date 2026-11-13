import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Spark Island in 3D, built only from simple shapes: no models or textures to download.
// Each screen "pixel" is this many real pixels wide. Try 1 for a smooth picture.
const PIXEL_SIZE = 3;

// ---------------------------------------------------------------------------
// The page around the canvas
// ---------------------------------------------------------------------------
document.title = 'Spark Island 3D · vibeCDA starter';
document.querySelector('.eyebrow')!.textContent = 'vibeCDA starter / Three.js 3D';
document.querySelector('.lead')!.textContent = 'The same floating island, in 3D. Look around, then make it yours.';
document.querySelector('#instructions')!.textContent = 'Drag to orbit. Scroll or pinch to zoom. Focus the canvas and use arrow keys to pan.';
document.querySelector('footer')!.innerHTML = 'Start changing <code>src/three-game.ts</code>. See <code>docs/threejs.md</code> for the walkthrough.';
document.querySelector('a[href="?demo=3d"]')?.setAttribute('aria-current', 'page');

const container = document.querySelector<HTMLDivElement>('#game')!;
container.setAttribute('aria-label', 'Three.js 3D scene. Drag to orbit, scroll or pinch to zoom, arrow keys to pan.');
const status = document.querySelector<HTMLParagraphElement>('#score')!;
const resetButton = document.querySelector<HTMLButtonElement>('#restart')!;
resetButton.textContent = 'Reset view';
const pixelButton = document.createElement('button');
const pauseButton = document.createElement('button');
pixelButton.type = pauseButton.type = 'button';
resetButton.before(pixelButton, pauseButton);

// ---------------------------------------------------------------------------
// Scene, camera, renderer, and controls
// ---------------------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0f2a');
const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 200);
camera.position.set(6, 4.3, 8);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.domElement.tabIndex = 0;
renderer.domElement.setAttribute('aria-label', 'Interactive 3D canvas');
container.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.listenToKeyEvents(renderer.domElement);
controls.update();
controls.saveState();
renderer.domElement.addEventListener('pointerdown', () => renderer.domElement.focus({ preventScroll: true }));
renderer.domElement.addEventListener('blur', () => controls.stopListenToKeyEvents());
renderer.domElement.addEventListener('focus', () => controls.listenToKeyEvents(renderer.domElement));

// Bloom makes every bright thing glow: windows, lamps, sparks, and stars.
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 144), 0.3, 0, 0.9));
composer.addPass(new OutputPass());

// ---------------------------------------------------------------------------
// Helpers for building with simple shapes
// ---------------------------------------------------------------------------
// A matte, faceted surface.
const solid = (color: string) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9 });
// A surface that gives off its own light. Bloom turns it into a glow.
const lit = (color: string, strength = 1) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: strength });

function add(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = mesh.receiveShadow = !(material instanceof THREE.MeshBasicMaterial);
  parent.add(mesh);
  return mesh;
}

function group(x = 0, y = 0, z = 0, parent: THREE.Object3D = scene) {
  const made = new THREE.Group();
  made.position.set(x, y, z);
  parent.add(made);
  return made;
}

// Push a round shape's edge in and out so it looks natural instead of perfect.
function wobble(geometry: THREE.BufferGeometry, amount: number, seed: number) {
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const angle = Math.atan2(position.getZ(i), position.getX(i));
    const scale = 1 + amount * (Math.sin(3 * angle + seed) + 0.7 * Math.sin(5 * angle + 2 * seed) + 0.5 * Math.sin(8 * angle + position.getY(i) * 3));
    position.setXYZ(i, position.getX(i) * scale, position.getY(i), position.getZ(i) * scale);
  }
  geometry.computeVertexNormals();
  return geometry;
}

// The same "random" number for the same input every time, so the island never changes.
const random = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

// ---------------------------------------------------------------------------
// Light
// ---------------------------------------------------------------------------
scene.add(new THREE.HemisphereLight('#8fa8ff', '#3a4488', 1.4));
const underglow = new THREE.DirectionalLight('#b9a0ff', 1.6);
underglow.position.set(0, -6, 0);
scene.add(underglow);
const moon = new THREE.DirectionalLight('#dfe6ff', 2.2);
moon.position.set(5, 8, 3);
moon.castShadow = true;
moon.shadow.mapSize.set(1024, 1024);
Object.assign(moon.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, far: 25 });
scene.add(moon);

// ---------------------------------------------------------------------------
// The island: grass on top, rock hanging underneath, and a lake
// ---------------------------------------------------------------------------
add(scene, wobble(new THREE.CylinderGeometry(3.3, 3.1, 0.5, 40), 0.035, 1), solid('#3f9b3a'), 0, -0.25, 0);
add(scene, wobble(new THREE.CylinderGeometry(3.05, 2.2, 0.7, 20), 0.05, 1), solid('#96623a'), 0, -0.8, 0);
add(scene, wobble(new THREE.ConeGeometry(2.3, 2.2, 12, 3), 0.09, 2), solid('#7a4a2a'), 0, -2.2, 0).rotation.x = Math.PI;
for (let i = 0; i < 7; i++) {
  const angle = i * 0.9 + 0.4;
  const far = 1.5 + random(i) * 0.9;
  add(scene, new THREE.ConeGeometry(0.3, 0.8 + random(i + 9), 5), solid('#7a4a2a'), Math.cos(angle) * far, -1.5, Math.sin(angle) * far).rotation.x = Math.PI;
}

const LAKE = { x: -1.35, z: 1.05 };
const water = new THREE.MeshStandardMaterial({ color: '#2f5fd0', emissive: '#14308f', roughness: 0.25 });
const lake = add(scene, wobble(new THREE.CylinderGeometry(1.15, 1.15, 0.04, 28), 0.04, 4), water, LAKE.x, 0.0, LAKE.z);
lake.scale.z = 0.72;
lake.castShadow = false;
add(scene, wobble(new THREE.CylinderGeometry(1.25, 1.25, 0.03, 28), 0.04, 4), solid('#d9c07a'), LAKE.x, -0.003, LAKE.z).scale.z = 0.74;
const ripples = [0, 1, 2].map(i => {
  const ring = add(scene, new THREE.RingGeometry(0.2, 0.23, 20), new THREE.MeshBasicMaterial({ color: '#8fc0ff', transparent: true }), LAKE.x + (i - 1) * 0.45, 0.03, LAKE.z + (i % 2) * 0.25 - 0.1);
  ring.rotation.x = -Math.PI / 2;
  return ring;
});

// A dock and two sailboats.
add(scene, new THREE.BoxGeometry(0.75, 0.05, 0.26), solid('#8a5a34'), LAKE.x + 1.25, 0.05, LAKE.z);
const boats = [0, 1].map(i => {
  const boat = group(0, 0.05, 0);
  add(boat, new THREE.BoxGeometry(0.3, 0.07, 0.12), solid('#8a5a34'));
  add(boat, new THREE.CylinderGeometry(0.01, 0.01, 0.3), solid('#56331f'), 0, 0.17, 0);
  add(boat, new THREE.ConeGeometry(0.13, 0.26, 3), solid('#e8ecff'), 0.05, 0.19, 0).scale.z = 0.15;
  boat.userData.offset = i * Math.PI;
  return boat;
});

// A dirt path from the cabin door.
for (let i = 0; i < 9; i++) {
  add(scene, new THREE.CylinderGeometry(0.2, 0.2, 0.02, 7), solid('#b08a56'), 0.15 + Math.sin(i * 0.7) * 0.25 + i * 0.12, 0.005, -0.55 + i * 0.27).castShadow = false;
}

// ---------------------------------------------------------------------------
// The cabin, with a beam of light up to a floating game controller
// ---------------------------------------------------------------------------
const cabin = group(0.1, 0, -1.3);
add(cabin, new THREE.BoxGeometry(1.6, 0.85, 1.1), solid('#b5442e'), 0, 0.42, 0);
const roof = add(cabin, new THREE.ConeGeometry(1.3, 0.75, 4), solid('#1c2f7a'), 0, 1.22, 0);
roof.rotation.y = Math.PI / 4;
roof.scale.z = 0.75;
add(cabin, new THREE.BoxGeometry(0.2, 0.5, 0.2), solid('#7a2c22'), 0.5, 1.2, -0.1);
add(cabin, new THREE.BoxGeometry(0.28, 0.5, 0.04), solid('#56331f'), 0, 0.25, 0.56);
const windowLight = lit('#ffe08a', 0.8);
for (const x of [-0.5, 0.5]) add(cabin, new THREE.BoxGeometry(0.3, 0.3, 0.04), windowLight, x, 0.5, 0.56);
for (const z of [-0.25, 0.25]) add(cabin, new THREE.BoxGeometry(0.04, 0.3, 0.25), windowLight, 0.81, 0.5, z);

const beam = add(cabin, new THREE.CylinderGeometry(0.12, 0.28, 1.8, 16, 1, true), new THREE.MeshBasicMaterial({
  color: '#3de0ff', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false,
}), 0, 2.4, 0);

// Try changing the controller's colors, or build your own floating object here.
// "controller" turns to face the camera; "pad" holds the pieces, lying flat inside it.
const controller = group(0, 3.5, 0, cabin);
const pad = group(0, 0, 0, controller);
pad.rotation.x = Math.PI / 2;
const teal = new THREE.MeshStandardMaterial({ color: '#1aa8c4', emissive: '#0b6f86', roughness: 0.4 });
add(pad, new THREE.BoxGeometry(1.0, 0.22, 0.42), teal);
for (const x of [-0.45, 0.45]) add(pad, new THREE.SphereGeometry(0.2, 10, 8), teal, x, 0, 0.12).scale.set(1, 0.65, 1.3);
add(pad, new THREE.BoxGeometry(0.24, 0.06, 0.08), lit('#e8ecff', 0.6), -0.3, 0.12, 0);
add(pad, new THREE.BoxGeometry(0.08, 0.06, 0.24), lit('#e8ecff', 0.6), -0.3, 0.12, 0);
for (const [x, z] of [[0.24, 0.05], [0.38, -0.05]]) add(pad, new THREE.CylinderGeometry(0.05, 0.05, 0.06, 10), lit('#f0a830', 1.2), x, 0.12, z);

// ---------------------------------------------------------------------------
// Trees, lamps, and a pumpkin
// ---------------------------------------------------------------------------
function pine(x: number, z: number, size: number) {
  const tree = group(x, 0, z);
  add(tree, new THREE.CylinderGeometry(0.05, 0.07, 0.3, 5), solid('#56331f'), 0, 0.15, 0);
  [0.42, 0.33, 0.22].forEach((radius, tier) => {
    add(tree, new THREE.ConeGeometry(radius, 0.5, 7), solid(tier === 1 ? '#2f9e4f' : '#1c6b3a'), 0, 0.5 + tier * 0.3, 0);
  });
  tree.scale.setScalar(size);
  tree.rotation.y = x * 7;
}
for (const [x, z] of [
  [-2.3, -0.9], [-1.7, -1.7], [-1.0, -2.3], [1.3, -2.4], [1.9, -1.8], [2.7, -0.6],
  [2.6, 1.0], [0.4, 2.6], [-2.8, 0.2], [-0.6, 0.1], [2.2, 1.9],
]) pine(x, z, 0.6 + random(x * z) * 0.4);

const lamps = [[-0.45, -0.55], [0.65, -0.55], [-0.1, 0.8], [1.75, 0.55]].map(([x, z]) => {
  add(scene, new THREE.CylinderGeometry(0.025, 0.035, 0.6, 6), solid('#060918'), x, 0.3, z);
  add(scene, new THREE.SphereGeometry(0.08, 8, 6), lit('#ffe08a', 1), x, 0.64, z).castShadow = false;
  const light = new THREE.PointLight('#f0a830', 1.2, 3);
  light.position.set(x, 0.7, z);
  scene.add(light);
  return light;
});

const pumpkin = add(scene, new THREE.SphereGeometry(0.16, 8, 6), new THREE.MeshStandardMaterial({ color: '#ff8c2a', emissive: '#ff8c2a', emissiveIntensity: 0.5, flatShading: true }), -1.0, 0.12, -0.6);
pumpkin.scale.y = 0.8;
add(scene, new THREE.CylinderGeometry(0.02, 0.03, 0.08, 5), solid('#2f9e4f'), -1.0, 0.27, -0.6);

// Bushes and stones scattered around the edge.
for (let i = 0; i < 14; i++) {
  const angle = i * 2.4;
  const far = 2.0 + random(i + 0.2) * 0.9;
  const bush = i % 3 > 0;
  add(scene, new THREE.IcosahedronGeometry(0.1 + random(i + 0.4) * 0.1, 0), solid(bush ? '#2f7d33' : '#a8b0d8'), Math.cos(angle) * far, bush ? 0.07 : 0.03, Math.sin(angle) * far);
}

// ---------------------------------------------------------------------------
// A wizard and a lizard out for a walk
// ---------------------------------------------------------------------------
const wizard = group();
add(wizard, new THREE.ConeGeometry(0.15, 0.36, 8), solid('#9b7bff'), 0, 0.18, 0);
add(wizard, new THREE.SphereGeometry(0.075, 8, 6), solid('#f2c79b'), 0, 0.38, 0);
add(wizard, new THREE.CylinderGeometry(0.14, 0.14, 0.02, 10), solid('#5b3fc4'), 0, 0.43, 0);
add(wizard, new THREE.ConeGeometry(0.09, 0.26, 8), solid('#5b3fc4'), 0, 0.56, 0);
add(wizard, new THREE.CylinderGeometry(0.012, 0.012, 0.5, 5), solid('#8a5a34'), 0.17, 0.25, 0);
add(wizard, new THREE.SphereGeometry(0.045, 8, 6), lit('#3de0ff', 1.5), 0.17, 0.53, 0).castShadow = false;

const lizard = group();
add(lizard, new THREE.BoxGeometry(0.1, 0.07, 0.26), solid('#5dff9a'), 0, 0.06, 0);
add(lizard, new THREE.BoxGeometry(0.09, 0.07, 0.1), solid('#5dff9a'), 0, 0.09, 0.17);
add(lizard, new THREE.ConeGeometry(0.035, 0.24, 5), solid('#2f9e4f'), 0, 0.05, -0.23).rotation.x = -Math.PI / 2;

// Walk in a circle. "lead" moves a walker further along the same circle.
function walk(walker: THREE.Group, time: number, lead: number) {
  const angle = time * 0.45 + lead;
  walker.position.set(1.35 + Math.cos(angle) * 0.75, Math.abs(Math.sin(time * 7 + lead)) * 0.03, 0.75 + Math.sin(angle) * 0.75);
  walker.rotation.y = -angle;
}

// ---------------------------------------------------------------------------
// Sparks, fireflies, clouds, and stars
// ---------------------------------------------------------------------------
const sparkLight = lit('#f0a830', 1.4);
const sparks = Array.from({ length: 8 }, (_, i) => {
  const angle = i / 8 * Math.PI * 2 + 0.3;
  const far = i % 2 ? 2.75 : 2.2;
  return add(scene, new THREE.OctahedronGeometry(0.13), sparkLight, Math.cos(angle) * far, 0.5, Math.sin(angle) * far);
});
for (const spark of sparks) spark.castShadow = false;

const FIREFLIES = 40;
const fireflies = new THREE.BufferGeometry();
fireflies.setAttribute('position', new THREE.BufferAttribute(new Float32Array(FIREFLIES * 3), 3));
scene.add(new THREE.Points(fireflies, new THREE.PointsMaterial({ color: '#5dff9a', size: 0.06, blending: THREE.AdditiveBlending, depthWrite: false })));

const cloudMaterial = solid('#dfe6ff');
const clouds = [[5.2, -0.9, 0.5], [4.6, -1.8, 2.4], [5.6, 0.6, 4.1], [4.4, -2.4, 5.3]].map(([far, height, angle]) => {
  const cloud = group(0, height, 0);
  for (let i = 0; i < 5; i++) {
    const puff = add(cloud, new THREE.IcosahedronGeometry(0.3 + random(far + i) * 0.25, 0), cloudMaterial, (i - 2) * 0.38, random(angle + i) * 0.2, random(i) * 0.3);
    puff.castShadow = false;
  }
  cloud.userData = { far, angle };
  return cloud;
});

const STARS = 1200;
const starPositions = new Float32Array(STARS * 3);
const starColors = new Float32Array(STARS * 3);
const starPalette = ['#e8ecff', '#e8ecff', '#e8ecff', '#3de0ff', '#f0a830'].map(color => new THREE.Color(color));
for (let i = 0; i < STARS; i++) {
  // A random direction, pushed far away so the stars surround the island.
  new THREE.Vector3(random(i) - 0.5, random(i + 0.5) - 0.5, random(i + 0.25) - 0.5).normalize().multiplyScalar(60 + random(i + 0.75) * 40).toArray(starPositions, i * 3);
  starPalette[i % starPalette.length].toArray(starColors, i * 3);
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
const starMaterial = new THREE.PointsMaterial({ vertexColors: true, sizeAttenuation: false, fog: false });
scene.add(new THREE.Points(starGeometry, starMaterial));

// ---------------------------------------------------------------------------
// Buttons and screen size
// ---------------------------------------------------------------------------
let animating = true;
let pixelated = PIXEL_SIZE > 1;

function resize() {
  const { width, height } = container.getBoundingClientRect();
  if (!width || !height) return;
  // A low pixel ratio draws fewer, bigger pixels: the chunky pixel-art look.
  // Small screens get smaller pixels so the picture stays readable.
  const ratio = pixelated ? 1 / Math.max(1, Math.round(PIXEL_SIZE * width / 800)) : Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(ratio);
  composer.setPixelRatio(ratio);
  renderer.setSize(width, height);
  composer.setSize(width, height);
  renderer.domElement.style.imageRendering = pixelated ? 'pixelated' : 'auto';
  starMaterial.size = pixelated ? 1.5 : 2.5 * ratio;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(container);

function updateStatus() {
  status.textContent = `3D demo · animation ${animating ? 'on' : 'off'}`;
  pauseButton.textContent = animating ? 'Pause animation' : 'Resume animation';
  pauseButton.setAttribute('aria-pressed', String(!animating));
  pixelButton.textContent = pixelated ? 'Smooth look' : 'Pixel look';
  controls.autoRotate = animating;
}
pauseButton.addEventListener('click', () => { animating = !animating; updateStatus(); });
pixelButton.addEventListener('click', () => { pixelated = !pixelated; resize(); updateStatus(); });
resetButton.addEventListener('click', () => { controls.reset(); animating = true; updateStatus(); });
updateStatus();

// ---------------------------------------------------------------------------
// Every frame: move things a little, then draw
// ---------------------------------------------------------------------------
let time = 0;
let previous = performance.now();
renderer.setAnimationLoop(now => {
  const delta = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  if (animating) time += delta;

  controller.position.y = 3.5 + Math.sin(time * 1.5) * 0.1;
  controller.lookAt(camera.position);
  pad.rotation.z = Math.sin(time * 1.1) * 0.25;
  beam.material.opacity = 0.12 + Math.sin(time * 3) * 0.04;
  walk(wizard, time, 0);
  walk(lizard, time, -0.55);
  sparks.forEach((spark, i) => {
    spark.position.y = 0.5 + Math.sin(time * 2 + i) * 0.1;
    spark.rotation.y = time * 2 + i;
  });
  boats.forEach(boat => {
    const angle = time * 0.3 + boat.userData.offset;
    boat.position.set(LAKE.x - 0.15 + Math.cos(angle) * 0.6, 0.05, LAKE.z + Math.sin(angle) * 0.38);
    boat.rotation.set(Math.sin(time * 2 + boat.userData.offset) * 0.08, -angle - Math.PI / 2, 0);
  });
  ripples.forEach((ring, i) => {
    const life = (time * 0.4 + i / 3) % 1;
    ring.scale.setScalar(0.4 + life * 1.6);
    ring.material.opacity = (1 - life) * 0.7;
  });
  lamps.forEach((light, i) => { light.intensity = 1.2 + Math.sin(time * 9 + i * 2) * 0.15; });
  clouds.forEach(cloud => {
    const angle = cloud.userData.angle + time * 0.04;
    cloud.position.x = Math.cos(angle) * cloud.userData.far;
    cloud.position.z = Math.sin(angle) * cloud.userData.far;
    cloud.rotation.y = -angle;
  });
  const fly = fireflies.getAttribute('position');
  for (let i = 0; i < FIREFLIES; i++) {
    const angle = random(i) * Math.PI * 2 + time * (0.1 + random(i + 0.3) * 0.2);
    const far = 0.6 + random(i + 0.6) * 2.2;
    fly.setXYZ(i, Math.cos(angle) * far, 0.3 + random(i + 0.9) * 0.9 + Math.sin(time * 1.3 + i) * 0.15, Math.sin(angle) * far);
  }
  fly.needsUpdate = true;

  controls.update();
  composer.render();
});
