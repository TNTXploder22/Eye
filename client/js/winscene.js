class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: "winscene" });
  }

  init(data) {
    this.score = data.score || 0;
  }

  create() {
    let ctr = this.add.image(400, 300, "ctr").setOrigin(0.5).setAlpha(0.5);
    this.add.image(-110, 0, "you").setOrigin(0, 0).setScale(0.75);
    this.add.image(300, -100, "win").setOrigin(0, 0).setScale(0.75);
    this.add
      .text(400, 400, "Orbs Collected: " + this.score, {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    const goldCircle = this.add
      .image(500, 230, "gold")
      .setOrigin(0, 0)
      .setScale(3);
    const silverCircle = this.add
      .image(350, 230, "silver")
      .setOrigin(0, 0)
      .setScale(3);
    const bronzeCircle = this.add
      .image(200, 230, "bronze")
      .setOrigin(0, 0)
      .setScale(3);

    goldCircle.setTint(0x4f4f4f);
    silverCircle.setTint(0x4f4f4f);
    bronzeCircle.setTint(0x4f4f4f);

    if (this.score >= 25) {
      goldCircle.clearTint();
      bronzeCircle.clearTint();
      silverCircle.clearTint();
    } else if (this.score >= 12) {
      bronzeCircle.clearTint();
      silverCircle.clearTint();
    } else if (this.score >= 0) {
      bronzeCircle.clearTint();
    }

    this.tweens.add({
      targets: ctr,
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.input.on("pointerdown", () => {
      this.scene.start("gamescene");
    });
  }
}

export default WinScene;
