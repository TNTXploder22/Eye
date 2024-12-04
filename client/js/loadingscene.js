class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'loadingscene' });
    }

    preload() {
        this.loadingText = this.add.text(400, 300, 'Loading...', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const assets = [
            { type: 'image', key: 'sky', path: 'client/assets/csky.png' },
            { type: 'image', key: 'cloud1', path: 'client/assets/cloud1.png' },
            { type: 'image', key: 'cloud2', path: 'client/assets/cloud2.png' },
            { type: 'image', key: 'bush', path: 'client/assets/cbush.png' },
            { type: 'image', key: 'weed', path: 'client/assets/cweed.png' },
            { type: 'image', key: 'orb', path: 'client/assets/corb.png' },
            { type: 'image', key: 'ground', path: 'client/assets/cground.png' },
            { type: 'image', key: 'platform1', path: 'client/assets/cplatform1.png' },
            { type: 'image', key: 'platform2', path: 'client/assets/cplatform2.png' },
            { type: 'image', key: 'pause', path: 'client/assets/pausebutton.png' },
            { type: 'image', key: 'winspot', path: 'client/assets/cwinspot.png' },
            { type: 'image', key: 'darkness', path: 'client/assets/darkness.png' },
            { type: 'image', key: 'ctr', path: 'client/assets/cctr.png' },
            { type: 'image', key: 'win', path: 'client/assets/cwin.png' },
            { type: 'image', key: 'you', path: 'client/assets/you.png' },
            { type: 'image', key: 'gold', path: 'client/assets/cgold.png' },
            { type: 'image', key: 'silver', path: 'client/assets/csilver.png' },
            { type: 'image', key: 'bronze', path: 'client/assets/cbronze.png' },
            { type: 'image', key: 'shader', path: 'client/assets/cover.png' },
            { type: 'image', key: 'eyetitle', path: 'client/assets/ceyetitle.png' },
            { type: 'image', key: 'playtitle', path: 'client/assets/cplaytitle.png' },
            { type: 'image', key: 'arrowtitle', path: 'client/assets/carrowtitle.png' },
            { type: 'image', key: 'clife', path: 'client/assets/clife.png' },
            { type: 'image', key: 'ccheckpoint', path: 'client/assets/ccheckpoint.png' },
            { type: 'image', key: 'killbrick', path: 'client/assets/killbrick.png' },
            { type: 'spritesheet', key: 'eye', path: 'client/assets/eye.png', frameWidth: 88, frameHeight: 105 },
            { type: 'spritesheet', key: 'slime', path: 'client/assets/slime.png', frameWidth: 88, frameHeight: 105 },
            { type: 'spritesheet', key: 'lacus', path: 'client/assets/lacus.png', frameWidth: 88.5, frameHeight: 105 },
            { type: 'spritesheet', key: 'eyeswing', path: 'client/assets/eyeswing.png', frameWidth: 88, frameHeight: 105 }
        ];

        this.loadAssetsGradually(assets);
    }

    loadAssetsGradually(assets) {
        const assetDelay = 100;
        let index = 0;

        const loadNextAsset = () => {
            if (index < assets.length) {
                const asset = assets[index];
                if (asset.type === 'image') {
                    this.load.image(asset.key, asset.path);
                } else if (asset.type === 'spritesheet') {
                    this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth, frameHeight: asset.frameHeight });
                }

                this.loadingText.setText(`Loading: ${asset.key}`);

                index++;
                this.time.delayedCall(assetDelay, loadNextAsset, [], this);
            } else {
                this.load.on('complete', () => {
                    this.scene.start('titlescene');
                });
                this.load.start();
            }
        };

        loadNextAsset();
    }

    create() {}
}

export default LoadingScene;