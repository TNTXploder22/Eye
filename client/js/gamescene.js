var player;
var platforms;
var cursors;
var orbs;
var scoreText;
var winSpot;
var isPaused = false;
var pauseText;
var pausebutton;
var livesText;
var livesIcon;
var playerLives = 3;  // Default lives if no data is fetched initially

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gamescene' });
        this.score = 0;
    }

    async init() {
        this.score = 0;

        // Fetch player data (lives) from the database
        try {
            const username = window.userData.username; // Get the username from window.userData (set at login)
            const response = await fetch(`/get-user-data?username=${username}`); // Fetch user data
            if (response.ok) {
                const data = await response.json();
                playerLives = data.gameItems.lives;  // Set player lives from DB
            } else {
                console.error('Failed to fetch player data');
            }
        } catch (err) {
            console.error('Error fetching player data:', err);
        }
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.add.image(200, 140, 'cloud1').setScale(7);
        this.add.image(600, 200, 'cloud2').setScale(7);
        this.add.image(600, 520, 'bush').setScale(3);
        this.add.image(300, 520, 'bush').setScale(3);
        this.add.image(600, 200, 'weed').setScale(2);
        this.add.image(500, 525, 'weed').setScale(2);
        this.add.image(100, 525, 'weed').setScale(2);

        platforms = this.physics.add.staticGroup();
        platforms.create(400, 600, 'ground').setScale(1).refreshBody();
        platforms.create(600, 250, 'platform1');
        platforms.create(200, 440, 'platform2');
        platforms.create(400, 350, 'platform2');

        winSpot = this.physics.add.image(600, 512, 'winspot').setScale(1.5).setAlpha(0.5);

        player = this.physics.add.sprite(200, 450, 'eye').setScale(0.75);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.setSize(30, 100, 50, 0);

        this.tweens.add({
            targets: winSpot,
            alpha: 1,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('eye', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'turn', frames: [{ key: 'eye', frame: 4 }], frameRate: 20 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('eye', { start: 5, end: 8 }), frameRate: 10, repeat: -1 });

        cursors = this.input.keyboard.createCursorKeys();

        orbs = this.physics.add.group({ key: 'orb', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } });
        orbs.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        scoreText = this.add.text(16, 16, 'Orbs: 0', { fontSize: '32px', fill: '#FF0000' });

        // Add the "Lives" image and text
        livesIcon = this.add.image(30, 65, 'clife').setScale(.75).setOrigin(0.5);
        livesText = this.add.text(50, 50, `Lives: ${playerLives}`, { fontSize: '32px', fill: '#FF0000' });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(orbs, platforms);
        this.physics.add.collider(winSpot, platforms);
        this.physics.add.overlap(player, orbs, this.collectOrbs, null, this);
        this.physics.add.overlap(player, winSpot, this.winGame, null, this);

        pauseText = this.add.text(400, 300, 'Paused', { fontSize: '64px', fill: '#FF0000' })
            .setOrigin(0.5)
            .setVisible(false);

        this.input.keyboard.on('keydown-P', this.togglePause, this);

        pausebutton = this.add.image(780, 20, 'pause').setScale(.05).setOrigin(0.5).setInteractive();
        pausebutton.on('pointerdown', this.togglePause, this);
    }

    update() {
        if (isPaused) return;

        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }

        // Update the lives display in real-time if the value changes
        livesText.setText(`Lives: ${playerLives}`);
    }

    collectOrbs(player, orb) {
        orb.disableBody(true, true);
        this.score += 1;
        scoreText.setText('Orbs: ' + this.score);
    }

    winGame() {
        winSpot.disableBody(true, true);
        console.log('Score before transitioning to win scene:', this.score); // Debugging log
        this.updatePlayerData();
        this.scene.start('winscene', { score: this.score });
    }

    togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            this.physics.pause();
            pauseText.setVisible(true);
        } else {
            this.physics.resume();
            pauseText.setVisible(false);
        }
    }

    async updatePlayerData() {
        const username = window.userData.username;

        let rankOrbs = 0;
        if (this.score >= 12) {
            rankOrbs = 3;
        } else if (this.score >= 6) {
            rankOrbs = 2;
        } else if (this.score >= 0) {
            rankOrbs = 1;
        }

        // Update player data, including lives
        const response = await fetch('/update-game-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                orbs: this.score,   // Assuming you want to update orbs with score
                score: this.score,
                rankOrbs: rankOrbs,
                lives: playerLives
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

export default GameScene;
