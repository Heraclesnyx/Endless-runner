// Chargement des assets == des images
import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("paysage", "../../assets/paysage.png");
    this.load.image("ground", "../../assets/sol.png");
    this.load.spritesheet("ninja", "../../assets/perso.png", {
      frameWidth: 47,
      frameHeight: 59,
    });
    this.load.spritesheet("sauter", "../../assets/ninja-sauter.png", {
      frameWidth: 90,
      frameHeight: 120,
    });
    this.load.spritesheet("glisser", "../../assets/glisse.png", {
      frameWidth: 1438,
      frameHeight: 1388,
    });
    this.load.spritesheet("mort", "../../assets/dead.png", {
      frameWidth: 56,
      frameHeight: 58,
    });

    this.load.image("coins", "../../assets/score.png");

    //On stocke nos différents obstacle dans un tableau pour mieux travailler avec
    this.obstacles = [
      { key: "vertical", path: "../../assets/vertical.png" },
      { key: "horizontal", path: "../../assets/vertical2.png" },
    ];

    //Chargement des éléments obstacle et plateforme
    [...this.obstacles].forEach((item) => {
      this.load.image(item.key, item.path);
    });
  }

  create() {
    const obstacleKeys = this.obstacles.map((o) => o.key); //Extraction des clés de this.obstacles du preload
    this.scene.start("GameScene", { obstacleKeys });
  }
}
