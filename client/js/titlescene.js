class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'titlescene'
        });
    }

    preload() {
        this.load.image('sky', 'client/assets/sky.png');
        this.load.image('cloud1', 'client/assets/cloud1.png');
        this.load.image('cloud2', 'client/assets/cloud2.png');
        this.load.image('bush', 'client/assets/bush.png');
        this.load.image('weed', 'client/assets/weed.png');
        this.load.image('orb', 'client/assets/orb.png');
        this.load.image('ground', 'client/assets/ground.png');
        this.load.image('shader', 'client/assets/cover.png');
        this.load.image('eyetitle', 'client/assets/eyetitle.png');
        this.load.image('playtitle', 'client/assets/playtitle.png');
        this.load.image('arrowtitle', 'client/assets/arrowtitle.png');
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0,0);
        this.add.image(400, 600, 'ground').setScale(4);
        this.add.image(200, 140, 'cloud1').setScale(7);
        this.add.image(600, 200, 'cloud2').setScale(7);
        this.add.image(600, 370, 'bush').setScale(3);
        this.add.image(300, 370, 'bush').setScale(3);
        this.add.image(500, 375, 'weed').setScale(2);
        this.add.image(100, 375, 'weed').setScale(2);
        this.add.image(0, 0, 'shader').setOrigin(0,0);

        this.add.image(400, 200, 'eyetitle').setScale(5);
        let playtitle = this.add.image(400, 450, 'playtitle').setScale(2);
        let arrow = this.add.image(100, 100, 'arrowtitle').setScale(1.5);
        arrow.setVisible(false);

        playtitle.setInteractive();
        playtitle.on('pointerover', () =>{
            arrow.setVisible(true);
            arrow.setPosition(250, 450);
        })
        playtitle.on('pointerout', () =>{
            arrow.setVisible(false);
        })
        playtitle.on('pointerup', () =>{
            this.scene.start('gamescene');
        })
    }
}

export default TitleScene;