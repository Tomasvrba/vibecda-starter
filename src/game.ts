import Phaser from 'phaser';

// The game is drawn small and scaled up, so every pixel stays chunky.
export const WIDTH = 400;
export const HEIGHT = 225;

const SPEED = 70; // pixels per second
const FONT = '"Press Start 2P", monospace';
const START = { x: 200, y: 104 };
const SPARKS = [
  [246, 104], [300, 92], [326, 120], [286, 150],
  [212, 162], [156, 140], [70, 116], [128, 96],
] as const;
const TREES = [
  [92, 94], [112, 86], [150, 78], [254, 76], [272, 84],
  [318, 104], [322, 144], [244, 170], [58, 130], [186, 152],
] as const;
const LAMPS = [[184, 100], [216, 100], [176, 134], [294, 132]] as const;
const NOTES = [523, 587, 659, 784, 880, 1047, 1175, 1319];

// The vibeCDA colors, as numbers for Phaser tints.
const CYAN = 0x3de0ff, GOLD = 0xf0a830, GREEN = 0x5dff9a, PURPLE = 0x9b7bff, ORANGE = 0xff8c2a, WHITE = 0xe8ecff;

// ---------------------------------------------------------------------------
// Pixel art, painted with letters. Each letter is a color; a dot is see-through.
// Change a letter to change a pixel.
// ---------------------------------------------------------------------------
const PALETTE: Record<string, string> = {
  k: '#060918', w: '#e8ecff', a: '#a8b0d8', c: '#3de0ff', t: '#1aa8c4',
  g: '#f0a830', y: '#ffe08a', o: '#ff8c2a', p: '#9b7bff', v: '#5b3fc4',
  l: '#5dff9a', e: '#2f9e4f', f: '#1c6b3a', h: '#0f4a2a',
  s: '#f2c79b', m: '#8a5a34', u: '#56331f',
};

const WIZARD = [
  '....kk......',
  '...kpvk..c..',
  '...kpvk.cwc.',
  '..kppvvk.c..',
  '..kgggyk.m..',
  '.kppppvvkm..',
  '..kskskk.m..',
  '..kwwwwksm..',
  '.kppwwpvkm..',
  '.kpppgpvkm..',
  '.kppppvvkm..',
  '.kpppppvkm..',
  '.kkkkkkkkm..',
  '..uu..uu....',
];
const LIZARD = [
  '......lll.',
  'e.llllllkl',
  '.elllllll.',
  '..e.e..e..',
];
const SPRITES: Record<string, string[]> = {
  wizard1: WIZARD,
  wizard2: [...WIZARD.slice(0, -1), '...uuuu.....'],
  lizard1: LIZARD,
  lizard2: [...LIZARD.slice(0, -1), '...e..e.e.'],
  pine: [
    '......h......',
    '.....hfh.....',
    '....hffeh....',
    '...hfffeeh...',
    '....hffeh....',
    '...hfffeeh...',
    '..hffffeeeh..',
    '...hfffeeh...',
    '..hffffeeeh..',
    '.hfffffeeeeh.',
    '..hffffeeeh..',
    '.hfffffeeeeh.',
    'hffffffeeeeeh',
    '.hhhhhuhhhhh.',
    '......u......',
    '......u......',
  ],
  lamp: [
    '.kkk.',
    'kyyyk',
    'kywyk',
    'kyyyk',
    '.kkk.',
    '..k..',
    '..k..',
    '..k..',
    '..k..',
    '..k..',
    '.kkk.',
  ],
  controller: [
    '..kkkkkkkkkkkkkkkk..',
    '.kcccccccccccccccck.',
    'ktttwttttttttttgtttk',
    'kttwwwttttttttgtgttk',
    'ktttwtttwtwttttgtttk',
    'kttttttttttttttttttk',
    'ktttttkkkkkkkktttttk',
    '.kttttk......kttttk.',
    '..kkkk........kkkk..',
  ],
  boat: [
    '....w....',
    '....ww...',
    '....www..',
    '....wwww.',
    '....k....',
    'mmmmmmmmm',
    '.muuuuum.',
  ],
  cloud: [
    '........wwww..........',
    '......wwwwwwww..www...',
    '...wwwwwwwwwwwwwwwww..',
    '.wwwwwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwww',
    '.aawwwwwaaawwwwwwaaaa.',
    '...aaaaa...aaaaaa.....',
  ],
  pumpkin: [
    '...e...',
    '.ooooo.',
    'oyoooyo',
    'ooooooo',
    'oyyyyyo',
    '.ooooo.',
  ],
  spark1: [
    '...y...',
    '...y...',
    '..ygy..',
    'yygwgyy',
    '..ygy..',
    '...y...',
    '...y...',
  ],
  spark2: [
    '.......',
    '...y...',
    '..ygy..',
    '.ygwgy.',
    '..ygy..',
    '...y...',
    '.......',
  ],
  twinkle: [
    '..w..',
    '..w..',
    'wwwww',
    '..w..',
    '..w..',
  ],
  pixel: ['w'],
};

// ---------------------------------------------------------------------------
// The world: a floating island with a lake, a cabin, and a dock.
// ---------------------------------------------------------------------------
const ISLAND = { x: 200, y: 118, rx: 164, ry: 64, seed: 1 };
const LAKE = { x: 118, y: 140, rx: 46, ry: 20, seed: 4 };
const CABIN = { x: 200, y: 92 };
const DOCK = { left: 150, right: 173, top: 136, bottom: 143 };
const PATHS = [
  [[200, 94], [200, 118]], [[200, 118], [250, 132]], [[250, 132], [302, 124]], [[200, 118], [172, 139]],
];

// A wobbly ellipse looks more natural than a perfect one.
function inBlob(blob: typeof ISLAND, x: number, y: number, grow = 0) {
  const dx = (x - blob.x) / (blob.rx + grow);
  const dy = (y - blob.y) / (blob.ry + grow);
  const angle = Math.atan2(dy, dx);
  const wobble = 1 + 0.05 * Math.sin(3 * angle + blob.seed) + 0.035 * Math.sin(5 * angle + 2 * blob.seed) + 0.02 * Math.sin(9 * angle);
  return Math.hypot(dx, dy) < wobble;
}

const onDock = (x: number, y: number) => x > DOCK.left && x < DOCK.right && y > DOCK.top - 1 && y < DOCK.bottom + 1;

// The wizard can walk on grass and the dock, but not on water or through the cabin.
function canWalk(x: number, y: number) {
  if (onDock(x, y)) return true;
  const insideCabin = Math.abs(x - CABIN.x) < 25 && y > CABIN.y - 14 && y < CABIN.y + 3;
  return inBlob(ISLAND, x, y, -7) && !inBlob(LAKE, x, y, 3) && !insideCabin;
}

// The same "random" number for the same pixel every time, so the art never changes.
function noise(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function distanceToPath(x: number, y: number) {
  return Math.min(...PATHS.map(([[ax, ay], [bx, by]]) => {
    const t = Phaser.Math.Clamp(((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2), 0, 1);
    return Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay));
  }));
}

function paintTextures(scene: Phaser.Scene) {
  if (scene.textures.exists('island')) return; // Already painted before a restart.

  // The letter sprites.
  for (const [key, rows] of Object.entries(SPRITES)) {
    const texture = scene.textures.createCanvas(key, rows[0].length, rows.length)!;
    rows.forEach((row, y) => [...row].forEach((letter, x) => {
      if (!PALETTE[letter]) return;
      texture.context.fillStyle = PALETTE[letter];
      texture.context.fillRect(x, y, 1, 1);
    }));
    texture.refresh();
  }

  // The island: grass on top, a lake, a dirt path, and rock hanging underneath.
  const island = scene.textures.createCanvas('island', WIDTH, HEIGHT)!;
  const dot = (x: number, y: number, color: string) => {
    island.context.fillStyle = color;
    island.context.fillRect(x, y, 1, 1);
  };
  for (let x = 0; x < WIDTH; x++) {
    let bottom = -1;
    for (let y = 0; y < HEIGHT; y++) {
      if (!inBlob(ISLAND, x, y)) continue;
      bottom = y;
      const grain = noise(x, y);
      let color = grain > 0.97 ? '#5cb84a' : grain < 0.04 ? '#2f7d33' : noise(x >> 3, y >> 2) > 0.78 ? '#45a53f' : '#3f9b3a';
      if (!inBlob(ISLAND, x, y - 2)) color = '#7ad15c';
      if (distanceToPath(x, y) < 3.5 + grain * 2) color = grain > 0.8 ? '#8f6c40' : '#b08a56';
      if (inBlob(LAKE, x, y, 2)) color = '#d9c07a';
      if (inBlob(LAKE, x, y)) color = !inBlob(LAKE, x, y - 3) ? '#1c3f9e' : noise(x >> 2, y >> 1) < 0.3 ? '#2450b8' : '#2f5fd0';
      dot(x, y, color);
    }
    if (bottom < 0) continue;
    const middle = 1 - ((x - ISLAND.x) / ISLAND.rx) ** 2;
    const depth = Math.round(5 + 20 * middle + 8 * noise(Math.floor(x / 3), 7));
    for (let d = 1; d <= depth; d++) {
      const grain = noise(x >> 1, d >> 1);
      dot(x, bottom + d, d < 3 ? '#96623a' : d > depth * 0.7 || grain < 0.2 ? '#4f2e1c' : '#7a4a2a');
    }
  }
  for (let x = DOCK.left; x < DOCK.right; x++) {
    for (let y = DOCK.top; y < DOCK.bottom; y++) dot(x, y, x % 4 === 0 || y === DOCK.bottom - 1 ? '#56331f' : '#8a5a34');
  }
  island.refresh();

  // The cabin, built from rectangles.
  const cabin = scene.textures.createCanvas('cabin', 46, 40)!;
  const rect = (color: string, x: number, y: number, w: number, h: number) => {
    cabin.context.fillStyle = color;
    cabin.context.fillRect(x, y, w, h);
  };
  rect('#7a2c22', 33, 1, 5, 10);
  for (let row = 0; row < 14; row++) rect(row % 3 === 2 ? '#2f5fd0' : '#1c2f7a', 14 - row, 4 + row, 18 + row * 2, 1);
  rect('#060918', 1, 18, 44, 1);
  rect('#b5442e', 3, 19, 40, 21);
  for (let y = 21; y < 40; y += 3) rect('#7a2c22', 3, y, 40, 1);
  for (const x of [7, 30]) {
    rect('#060918', x, 23, 9, 9);
    rect('#ffe08a', x + 1, 24, 7, 7);
    rect('#f0a830', x + 4, 24, 1, 7);
    rect('#f0a830', x + 1, 27, 7, 1);
  }
  rect('#060918', 19, 27, 8, 13);
  rect('#8a5a34', 20, 28, 6, 12);
  rect('#ffe08a', 24, 34, 1, 1);
  rect('#060918', 20, 8, 6, 6);
  rect('#ffe08a', 21, 9, 4, 4);
  cabin.refresh();

  // A soft circle of light, used for every glow.
  const glow = scene.textures.createCanvas('glow', 32, 32)!;
  const gradient = glow.context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, '#ffffffcc');
  gradient.addColorStop(1, '#ffffff00');
  glow.context.fillStyle = gradient;
  glow.context.fillRect(0, 0, 32, 32);
  glow.refresh();
}

// ---------------------------------------------------------------------------
// Sound: tiny beeps made in code, with no audio files.
// ---------------------------------------------------------------------------
let audio: AudioContext | undefined;
// Browsers allow sound only after a key press or tap, so the audio starts then.
function unlockAudio() {
  try {
    audio ??= new AudioContext();
    void audio.resume();
  } catch { /* The game works without sound. */ }
}
window.addEventListener('keydown', unlockAudio);
window.addEventListener('pointerdown', unlockAudio);

function beep(frequency: number, delay = 0, duration = 0.14) {
  try {
    if (audio?.state !== 'running') return;
    const oscillator = audio.createOscillator();
    const volume = audio.createGain();
    const startAt = audio.currentTime + delay;
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0.04, startAt);
    volume.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(volume).connect(audio.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration);
  } catch { /* The game works without sound. */ }
}

// ---------------------------------------------------------------------------
// The scene: what appears, and what happens each frame.
// ---------------------------------------------------------------------------
export class IslandScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image;
  private lizard!: Phaser.GameObjects.Image;
  private sparks: Phaser.GameObjects.Image[] = [];
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private burst!: Phaser.GameObjects.Particles.ParticleEmitter;
  private fireworks!: Phaser.GameObjects.Particles.ParticleEmitter;
  private trail!: Phaser.GameObjects.Particles.ParticleEmitter;
  private collected = 0;
  private restart = () => this.scene.restart();

  constructor() { super('island'); }

  create() {
    this.collected = 0;
    this.sparks = [];
    this.updateScore();
    paintTextures(this);
    this.addSky();
    this.addIsland();
    this.addParticles();

    for (const [x, y] of SPARKS) {
      const glow = this.addGlow(x, y, GOLD, 0.7, 0.45);
      const spark = this.add.image(x, y, 'spark1').setDepth(y + 8).setData('glow', glow);
      this.tweens.add({ targets: spark, y: y - 3, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: x * 5 });
      this.sparks.push(spark);
    }
    this.lizard = this.place('lizard1', START.x - 14, START.y + 2);
    this.player = this.place('wizard1', START.x, START.y);

    this.keys = this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as typeof this.keys;
    this.input.keyboard!.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE']);
    document.querySelector('#restart')!.addEventListener('click', this.restart);
    this.events.once('shutdown', () => {
      document.querySelector('#restart')!.removeEventListener('click', this.restart);
    });
  }

  update(time: number, delta: number) {
    // Keyboard first; otherwise walk toward a held mouse button or finger.
    let dx = Number(this.keys.D.isDown || this.keys.RIGHT.isDown) - Number(this.keys.A.isDown || this.keys.LEFT.isDown);
    let dy = Number(this.keys.S.isDown || this.keys.DOWN.isDown) - Number(this.keys.W.isDown || this.keys.UP.isDown);
    const pointer = this.input.activePointer;
    if (!dx && !dy && pointer.isDown) {
      dx = pointer.worldX - this.player.x;
      dy = pointer.worldY - this.player.y;
      if (Math.hypot(dx, dy) < 3) { dx = 0; dy = 0; }
    }
    const length = Math.hypot(dx, dy);
    if (length) {
      // Try each direction on its own so the wizard slides along shores and walls.
      const step = SPEED * Math.min(delta, 50) / 1000;
      const x = this.player.x + dx / length * step;
      const y = this.player.y + dy / length * step;
      if (canWalk(x, this.player.y)) this.player.x = x;
      if (canWalk(this.player.x, y)) this.player.y = y;
      if (Math.abs(dx) > 0.5) this.player.setFlipX(dx < 0);
      if (Math.random() < 0.35) this.trail.emitParticleAt(this.player.x + (this.player.flipX ? -4 : 4), this.player.y - 12);
    }
    const stepFrame = Math.floor(time / 130) % 2 === 0;
    this.player.setTexture(length && stepFrame ? 'wizard2' : 'wizard1').setDepth(this.player.y);

    // The lizard scurries to a spot just behind the wizard.
    const targetX = this.player.x + (this.player.flipX ? 13 : -13);
    const targetY = this.player.y + 2;
    const gap = Math.hypot(targetX - this.lizard.x, targetY - this.lizard.y);
    const follow = 1 - Math.exp(-delta / 220);
    this.lizard.x += (targetX - this.lizard.x) * follow;
    this.lizard.y += (targetY - this.lizard.y) * follow;
    if (Math.abs(targetX - this.lizard.x) > 2) this.lizard.setFlipX(targetX < this.lizard.x);
    this.lizard.setTexture(gap > 2 && stepFrame ? 'lizard2' : 'lizard1').setDepth(this.lizard.y);

    for (const spark of this.sparks) {
      spark.setTexture(Math.floor((time + spark.x * 9) / 260) % 3 ? 'spark1' : 'spark2');
      if (spark.active && Phaser.Math.Distance.Between(this.player.x, this.player.y - 5, spark.x, spark.y) < 10) this.collect(spark);
    }
  }

  private collect(spark: Phaser.GameObjects.Image) {
    spark.setActive(false).setVisible(false);
    (spark.getData('glow') as Phaser.GameObjects.Image).setVisible(false);
    this.collected++;
    this.updateScore();
    this.burst.explode(18, spark.x, spark.y);
    this.cameras.main.shake(90, 0.004);
    beep(NOTES[this.collected - 1]);
    const label = this.add.text(spark.x, spark.y - 8, '+1', { fontFamily: FONT, fontSize: '8px', color: '#ffe08a' }).setOrigin(0.5).setDepth(900);
    this.tweens.add({ targets: label, y: label.y - 16, alpha: 0, duration: 700, onComplete: () => label.destroy() });
    if (this.collected === SPARKS.length) this.win();
  }

  private win() {
    this.cameras.main.flash(300, 61, 224, 255);
    NOTES.forEach((note, index) => beep(note, 0.2 + index * 0.09));
    this.time.addEvent({
      delay: 380, repeat: 14,
      callback: () => this.fireworks.explode(28, Phaser.Math.Between(50, 350), Phaser.Math.Between(20, 90)),
    });
    this.add.rectangle(200, 200, 236, 38, 0x12183a, 0.95).setStrokeStyle(1, CYAN).setDepth(950);
    this.add.text(200, 193, 'YOU FOUND EVERY SPARK!', { fontFamily: FONT, fontSize: '8px', color: '#f0a830' }).setOrigin(0.5).setDepth(951);
    this.add.text(200, 207, 'Now make it yours.', { fontFamily: FONT, fontSize: '8px', color: '#e8ecff' }).setOrigin(0.5).setDepth(951);
  }

  private updateScore() {
    document.querySelector('#score')!.textContent = this.collected === SPARKS.length
      ? 'Sparks: 8 / 8 — You win!'
      : `Sparks: ${this.collected} / ${SPARKS.length}`;
  }

  // Things standing on the island are drawn back to front: a larger y is closer.
  private place(key: string, x: number, y: number) {
    return this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
  }

  private addGlow(x: number, y: number, color: number, size: number, alpha: number) {
    const glow = this.add.image(x, y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setTint(color).setScale(size).setAlpha(alpha).setDepth(800);
    this.tweens.add({ targets: glow, alpha: alpha * 0.55, duration: Phaser.Math.Between(500, 1100), yoyo: true, repeat: -1 });
    return glow;
  }

  private addSky() {
    for (let i = 0; i < 80; i++) {
      const color = Phaser.Utils.Array.GetRandom([WHITE, WHITE, WHITE, CYAN, GOLD]);
      const star = this.add.rectangle(Phaser.Math.Between(0, WIDTH), Phaser.Math.Between(0, HEIGHT), 1, 1, color).setDepth(-10);
      this.tweens.add({ targets: star, alpha: 0.15, duration: Phaser.Math.Between(500, 2500), delay: Phaser.Math.Between(0, 2000), yoyo: true, repeat: -1 });
    }
    for (const [x, y, color] of [[36, 30, GOLD], [118, 18, CYAN], [282, 30, GOLD], [368, 62, CYAN], [22, 150, WHITE], [382, 168, GOLD]]) {
      const twinkle = this.add.image(x, y, 'twinkle').setTint(color).setDepth(-9);
      this.tweens.add({ targets: twinkle, alpha: 0.2, duration: 900 + x * 3, yoyo: true, repeat: -1 });
    }
    // Every few seconds a shooting star crosses the sky.
    this.time.addEvent({
      delay: 3500, loop: true,
      callback: () => {
        const streak = this.add.rectangle(Phaser.Math.Between(40, 360), Phaser.Math.Between(4, 40), 7, 1, WHITE).setRotation(0.5).setDepth(-8);
        this.tweens.add({ targets: streak, x: streak.x + 60, y: streak.y + 33, alpha: 0, duration: 650, onComplete: () => streak.destroy() });
      },
    });
    for (const [x, y, depth] of [[30, 196, 700], [352, 190, 700], [76, 214, -1], [318, 212, -1], [14, 82, -1]]) {
      const cloud = this.add.image(x, y, 'cloud').setDepth(depth);
      this.tweens.add({ targets: cloud, x: x + 18, duration: 7000 + y * 20, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
  }

  private addIsland() {
    this.add.image(0, 0, 'island').setOrigin(0);

    // Light shimmering on the lake.
    for (let i = 0; i < 12; i++) {
      const x = LAKE.x + (noise(i, 1) - 0.5) * 70;
      const y = LAKE.y + (noise(i, 2) - 0.5) * 26;
      if (!inBlob(LAKE, x, y, -6) || onDock(x, y)) continue;
      const ripple = this.add.rectangle(x, y, 5, 1, 0x8fc0ff).setAlpha(0);
      this.tweens.add({ targets: ripple, x: x + 5, alpha: 0.9, duration: 1100 + i * 90, delay: i * 240, yoyo: true, repeat: -1 });
    }
    for (const [x, y] of [[98, 138], [128, 151]]) {
      const boat = this.add.image(x, y, 'boat').setOrigin(0.5, 1);
      this.tweens.add({ targets: boat, x: x + 12, duration: 5200 + y * 10, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.tweens.add({ targets: boat, angle: { from: -4, to: 4 }, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }

    // The cabin, its warm windows, and the beam up to the floating controller.
    this.place('cabin', CABIN.x, CABIN.y);
    for (const x of [-12, 0, 11]) this.addGlow(CABIN.x + x, CABIN.y - (x ? 12 : 29), GOLD, 0.6, 0.5);
    const beam = this.add.rectangle(CABIN.x, 39, 10, 34, CYAN, 0.2).setBlendMode(Phaser.BlendModes.ADD).setDepth(CABIN.y + 1);
    const core = this.add.rectangle(CABIN.x, 39, 4, 34, CYAN, 0.35).setBlendMode(Phaser.BlendModes.ADD).setDepth(CABIN.y + 1);
    this.tweens.add({ targets: [beam, core], alpha: 0.55, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const controller = this.add.image(CABIN.x, 15, 'controller').setDepth(CABIN.y + 2);
    this.tweens.add({ targets: controller, y: 18, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.addGlow(CABIN.x, 17, CYAN, 1.2, 0.25);

    for (const [x, y] of TREES) this.place('pine', x, y);
    for (const [x, y] of LAMPS) {
      this.place('lamp', x, y);
      this.addGlow(x, y - 9, GOLD, 0.9, 0.55);
    }
    this.place('pumpkin', 166, 98);
    this.addGlow(166, 95, ORANGE, 0.5, 0.5);

    // Fireflies drift over the grass.
    for (let i = 0; i < 9; i++) {
      const x = 70 + noise(i, 3) * 260;
      const y = 80 + noise(i, 4) * 80;
      const firefly = this.add.rectangle(x, y, 1, 1, GREEN).setDepth(850).setAlpha(0);
      this.tweens.add({ targets: firefly, x: x + (noise(i, 5) - 0.5) * 40, y: y - 6 - noise(i, 6) * 12, alpha: 1, duration: 1800 + i * 210, delay: i * 300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
  }

  private addParticles() {
    const fade = { alpha: { start: 1, end: 0 }, blendMode: Phaser.BlendModes.ADD, emitting: false };
    // Sparkles when a spark is collected.
    this.burst = this.add.particles(0, 0, 'pixel', {
      ...fade, speed: { min: 15, max: 75 }, lifespan: { min: 300, max: 800 }, gravityY: 70, tint: [GOLD, 0xffe08a, WHITE],
    }).setDepth(900);
    // Fireworks when every spark is found.
    this.fireworks = this.add.particles(0, 0, 'pixel', {
      ...fade, speed: { min: 10, max: 60 }, lifespan: { min: 500, max: 1100 }, gravityY: 25, tint: [CYAN, GOLD, GREEN, PURPLE, ORANGE, WHITE],
    }).setDepth(900);
    // Magic dust from the wizard's staff.
    this.trail = this.add.particles(0, 0, 'pixel', {
      ...fade, speedX: { min: -6, max: 6 }, speedY: { min: -16, max: -4 }, lifespan: 600, tint: [CYAN, PURPLE, WHITE],
    }).setDepth(900);
    // Motes of light rising through the beam.
    this.add.particles(CABIN.x, CABIN.y - 38, 'pixel', {
      x: { min: -4, max: 4 }, speedY: { min: -32, max: -14 }, lifespan: 1100, frequency: 110,
      alpha: { start: 1, end: 0 }, tint: [CYAN, WHITE], blendMode: Phaser.BlendModes.ADD,
    }).setDepth(CABIN.y + 3);
  }
}
