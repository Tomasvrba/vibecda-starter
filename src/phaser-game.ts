import Phaser from 'phaser';
import { IslandScene, WIDTH, HEIGHT } from './game';

const start = () => new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#0b0f2a',
  // pixelArt keeps every pixel sharp when the small canvas is scaled up.
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: IslandScene,
});

// Wait for the pixel font so text drawn inside the game uses it from the start.
document.fonts.load('8px "Press Start 2P"').then(start, start);
