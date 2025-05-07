// Gameplay principal

import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.add.image(400, 300, "paysage");
    this.add
      // tileSprite(x => origine image sur canva, y => origine de Y (ici en bas du canva si hauteur = 600), largeur du rectangle d'affichage où mon image sera REPETER, hauteur rectangle affichage même si image =128 px (ici 128 pixel reduit à l'aide de setDisplaySize()), et ensuite ma key qui se situe dans preload))
      .tileSprite(0, 600, 800, 128, "ground")
      .setOrigin(0, 1)
      .setDisplaySize(800, 64);
  }
}
