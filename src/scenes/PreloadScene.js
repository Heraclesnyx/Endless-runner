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
  }

  create() {
    this.scene.start("GameScene");
  }
}
