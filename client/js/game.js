import GameScene from './gamescene.js';
import TitleScene from './titlescene.js';
import WinScene from './winscene.js';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [TitleScene, GameScene, WinScene],
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

const game = new Phaser.Game(config);