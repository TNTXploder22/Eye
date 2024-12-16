class DeathScene extends Phaser.Scene {
  constructor() {
    super({ key: "deathscene" });
  }

  create() {
    this.add.image(400, 300, "darkness");
    this.add.image(400, 300, "gameover").setOrigin(0.5);
    this.add.image(400, 300, "youlose").setOrigin(0.5);
    this.add.image(400, 300, "text").setOrigin(0.5);
    const restartButton = this.add
      .image(400, 300, "restart")
      .setOrigin(0.5)
      .setInteractive();
    restartButton.on("pointerdown", this.restartLevel, this);
  }

  restartLevel() {
    this.scene.start("gamescene");
  }
}

export default DeathScene;
