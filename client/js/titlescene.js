class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'titlescene' });
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.add.image(400, 600, 'ground').setScale(4);
        this.add.image(200, 140, 'cloud1').setScale(7);
        this.add.image(600, 200, 'cloud2').setScale(7);
        this.add.image(600, 370, 'bush').setScale(3);
        this.add.image(300, 370, 'bush').setScale(3);
        this.add.image(500, 375, 'weed').setScale(2);
        this.add.image(100, 375, 'weed').setScale(2);
        this.add.image(0, 0, 'shader').setOrigin(0, 0);

        this.add.image(400, 200, 'eyetitle').setScale(5);
        let playtitle = this.add.image(400, 450, 'playtitle').setScale(2);
        let arrow = this.add.image(250, 450, 'arrowtitle').setScale(1.5).setAlpha(0.2);

        playtitle.setInteractive();
        playtitle.on('pointerover', () => {
            arrow.setVisible(true);
            this.tweens.add({
                targets: arrow,
                alpha: 1,
                duration: 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });
        playtitle.on('pointerout', () => {
            arrow.setVisible(false);
            arrow.setAlpha(0);
        });
        playtitle.on('pointerup', () => {
            this.scene.start('gamescene');
        });
    }
}

export default TitleScene;