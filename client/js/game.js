var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var player;
var platforms;
var cursors;
var orbs;
var score = 0;
var scoreText;

const game = new Phaser.Game(config);

function preload() {
  // Load assets here (e.g., images, sounds)
  this.load.image('sky', 'client/assets/sky.png');
  this.load.image('cloud1', 'client/assets/cloud1.png');
  this.load.image('cloud2', 'client/assets/cloud2.png');
  this.load.image('bush', 'client/assets/bush.png');
  this.load.image('weed', 'client/assets/weed.png');
  this.load.image('orb', 'client/assets/orb.png');
  this.load.image('ground', 'client/assets/ground.png');
  this.load.image('platform1', 'client/assets/platform1.png');
  this.load.image('platform2', 'client/assets/platform2.png');
  this.load.spritesheet('eye', 
    'client/assets/eye.png',
    { frameWidth: 88, frameHeight: 105 }
  );
  console.log("Loading eye sprite sheet");
}

function create() {
  // Initialize your game objects here
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

  player = this.physics.add.sprite(200, 450, 'eye');
  player.setScale(.75)

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('eye', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });
    this.anims.create({
      key: 'turn',
      frames: [ { key: 'eye', frame: 4 } ],
      frameRate: 20
  });
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('eye', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();

  orbs = this.physics.add.group({
    key: 'orb',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
});

orbs.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

scoreText = this.add.text(16, 16, 'Orbs: 0', { fontSize: '32px', fill: '#7f7ff5' });

this.physics.add.collider(player, platforms);
this.physics.add.collider(orbs, platforms);

this.physics.add.overlap(player, orbs, collectOrbs, null, this);

}

function update() {
  // Update your game logic here
  if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectOrbs (player, orbs)
    {
        orbs.disableBody(true, true);

        score += 1;
        scoreText.setText('Orbs: ' + score);
    }