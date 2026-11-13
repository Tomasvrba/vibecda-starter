import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// A small, asset-free example: scene + camera + renderer + objects + controls.
document.title = 'Three.js 3D · vibeCDA starter';
document.querySelector('h1')!.textContent = 'Your first 3D scene';
document.querySelector('header p')!.textContent = 'A little island, a spinning cube, and a camera you control. Make it yours.';
document.querySelector('#instructions')!.textContent = 'Drag to orbit. Scroll or pinch to zoom. Focus the canvas and use arrow keys to pan. Pause the cube to inspect it.';
document.querySelector('footer')!.innerHTML = 'Start changing <code>src/three-game.ts</code>. See <code>docs/threejs.md</code> for the walkthrough.';
document.querySelector('a[href="?demo=3d"]')?.setAttribute('aria-current', 'page');

const container = document.querySelector<HTMLDivElement>('#game')!;
container.setAttribute('aria-label', 'Three.js 3D scene. Drag to orbit, scroll or pinch to zoom, arrow keys to pan.');
const status = document.querySelector<HTMLParagraphElement>('#score')!;
const resetButton = document.querySelector<HTMLButtonElement>('#restart')!;
resetButton.textContent = 'Reset view';
const pauseButton = document.createElement('button');
pauseButton.type = 'button';
resetButton.before(pauseButton);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#173d35');
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(5, 4, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.tabIndex = 0;
renderer.domElement.setAttribute('aria-label', 'Interactive 3D canvas');
container.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.listenToKeyEvents(renderer.domElement);
controls.update();
controls.saveState();
renderer.domElement.addEventListener('pointerdown', () => renderer.domElement.focus({ preventScroll: true }));
renderer.domElement.addEventListener('blur', () => controls.stopListenToKeyEvents());
renderer.domElement.addEventListener('focus', () => controls.listenToKeyEvents(renderer.domElement));

// Lighting gives the cube readable depth without textures or a model download.
scene.add(new THREE.HemisphereLight('#d1f5ff', '#284c38', 2.5));
const sunlight = new THREE.DirectionalLight('#fff0cc', 3);
sunlight.position.set(4, 6, 3);
scene.add(sunlight);

const island = new THREE.Mesh(
  new THREE.CylinderGeometry(2.7, 3, 0.4, 48),
  new THREE.MeshStandardMaterial({ color: '#4d7966', roughness: 0.9 }),
);
island.position.y = -0.3;
scene.add(island);

// Try changing the color, dimensions, or material here first.
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
  new THREE.MeshStandardMaterial({ color: '#ffd477', roughness: 0.35, metalness: 0.1 }),
);
cube.position.y = 0.8;
scene.add(cube);

let spinning = true;
function updateStatus() {
  status.textContent = `3D demo · auto-rotate ${spinning ? 'on' : 'off'}`;
  pauseButton.textContent = spinning ? 'Pause rotation' : 'Resume rotation';
  pauseButton.setAttribute('aria-pressed', String(!spinning));
}
pauseButton.addEventListener('click', () => { spinning = !spinning; updateStatus(); });
resetButton.addEventListener('click', () => {
  controls.reset();
  cube.rotation.set(0, 0, 0);
  spinning = true;
  updateStatus();
});
updateStatus();

// Keep the canvas sharp and the camera proportions correct when an embed resizes.
const observer = new ResizeObserver(() => {
  const { width, height } = container.getBoundingClientRect();
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
observer.observe(container);

let previous = performance.now();
renderer.setAnimationLoop(now => {
  const delta = Math.min((now - previous) / 1000, 0.05);
  previous = now;
  if (spinning) cube.rotation.y += delta * 0.7;
  controls.update();
  renderer.render(scene, camera);
});
