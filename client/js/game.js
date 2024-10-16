const config = {
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false // Set to true for debugging
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  // Load assets here (e.g., images, sounds)
}

function create() {
  // Initialize your game objects here
}

function update() {
  // Update your game logic here
}
