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
  }

  create() {
    this.scene.start("GameScene");
  }
}
