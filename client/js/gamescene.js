var player;
var lacus;
var slime;
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
var touch = 0;
var eyeswing;

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "gamescene" });
    this.score = 0;
    this.swingCooldown = false;
    this.isSwinging = false;
  }

  async init() {
    this.score = 0;
    this.swingCooldown = false;
    this.isSwinging = false;

    try {
      const username = window.userData?.username;
      if (!username) {
        console.error("Username is not defined");
        return;
      }

      const response = await fetch(`/get-user-data?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        playerLives = data.gameItems.lives;
      } else {
        console.error("Failed to fetch player data");
      }
    } catch (err) {
      console.error("Error fetching player data:", err);
    }
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.add.image(800, 0, "sky").setOrigin(0, 0);
    this.add.image(1200, 0, "sky").setOrigin(0, 0);
    this.add.image(1600, 0, "sky").setOrigin(0, 0);
    this.add.image(2000, 0, "sky").setOrigin(0, 0);
    this.add.image(200, 140, "cloud1").setScale(7);
    this.add.image(600, 200, "cloud2").setScale(7);
    this.add.image(1000, 140, "cloud2").setScale(7);
    this.add.image(1400, 140, "cloud1").setScale(7);
    this.add.image(1800, 200, "cloud2").setScale(7);
    this.add.image(2200, 140, "cloud1").setScale(7);
    this.add.image(600, 520, "bush").setScale(3);
    this.add.image(300, 520, "bush").setScale(3);
    this.add.image(2000, 520, "bush").setScale(3);
    this.add.image(2300, 195, "bush").setScale(3);
    this.add.image(1200, 295, "bush").setScale(3);
    this.add.image(600, 200, "weed").setScale(2);
    this.add.image(500, 525, "weed").setScale(2);
    this.add.image(100, 525, "weed").setScale(2);
    this.add.image(900, 525, "weed").setScale(2);
    this.add.image(1100, 525, "weed").setScale(2);
    this.add.image(100, 525, "weed").setScale(2);
    this.add.image(1800, 525, "weed").setScale(2);
    this.add.image(1000, 390, "weed").setScale(2);
    this.add.image(1800, 200, "weed").setScale(2);
    this.add.image(1400, 500, "weed").setScale(2);

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 600, "ground").setScale(1).refreshBody();
    platforms.create(800, 600, "ground").setScale(1).refreshBody();
    platforms.create(2000, 600, "ground").setScale(1).refreshBody();
    platforms.create(600, 250, "platform1");
    platforms.create(200, 440, "platform2");
    platforms.create(400, 350, "platform2");
    platforms.create(1200, 350, "platform1");
    platforms.create(1000, 440, "platform2");
    platforms.create(2300, 250, "platform1");
    platforms.create(2000, 450, "platform1");
    platforms.create(1500, 300, "platform1");
    platforms.create(2100, 150, "platform2");
    platforms.create(1800, 250, "platform2");
    platforms.create(1400, 550, "platform2");

    winSpot = this.physics.add
      .image(2300, 512, "winspot")
      .setScale(1.5)
      .setAlpha(0.5);

    player = this.physics.add.sprite(200, 450, "eye").setScale(0.75);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setSize(30, 100, 50, 0);

    lacus = this.physics.add.sprite(300, 450, "lacus").setScale(0.75);
    lacus.setBounce(0.2);
    lacus.setCollideWorldBounds(true);
    lacus.setSize(30, 100, 50, 0);
    lacus.direction = 1;
    lacus.speed = 40;

    slime = this.physics.add.sprite(600, 450, "slime").setScale(0.75);
    slime.setBounce(0.2);
    slime.setCollideWorldBounds(true);
    slime.setSize(30, 100, 50, 0);
    slime.direction = 1;
    slime.speed = 60;

    eyeswing = this.physics.add
      .sprite(player.x, player.y, "eyeswing")
      .setScale(0.75)
      .setOrigin(0.5)
      .setAlpha(0)
      .setBounce(0.2)
      .setSize(player.width, player.height)
      .setCollideWorldBounds(true)
      .setGravity(0);

    this.anims.create({
      key: "eyeswing_left",
      frames: this.anims.generateFrameNumbers("eyeswing", { start: 3, end: 0 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "eyeswing_right",
      frames: this.anims.generateFrameNumbers("eyeswing", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: 0,
    });

    this.tweens.add({
      targets: winSpot,
      alpha: 1,
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("eye", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "eye", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("eye", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "leftl",
      frames: this.anims.generateFrameNumbers("lacus", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "turnl",
      frames: [{ key: "lacus", frame: 4 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "rightl",
      frames: this.anims.generateFrameNumbers("lacus", { start: 5, end: 8 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "lefts",
      frames: this.anims.generateFrameNumbers("slime", { start: 0, end: 3 }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: "turns",
      frames: [{ key: "slime", frame: 4 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "rights",
      frames: this.anims.generateFrameNumbers("slime", { start: 5, end: 8 }),
      frameRate: 7,
      repeat: -1,
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on("keydown-S", this.eyeSwing, this);

    orbs = this.physics.add.group({
      key: "orb",
      repeat: 24,
      setXY: { x: 50, y: 0, stepX: 95 },
    });
    orbs.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setSize(20, 50);
    });

    scoreText = this.add
      .text(16, 16, "Orbs: 0", { fontSize: "32px", fill: "#FF0000" })
      .setScrollFactor(0);
    livesIcon = this.add
      .image(30, 65, "clife")
      .setScale(0.75)
      .setOrigin(0.5)
      .setScrollFactor(0);
    livesText = this.add
      .text(50, 50, `Lives: ${playerLives}`, {
        fontSize: "32px",
        fill: "#FF0000",
      })
      .setScrollFactor(0);

    pauseText = this.add
      .text(400, 300, "Paused", { fontSize: "64px", fill: "#FF0000" })
      .setOrigin(0.5)
      .setVisible(false)
      .setScrollFactor(0);

    pausebutton = this.add
      .image(780, 20, "pause")
      .setScale(0.05)
      .setOrigin(0.5)
      .setInteractive()
      .setScrollFactor(0);
    pausebutton.on("pointerdown", this.togglePause, this);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(eyeswing, platforms);
    this.physics.add.collider(lacus, platforms);
    this.physics.add.collider(slime, platforms);
    this.physics.add.overlap(
      player,
      lacus,
      this.handleMonsterCollision,
      null,
      this
    );
    this.physics.add.overlap(
      player,
      slime,
      this.handleMonsterCollision,
      null,
      this
    );

    this.isImmuneToMonsters = false;

    this.physics.add.collider(orbs, platforms);
    this.physics.add.collider(winSpot, platforms);
    this.physics.add.overlap(player, orbs, this.collectOrbs, null, this);
    this.physics.add.overlap(player, winSpot, this.winGame, null, this);

    checkpoint = this.physics.add
      .staticImage(1400, 495, "ccheckpoint")
      .setScale(1.5);
    checkpoint.setSize(50, 50);

    killBrick = this.physics.add
      .staticImage(1400, 600, "killbrick")
      .setScale(0.5)
      .setInteractive();
    this.physics.world.enable(killBrick);

    this.physics.add.overlap(
      player,
      checkpoint,
      this.saveCheckpoint,
      null,
      this
    );
    this.physics.add.overlap(
      player,
      killBrick,
      this.updatePlayerLives,
      null,
      this
    );

    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 2400, 600);
    this.cameras.main.setLerp(0.1, 0.1);

    this.input.keyboard.on("keydown-P", this.togglePause, this);
    this.physics.world.setBounds(0, 0, 2400, 600);

    this.time.addEvent({
      delay: 3000,
      callback: this.changeDirectionSlime,
      callbackScope: this,
      loop: true,
    });
    this.time.addEvent({
      delay: 5000,
      callback: this.changeDirectionLacus,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (isPaused) return;

    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }

    if (this.isSwinging) {
      eyeswing.setPosition(player.x, player.y);
    }

    this.moveMonsters(lacus);
    this.moveMonsters(slime);

    livesText.setText(`Lives: ${playerLives}`);
  }

  eyeSwing(pointer) {
    if (isPaused || this.swingCooldown || this.isSwinging) return;

    player.setAlpha(0);
    this.isImmuneToMonsters = true;
    eyeswing.setAlpha(1);
    eyeswing.setPosition(player.x, player.y);

    this.isSwinging = true;

    if (player.anims.currentAnim.key === "left") {
      eyeswing.anims.play("eyeswing_left", true);
    } else if (player.anims.currentAnim.key === "right") {
      eyeswing.anims.play("eyeswing_right", true);
    }

    this.physics.add.collider(eyeswing, platforms);
    this.physics.add.collider(
      eyeswing,
      lacus,
      this.handleMonsterCollision,
      null,
      this
    );
    this.physics.add.collider(
      eyeswing,
      slime,
      this.handleMonsterCollision,
      null,
      this
    );

    this.physics.add.overlap(eyeswing, lacus, this.destroyMonster, null, this);
    this.physics.add.overlap(eyeswing, slime, this.destroyMonster, null, this);

    this.time.delayedCall(400, () => {
      player.setAlpha(1);
      eyeswing.setAlpha(0);
      this.isSwinging = false;
    });

    this.time.delayedCall(600, () => {
      this.isImmuneToMonsters = false;
    });
  }

  destroyMonster(eyeswing, monster) {
    if (this.isSwinging) {
      monster.setVisible(false);
      monster.setActive(false);
      monster.body.setEnable(false);
    }
  }

  moveMonsters(monster) {
    if (monster.direction === 1) {
      monster.setVelocityX(monster.speed);
      if (
        !monster.anims.isPlaying ||
        (monster.anims.currentAnim.key !== `rightl` &&
          monster.anims.currentAnim.key !== "rights")
      ) {
        monster.anims.play(
          monster.texture.key === "lacus" ? "rightl" : "rights",
          true
        );
      }
      {
        slime.setFlipX(false);
      }
    } else {
      monster.setVelocityX(-monster.speed);
      if (
        !monster.anims.isPlaying ||
        (monster.anims.currentAnim.key !== `leftl` &&
          monster.anims.currentAnim.key !== "lefts")
      ) {
        monster.anims.play(
          monster.texture.key === "lacus" ? "leftl" : "lefts",
          true
        );
      }
      {
        slime.setFlipX(true);
      }
    }
  }

  changeDirectionSlime() {
    if (slime.direction === 1) {
      slime.direction = -1;
    } else {
      slime.direction = 1;
    }
  }
  changeDirectionLacus() {
    if (lacus.direction === 1) {
      lacus.direction = -1;
    } else {
      lacus.direction = 1;
    }
  }

  handleMonsterCollision(player) {
    if (this.isImmuneToMonsters) return;
    player.setTint(0xff0000);
    this.isImmuneToMonsters = true;
    touch += 1;
    console.log(touch);

    this.time.delayedCall(2000, () => {
      player.clearTint();
      this.isImmuneToMonsters = false;
    });

    if (touch == 2) {
      console.log("Player Touched Lacus/Slime Two Times -1 Life!");
      player.clearTint();
      touch = 0;
      this.updatePlayerLives();
    }
  }

  collectOrbs(player, orb) {
    orb.disableBody(true, true);
    this.score += 1;
    scoreText.setText("Orbs: " + this.score);
  }

  winGame() {
    winSpot.disableBody(true, true);
    console.log("Score before transitioning to win scene:", this.score);
    touch = 0;
    lastCheckpoint = null;
    this.updatePlayerData();
    this.scene.start("winscene", { score: this.score });
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
  }

  async updatePlayerLives() {
    console.log("before player dies: " + playerLives);
    playerLives -= 1;
    console.log("after player dies: " + playerLives);
    console.log("Last checkpoint:", lastCheckpoint);

    this.score = 0;
    scoreText.setText("Orbs: " + this.score);

    this.updatePlayerData();

    if (playerLives <= 0) {
      this.updatePlayerData();
      this.scene.start("deathscene");
    } else {
      if (lastCheckpoint) {
        player.setPosition(lastCheckpoint.x, lastCheckpoint.y);
        console.log("Respawned at checkpoint:", lastCheckpoint);
      } else {
        player.setPosition(200, 450);
        console.log("Respawned at starting position");
      }
    }
  }

  async updatePlayerData() {
    const username = window.userData?.username;
    if (!username) {
      console.error("Username is not defined");
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

    if (
      this.score === undefined ||
      playerLives === undefined ||
      rankOrbs === undefined
    ) {
      console.error("Invalid data:", {
        score: this.score,
        playerLives,
        rankOrbs,
      });
      return;
    }

    console.log("Sending update request with:", {
      username,
      orbs: this.score,
      rankOrbs: rankOrbs,
      lives: playerLives,
    });

    const updateResponse = await fetch("/update-game-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        orbs: this.score,
        rankOrbs: rankOrbs,
        lives: playerLives,
      }),
    });

    if (updateResponse.ok) {
      console.log("Game data updated successfully!");
    } else {
      const errorData = await updateResponse.json();
      console.error("Failed to update game data:", errorData);
    }
  }
}

export default GameScene;