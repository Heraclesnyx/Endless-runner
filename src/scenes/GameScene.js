// // Gameplay principal

import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.add.image(400, 300, "paysage");
    // this.ground = this.physics.add.staticGroup();

    // Sol visuel (tileSprite = image répétée)
    this.ground = this.add
      .tileSprite(0, 600, 800, 64, "ground")
      .setOrigin(0, 1)
      .setDepth(0); // Arrière-plan

    //Sol physique invisible
    this.groundCollider = this.physics.add
      .staticSprite(400, 600, "ground")
      .setOrigin(0.5, 1)
      .setDisplaySize(800, 64)
      .refreshBody()
      .setVisible(false); // Cache la hitbox

    //Création de mon joueur
    this.player = this.physics.add.sprite(100, 500, "ninja");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true).setDepth(1); //Perso devant le sol

    //Animation run
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("ninja", { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1, //-1 pour que sa boucle
    });

    // Activer la collision entre le joueur et mon sol
    this.physics.add.collider(this.player, this.groundCollider);

    //Initialise la gestion des touches
    this.cursors = this.input.keyboard.createCursorKeys();

    //Savoir si le joueur court
    this.isRunning = false;
  }

  update() {
    if (this.cursors.right.isDown && !this.isRunning) {
      this.isRunning = true;
      this.player.anims.play("run", true);
      this.player.setVelocity(160);
    }

    if (this.isRunning) {
      this.ground.tilePosition += 2;
    }
    // } else {
    //   this.player.anims.stop();
    //   this.player.setVelocity(0);
    // }
  }
}
