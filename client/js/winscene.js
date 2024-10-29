class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'winscene' });
    }

    preload() {
        this.load.image('darkness', 'client/assets/darkness.png');
        this.load.image('ctr', 'client/assets/ctr.png');
        this.load.image('win', 'client/assets/win.png');
        this.load.image('you', 'client/assets/you.png');
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        this.add.image(0, 0, 'darkness').setOrigin(0, 0);
        let ctr = this.add.image(400, 300, 'ctr').setOrigin(0.5).setAlpha(0.5);
        this.add.image(0, 0, 'you').setOrigin(0, 0);
        this.add.image(0, 0, 'win').setOrigin(0, 0);
        this.add.text(400, 400, 'Orbs Collected: ' + this.score, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.tweens.add({
            targets: ctr,
            alpha: 1,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.input.on('pointerdown', () => {
            this.scene.start('gamescene');
        });
    }
}

export default WinScene;