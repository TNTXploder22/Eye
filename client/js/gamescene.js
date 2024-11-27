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
var playerLives = 3;
var lastCheckpoint = null;
var checkpoint;
var killBrick;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gamescene' });
        this.score = 0;
    }

    async init() {
        this.score = 0;

        try {
            const username = window.userData?.username;
            if (!username) {
                console.error('Username is not defined');
                return;
            }

            const response = await fetch(`/get-user-data?username=${username}`);
            if (response.ok) {
                const data = await response.json();
                playerLives = data.gameItems.lives;
            } else {
                console.error('Failed to fetch player data');
            }
        } catch (err) {
            console.error('Error fetching player data:', err);
        }
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
        this.add.image(800, 0, 'sky').setOrigin(0, 0);
        this.add.image(1200, 0, 'sky').setOrigin(0, 0);
        this.add.image(1600, 0, 'sky').setOrigin(0, 0);
        this.add.image(2000, 0, 'sky').setOrigin(0, 0);
        this.add.image(200, 140, 'cloud1').setScale(7);
        this.add.image(600, 200, 'cloud2').setScale(7);
        this.add.image(1000, 140, 'cloud2').setScale(7);
        this.add.image(1400, 140, 'cloud1').setScale(7);
        this.add.image(1800, 200, 'cloud2').setScale(7);
        this.add.image(2200, 140, 'cloud1').setScale(7);
        this.add.image(600, 520, 'bush').setScale(3);
        this.add.image(300, 520, 'bush').setScale(3);
        this.add.image(2000, 520, 'bush').setScale(3);
        this.add.image(2300, 195, 'bush').setScale(3);
        this.add.image(1200, 295, 'bush').setScale(3);
        this.add.image(600, 200, 'weed').setScale(2);
        this.add.image(500, 525, 'weed').setScale(2);
        this.add.image(100, 525, 'weed').setScale(2);
        this.add.image(900, 525, 'weed').setScale(2);
        this.add.image(1100, 525, 'weed').setScale(2);
        this.add.image(100, 525, 'weed').setScale(2);
        this.add.image(1800, 525, 'weed').setScale(2);
        this.add.image(1000, 390, 'weed').setScale(2);
        this.add.image(1800, 200, 'weed').setScale(2);
        this.add.image(1400, 500, 'weed').setScale(2);

        platforms = this.physics.add.staticGroup();
        platforms.create(400, 600, 'ground').setScale(1).refreshBody();
        platforms.create(800, 600, 'ground').setScale(1).refreshBody();
        platforms.create(2000, 600, 'ground').setScale(1).refreshBody();
        platforms.create(600, 250, 'platform1');
        platforms.create(200, 440, 'platform2');
        platforms.create(400, 350, 'platform2');
        platforms.create(1200, 350, 'platform1');
        platforms.create(1000, 440, 'platform2');
        platforms.create(2300, 250, 'platform1');
        platforms.create(2000, 450, 'platform1');
        platforms.create(1500, 300, 'platform1');
        platforms.create(2100, 150, 'platform2');
        platforms.create(1800, 250, 'platform2');
        platforms.create(1400, 550, 'platform2');

        winSpot = this.physics.add.image(2300, 512, 'winspot').setScale(1.5).setAlpha(0.5);

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

        orbs = this.physics.add.group({ key: 'orb', repeat: 24, setXY: { x: 50, y: 0, stepX: 95 } });
        orbs.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setSize(20, 50)
        });

        scoreText = this.add.text(16, 16, 'Orbs: 0', { fontSize: '32px', fill: '#FF0000' }).setScrollFactor(0);
        livesIcon = this.add.image(30, 65, 'clife').setScale(.75).setOrigin(0.5).setScrollFactor(0);
        livesText = this.add.text(50, 50, `Lives: ${playerLives}`, { fontSize: '32px', fill: '#FF0000' }).setScrollFactor(0);

        pauseText = this.add.text(400, 300, 'Paused', { fontSize: '64px', fill: '#FF0000' }).setOrigin(0.5).setVisible(false).setScrollFactor(0);

        pausebutton = this.add.image(780, 20, 'pause').setScale(.05).setOrigin(0.5).setInteractive().setScrollFactor(0);
        pausebutton.on('pointerdown', this.togglePause, this);

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(orbs, platforms);
        this.physics.add.collider(winSpot, platforms);
        this.physics.add.overlap(player, orbs, this.collectOrbs, null, this);
        this.physics.add.overlap(player, winSpot, this.winGame, null, this);

        checkpoint = this.physics.add.staticImage(1400, 495, 'ccheckpoint').setScale(1.5);
        checkpoint.setSize(50, 50);

        killBrick = this.physics.add.staticImage(1400, 600, 'killbrick').setScale(0.5).setInteractive();
        this.physics.world.enable(killBrick);

        this.physics.add.overlap(player, checkpoint, this.saveCheckpoint, null, this);
        this.physics.add.overlap(player, killBrick, this.updatePlayerLives, null, this);

        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, 2400, 600);
        this.cameras.main.setLerp(0.1, 0.1);

        this.input.keyboard.on('keydown-P', this.togglePause, this);
        this.physics.world.setBounds(0, 0, 2400, 600);
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

        livesText.setText(`Lives: ${playerLives}`);
    }

    collectOrbs(player, orb) {
        orb.disableBody(true, true);
        this.score += 1;
        scoreText.setText('Orbs: ' + this.score);
    }

    winGame() {
        winSpot.disableBody(true, true);
        console.log('Score before transitioning to win scene:', this.score);
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

    saveCheckpoint(player, checkpoint) {
        lastCheckpoint = { x: player.x, y: player.y };
        //console.log('Checkpoint saved at:', lastCheckpoint);
    }

    async updatePlayerLives() {
        console.log('before player dies: ' + playerLives);
        playerLives -= 1;
        console.log('after player dies: ' + playerLives);
        console.log('Last checkpoint:', lastCheckpoint);

        this.score = 0;
        scoreText.setText('Orbs: ' + this.score);

        this.updatePlayerData();

        if (playerLives <= 0) {
            this.updatePlayerData();
            this.scene.start('deathscene');
        } else {
            if (lastCheckpoint) {
                player.setPosition(lastCheckpoint.x, lastCheckpoint.y);
                console.log('Respawned at checkpoint:', lastCheckpoint);
            } else {
                player.setPosition(200, 450);
                console.log('Respawned at starting position');
            }
        }
    }

    async updatePlayerData() {
        const username = window.userData?.username;
        if (!username) {
            console.error('Username is not defined');
            return;
        }

        let rankOrbs = 0;
        if (this.score >= 25) {
            rankOrbs = 3;
        } else if (this.score >= 12) {
            rankOrbs = 2;
        } else if (this.score >= 0) {
            rankOrbs = 1;
        }

        if (this.score === undefined || playerLives === undefined || rankOrbs === undefined) {
            console.error('Invalid data:', { score: this.score, playerLives, rankOrbs });
            return;
        }

        console.log('Sending update request with:', {
            username,
            orbs: this.score,
            rankOrbs: rankOrbs,
            lives: playerLives
        });

        const updateResponse = await fetch('/update-game-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                orbs: this.score,
                rankOrbs: rankOrbs,
                lives: playerLives
            })
        });

        if (updateResponse.ok) {
            console.log('Game data updated successfully!');
        } else {
            const errorData = await updateResponse.json();
            console.error('Failed to update game data:', errorData);
        }
    }
}

export default GameScene;