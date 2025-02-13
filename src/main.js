const { Physics, Scene } = require("phaser");

// Point d'entrée du jeu
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
    scene: [PreloadScene, GameScene, GameOverScene],
  },
};

const game = new Phaser.Game(config);
