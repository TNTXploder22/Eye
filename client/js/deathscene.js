class DeathScene extends Phaser.Scene {
  constructor() {
    super({ key: "deathscene" });
  }

  create() {
    this.add.image(400, 300, "darkness").setScale(1.5);
    this.add
      .text(400, 150, "GAME OVER", { fontSize: "64px", fill: "#FF0000" })
      .setOrigin(0.5);
    this.add
      .text(400, 250, "You Lose", { fontSize: "32px", fill: "#FFFFFF" })
      .setOrigin(0.5);
    this.add
      .text(400, 350, "Keep an EYE out for Danger", {
        fontSize: "32px",
        fill: "#00873E",
      })
      .setOrigin(0.5);

    const restartButton = this.add
      .text(400, 450, "Restart Level", { fontSize: "72px", fill: "#918ac3" })
      .setOrigin(0.5)
      .setInteractive();
    restartButton.on("pointerdown", this.restartLevel, this);
  }

  restartLevel() {
    this.scene.start("gamescene");
  }
}

export default DeathScene;
