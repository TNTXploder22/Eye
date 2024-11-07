class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'loadingscene' });
    }

    preload() {
        this.add.text(400, 300, 'Loading...', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.load.image('sky', 'client/assets/csky.png');
        this.load.image('cloud1', 'client/assets/cloud1.png');
        this.load.image('cloud2', 'client/assets/cloud2.png');
        this.load.image('bush', 'client/assets/cbush.png');
        this.load.image('weed', 'client/assets/cweed.png');
        this.load.image('orb', 'client/assets/corb.png');
        this.load.image('ground', 'client/assets/cground.png');
        this.load.image('platform1', 'client/assets/cplatform1.png');
        this.load.image('platform2', 'client/assets/cplatform2.png');
        this.load.image('pause', 'client/assets/pausebutton.png');
        this.load.image('winspot', 'client/assets/cwinspot.png');
        this.load.image('darkness', 'client/assets/darkness.png');
        this.load.image('ctr', 'client/assets/cctr.png');
        this.load.image('win', 'client/assets/cwin.png');
        this.load.image('you', 'client/assets/you.png');
        this.load.image('gold', 'client/assets/cgold.png');
        this.load.image('silver', 'client/assets/csilver.png');
        this.load.image('bronze', 'client/assets/cbronze.png');
        this.load.image('shader', 'client/assets/cover.png');
        this.load.image('eyetitle', 'client/assets/ceyetitle.png');
        this.load.image('playtitle', 'client/assets/cplaytitle.png');
        this.load.image('arrowtitle', 'client/assets/carrowtitle.png');
        this.load.spritesheet('eye', 'client/assets/eye.png', { frameWidth: 88, frameHeight: 105 });
    }

    create() {
        this.scene.start('titlescene');
    }
}

export default LoadingScene;