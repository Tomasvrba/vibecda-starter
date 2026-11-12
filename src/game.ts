import Phaser from 'phaser';

const SPARKS = [
  [180, 300], [320, 340], [480, 360], [670, 320],
  [710, 170], [580, 85], [360, 85], [130, 130],
] as const;
const SPEED = 220;

export class LakeScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private sparks: Phaser.GameObjects.Arc[] = [];
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private collected = 0;
  private restart = () => this.scene.restart();

  constructor() { super('lake'); }

  create() {
    this.collected = 0;
    this.sparks = [];
    this.updateScore();
    const art = this.add.graphics();
    art.fillStyle(0x24554a).fillRoundedRect(28, 28, 744, 394, 32);
    art.lineStyle(22, 0x4d7966, 0.7).strokeRoundedRect(72, 65, 660, 320, 48);
    art.fillStyle(0x236378).fillEllipse(400, 220, 300, 155);
    art.lineStyle(3, 0x80cfca, 0.35);
    for (let y = 190; y <= 250; y += 20) art.lineBetween(335, y, 465, y);
    art.fillStyle(0xbca77c).fillRoundedRect(482, 204, 90, 24, 3);
    for (const [x, y] of [[80, 90], [200, 70], [650, 390], [70, 380]]) {
      art.fillStyle(0x123b30).fillCircle(x, y, 24);
      art.fillStyle(0x327759).fillTriangle(x, y - 30, x - 22, y + 7, x + 22, y + 7);
    }
    this.add.text(400, 215, 'LAKE CDA', {
      fontFamily: 'monospace', fontSize: '18px', color: '#bcece7',
    }).setOrigin(0.5);
    for (const [x, y] of SPARKS) {
      const spark = this.add.circle(x, y, 9, 0xffd477).setStrokeStyle(3, 0xffedb2);
      this.sparks.push(spark);
      this.tweens.add({ targets: spark, scale: 1.25, duration: 650, yoyo: true, repeat: -1 });
    }
    this.player = this.add.circle(80, 300, 13, 0xec8e73).setStrokeStyle(3, 0xffe5d1);
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as typeof this.keys;
    this.input.keyboard!.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE']);
    document.querySelector('#restart')!.addEventListener('click', this.restart);
    this.events.once('shutdown', () => {
      document.querySelector('#restart')!.removeEventListener('click', this.restart);
    });
  }

  update(_time: number, delta: number) {
    if (this.collected === SPARKS.length) return;
    let dx = Number(this.keys.D.isDown || this.keys.RIGHT.isDown) - Number(this.keys.A.isDown || this.keys.LEFT.isDown);
    let dy = Number(this.keys.S.isDown || this.keys.DOWN.isDown) - Number(this.keys.W.isDown || this.keys.UP.isDown);
    const pointer = this.input.activePointer;
    if (!dx && !dy && pointer.isDown) {
      dx = pointer.x - this.player.x;
      dy = pointer.y - this.player.y;
      if (Math.hypot(dx, dy) < 5) { dx = 0; dy = 0; }
    }
    const length = Math.hypot(dx, dy);
    if (length) {
      const step = SPEED * Math.min(delta, 50) / 1000;
      this.player.x = Phaser.Math.Clamp(this.player.x + dx / length * step, 45, 755);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy / length * step, 45, 405);
    }
    for (const spark of this.sparks) {
      if (spark.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, spark.x, spark.y) < 25) {
        spark.setActive(false).setVisible(false);
        this.collected++;
        this.updateScore();
      }
    }
    if (this.collected === SPARKS.length) {
      this.add.rectangle(400, 220, 420, 90, 0x10231f, 0.94).setStrokeStyle(2, 0xffd477);
      this.add.text(400, 220, 'You found every spark!\nNow build your own adventure.', {
        fontFamily: 'monospace', fontSize: '21px', color: '#fff2d4', align: 'center',
      }).setOrigin(0.5);
    }
  }

  private updateScore() {
    document.querySelector('#score')!.textContent = this.collected === SPARKS.length
      ? 'Sparks: 8 / 8 — You win!'
      : `Sparks: ${this.collected} / ${SPARKS.length}`;
  }
}
