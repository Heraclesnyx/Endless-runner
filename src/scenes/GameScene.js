// // Gameplay principal

import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.obstacleKeys = data.obstacleKeys || [];
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

    //Animation dead
    this.anims.create({
      key: "dead",
      frames: this.anims.generateFrameNumbers("mort", { start: 0, end: 9 }),
      frameRate: 10,
      repeat: 0, //On ne boucle pas pour une mort
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

    //Groupe pour obstacles et plateforme
    this.obstaclesGroup = this.physics.add.group();

    //Collision entre joueur et obstacles
    this.physics.add.collider(this.player, this.obstaclesGroup, () => {
      if (!this.player.isDead) {
        this.player.isDead = true; //Eviter trop d'appel

        this.player.anims.play("dead", true);
        this.player.setVelocity(0); //Stop le mouvement

        //Arrêt de tous les obstacles
        this.obstaclesGroup.getChildren().forEach((obstacle) => {
          obstacle.setVelocity(0);
        });

        // Pour éviter le spawn
        this.obstacleTimerStarted = false;

        //Stopper le timer qui spawn les obstacles
        if (this.obstacleTimer) {
          this.obstacleTimer.remove(false);
        }

        //Arret du sol, utiliser pour le gameOver
        this.isRunning = false;

        //Arret des timer ou interactions si nécessaire
        this.time.delayedCall(1000, () => {
          this.scene.pause();
          this.scene.launch("GameOverScene"); //Pour lancer mon game over
        });
      }
    });

    //Afficher l'image score sur mon canvas
    this.scoreIcon = this.add
      .image(16, 16, "coins")
      .setOrigin(0, 0)
      .setScale(0.08); //0.08 car 0.05 est trop petit sa fait 41px*41px idéale pour mon canvas

    //Ajouter un score
    this.score = 0;
    this.scoreText = this.add.text(
      16 + this.scoreIcon.displayWidth + 8,
      20,
      "0",
      {
        fontSize: "24px",
        fill: "#FFD700",
        strokeThickness: 3,
        fontFamily: "Verdana",
      }
    );
  }

  spawnObstacleWithPlateforme() {
    //Choisir un obstacle aléatoire
    const key = Phaser.Utils.Array.GetRandom(this.obstacleKeys);

    //Position de départ
    const startX = 800;

    const obstacle = this.obstaclesGroup
      .create(startX, 540, key)
      .setOrigin(0.5, 1);
    obstacle.setVelocityX(-200);
    obstacle.body.immovable = true;
    obstacle.body.allowGravity = false;
  }

  update() {
    if (this.cursors.right.isDown && !this.isRunning) {
      this.isRunning = true;
      this.player.anims.play("run", true);

      //Lance le Timer dès que le jeu est lancer et pas avant
      if (!this.obstacleTimerStarted) {
        this.obstacleTimerStarted = true;

        //Timer pour apparition des obstacles
        this.obstacleTimer = this.time.addEvent({
          delay: 3000,
          callback: this.spawnObstacleWithPlateforme,
          callbackScope: this,
          loop: true,
        });
      }
    }

    if (
      this.isRunning &&
      Phaser.Input.Keyboard.JustDown(this.spaceKey) &&
      this.player.body.blocked.down
    ) {
      this.player.setVelocityY(-450);
      this.player.anims.play("jump", true);
    }

    if (this.isRunning) {
      this.ground.tilePositionX += 3;
    }

    // Nettoyage des obstacles et plateformes hors écran à gauche
    this.obstaclesGroup.getChildren().forEach((obstacle) => {
      //Vérifie si obstacle est passer
      if (!obstacle.scored && obstacle.x + obstacle.width < this.player.x) {
        this.score++;
        this.scoreText.setText(this.score); //Mis à jour du score
        obstacle.scored = true; //Marque l'obstacle comme passé
      }

      if (obstacle.x < -obstacle.width) {
        obstacle.destroy();
      }
    });
  }
}
