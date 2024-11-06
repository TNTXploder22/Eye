import GameScene from './gamescene.js';
import TitleScene from './titlescene.js';
import WinScene from './winscene.js';
import LoadingScene from './loadingscene.js';

export default class Game {
    constructor() {
        var config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: [LoadingScene, TitleScene, GameScene, WinScene],
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                },
                render: {
                    pixelArt: true
                }
            },
        };

        this.game = new Phaser.Game(config);
    }
}