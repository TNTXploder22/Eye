// DeathScene.js
class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'deathscene' });
    }

    create() {
        // Background and text
        this.add.image(400, 300, 'sky').setScale(1.5);
        this.add.text(400, 150, 'GAME OVER', { fontSize: '64px', fill: '#FF0000' }).setOrigin(0.5);
        this.add.text(400, 250, 'Choose an option:', { fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);

        // Buttons for restarting the level or from the checkpoint
        const restartButton = this.add.text(400, 350, 'Restart Level', { fontSize: '32px', fill: '#FF0000' }).setOrigin(0.5).setInteractive();
        restartButton.on('pointerdown', this.restartLevel, this);

        const checkpointButton = this.add.text(400, 450, 'Restart from Checkpoint', { fontSize: '32px', fill: '#FF0000' }).setOrigin(0.5).setInteractive();
        checkpointButton.on('pointerdown', this.restartFromCheckpoint, this);
    }

    restartLevel() {
        this.scene.start('gamescene');
    }

    restartFromCheckpoint() {
        if (window.lastCheckpoint) {
            this.scene.start('gamescene', { checkpoint: player.setPosition(lastCheckpoint.x, lastCheckpoint.y) });
        } else {
            this.scene.start('gamescene'); // Default restart if no checkpoint is set
        }
    }
}

export default DeathScene;