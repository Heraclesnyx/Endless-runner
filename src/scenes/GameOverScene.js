// Ecran de finn de partie
import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.esm.js";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    this.gameOvertext = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "GAME OVER", {
        fontSize: "64px",
        fill: "#ff0000",
        fontFamily: "Impact",
      })
      .setOrigin(0.5);

    // Texte "Appuyer sur ESPACE" caché au départ
    this.pressEspace = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        "Appuyer sur ESPACE pour rejouer",
        {
          fontSize: "24px",
          fill: "#ffffff",
          fontFamily: "Verdana",
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    //Après X sec, cacher "game over" et montrer "apuyer espace"
    this.time.delayedCall(2000, () => {
      this.gameOvertext.setAlpha(0);
      this.pressEspace.setAlpha(1);

      this.input.keyboard.once("keydown-SPACE", () => {
        this.scene.start("GameScene");
      });
    });
  }
}
