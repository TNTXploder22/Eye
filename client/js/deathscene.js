class DeathScene extends Phaser.Scene {
    constructor() {
        super({ key: 'deathscene' });
    }

    init(data) {
        this.lives = data.lives;
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
    }
}

export default DeathScene;

// checkpoint needed
//display needed