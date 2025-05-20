// // Gameplay principal

import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.add.image(400, 300, "paysage");

    // Sol visuel (tileSprite = image répétée et n'a pas de corps physique)
    this.ground = this.add
      .tileSprite(0, 600, 800, 64, "ground")
      .setOrigin(0, 1)
      .setDepth(0); // Arrière-plan

    //Sol physique invisible, obliger de le créer pour gérer la collision avec mon tileSprite)
    this.groundCollider = this.physics.add
      .staticImage(400, 600, "ground")
      .setOrigin(0.5, 1)
      .setDisplaySize(800, 64)
      .refreshBody()
      .setVisible(false); // Cache la hitbox

    // Échelles pour run et jump
    this.runScale = 1; // taille normale pour la course (déjà ok)
    this.jumpScale = Math.ceil((59 / 120) * 100) / 100; // ≈ 0.49 pour la hauteur du saut

    //Création de mon joueur
    this.player = this.physics.add.sprite(100, 500, "ninja");
    this.player.setScale(this.runScale); //Fixer  la taille du joueur
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true).setDepth(1); //Perso devant le sol

    //Animation run
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("ninja", { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1, //-1 pour que sa boucle
    });

    //Animation jump
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("sauter", { start: 0, end: 9 }),
      frameRate: 10,
      repeat: 0, //On ne boucle pas un saut
    });

    // Activer la collision entre le joueur et mon sol
    this.physics.add.collider(this.player, this.groundCollider);

    //Initialise la gestion des touches
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Événement : quand une animation démarre, adapter la scale selon run ou jump
    this.player.on("animationstart", (animation) => {
      if (animation.key === "jump") {
        this.player.setScale(this.jumpScale);
      } else if (animation.key === "run") {
        this.player.setScale(this.runScale);
      }
    });

    // Événement : quand animation jump finit, repasser en run si nécessaire
    this.player.on("animationcomplete", (animation) => {
      if (animation.key === "jump" && this.isRunning) {
        this.player.anims.play("run", true);
      }
    });

    this.isRunning = false;
  }

  update() {
    if (this.cursors.right.isDown && !this.isRunning) {
      this.isRunning = true;
      this.player.anims.play("run", true);
    }

    if (
      this.isRunning &&
      Phaser.Input.Keyboard.JustDown(this.spaceKey) &&
      this.player.body.blocked.down
    ) {
      this.player.setVelocityY(-300);
      this.player.anims.play("jump", true);
    }

    if (this.isRunning) {
      this.ground.tilePositionX += 3;
    }
  }
}
