class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'winscene' });
    }

    init(data) {
        // Initializing the score (orbs collected during the game).
        this.score = data.score || 0;
    }

    create() {
        let ctr = this.add.image(400, 300, 'ctr').setOrigin(0.5).setAlpha(0.5);
        this.add.image(-110, 0, 'you').setOrigin(0, 0).setScale(.75);
        this.add.image(300, -100, 'win').setOrigin(0, 0).setScale(.75);
        this.add.text(400, 400, 'Orbs Collected: ' + this.score, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const goldCircle = this.add.image(500, 230, 'gold').setOrigin(0, 0).setScale(3);
        const silverCircle = this.add.image(350, 230, 'silver').setOrigin(0, 0).setScale(3);
        const bronzeCircle = this.add.image(200, 230, 'bronze').setOrigin(0, 0).setScale(3);

        goldCircle.setTint(0x4f4f4f);
        silverCircle.setTint(0x4f4f4f);
        bronzeCircle.setTint(0x4f4f4f);

        // Rank calculation based on score
        if (this.score >= 12) {
            goldCircle.clearTint();
            bronzeCircle.clearTint();
            silverCircle.clearTint();
        } else if (this.score >= 6) {
            bronzeCircle.clearTint();
            silverCircle.clearTint();
        } else if (this.score >= 0) {
            bronzeCircle.clearTint();
        }

        this.tweens.add({
            targets: ctr,
            alpha: 1,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // When player clicks, send data and move to the next scene
        this.input.on('pointerdown', () => {
            this.updatePlayerData();
            this.scene.start('gamescene');
        });
    }

    async updatePlayerData() {
        // Fetching the username from global user data
        const username = window.userData.username;

        // Calculate rankOrbs based on the score
        let rankOrbs = 0;
        if (this.score >= 12) {
            rankOrbs = 3; // Gold, Silver, Bronze
        } else if (this.score >= 6) {
            rankOrbs = 2; // Silver, Bronze
        } else if (this.score >= 0) {
            rankOrbs = 1; // Bronze only
        }

        // Send the updated data to the backend
        const response = await fetch('/update-game-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                score: this.score,  // Send score (orbs)
                orbs: this.score,  // Send orbs
                rankOrbs: rankOrbs,  // Send rankOrbs based on score
                lives: window.userData.lives
            })
        });

        if (response.ok) {
            console.log('Game data updated successfully!');
        } else {
            const errorData = await response.json();
            console.error('Failed to update game data:', errorData.msg);
        }
    }
}

export default WinScene;