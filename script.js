let config = {
    type: Phaser.AUTO,
    width: 1519,
    height: 750,  
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let player;
let platforms;
let doors;
let cursors;
let controlsEnabled = false;
let background;
let score = 0;
let scoreText;

// Function to preload assets
function preload() {
    this.load.image('sky', 'assets/desierto.jpg');
    this.load.image('ground', 'assets/jp.jpg');
    this.load.image('door', 'assets/star.png');
    this.load.image('pinchos', 'assets/pinchos.png');
    this.load.image('plataforma', 'assets/plataforma.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

// Function to create game objects
function create() {
    // Expand the world size to allow more scrolling
    this.physics.world.setBounds(0, 0, 4800, 900);

    // Repeating background using tileSprite
    background = this.add.tileSprite(0, 0, 4800, 900, 'sky').setOrigin(0, 0);
    background.setScrollFactor(0);

    // Create platforms
    platforms = this.physics.add.staticGroup();

    // Ground
    platforms.create(400, 660, 'ground').setScale(2).refreshBody();
    platforms.create(1200, 660, 'ground').setScale(2).refreshBody();
    platforms.create(2000, 660, 'ground').setScale(2).refreshBody();
    platforms.create(2800, 660, 'ground').setScale(2).refreshBody();
    platforms.create(3600, 660, 'ground').setScale(2).refreshBody();

    // Floating platforms
    platforms.create(500, 520, 'ground');
    platforms.create(1000, 435, 'ground');
    platforms.create(1500, 370, 'ground');
    platforms.create(2000, 370, 'ground');

    platforms.create(2400, 480, 'plataforma');
    platforms.create(2600, 420, 'plataforma');
    platforms.create(2800, 350, 'plataforma');
    platforms.create(3000, 370, 'plataforma');
    platforms.create(3200, 350, 'plataforma');
    platforms.create(3400, 330, 'plataforma');
    platforms.create(3600, 310, 'plataforma');

    // Create pinchos (spikes)
    const spikes = this.physics.add.staticGroup();
    spikes.create(2900, 580, 'pinchos');
    spikes.create(2970, 580, 'pinchos');
    spikes.create(3040, 580, 'pinchos');
    spikes.create(3110, 580, 'pinchos');
    spikes.create(3180, 580, 'pinchos');
    spikes.create(3250, 580, 'pinchos');
    spikes.create(3320, 580, 'pinchos');
    spikes.create(3390, 580, 'pinchos');
    spikes.create(3460, 580, 'pinchos');
    spikes.create(3530, 580, 'pinchos');
    spikes.create(3600, 580, 'pinchos');
    spikes.create(3670, 580, 'pinchos');
    spikes.create(3740, 580, 'pinchos');

    // Create the player
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setCollideWorldBounds(true);

    // Create player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Player collisions with platforms and spikes
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, spikes, hitSpikes, null, this);

    // Create doors
    doors = this.physics.add.staticGroup();
    doors.create(200, 550, 'door').setName('door1');
    doors.create(2200, 320, 'door').setName('door2');
    doors.create(2800, 310, 'door').setName('door3');
    doors.create(3600, 270, 'door').setName('door4');

    // Enable collisions between the player and doors
    this.physics.add.overlap(player, doors, enterDoor, null, this);

    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff'
    });

    // Keyboard controls
    cursors = this.input.keyboard.createCursorKeys();

    // Make the camera follow the player
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 4800, 750); // Set camera bounds to match world bounds
}

// Function to handle player hitting spikes
function hitSpikes(player, spikes) {
    player.setTint(0xff0000); // Change color to indicate hit
    player.anims.play('turn'); // Play turn animation
    player.setVelocityX(0);
    player.setVelocityY(0);
    this.time.delayedCall(500, restartGame, [], this); // Restart game after a delay
}

// Function to restart the game
function restartGame() {
    this.scene.restart();
}

// Function to update game state
function update() {
    // Check if controls are enabled
    if (!controlsEnabled) {
        player.setVelocityX(0); // Stop the player from moving
        return;
    }

    // Player movement
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

    // Ensure the player can only jump when touching the ground
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    // Make the background scroll with the player
    background.tilePositionX = this.cameras.main.scrollX * 0.5;
}

// Function to handle player entering doors
function enterDoor(player, door) {
    if (door.name === 'door1') {
        score += 10; // Add points for completing the game
        scoreText.setText('Score: ' + score); // Update score display
        openJeopardyGame(); // Call function to open Jeopardy game
    } else if (door.name === 'door2') {
        console.log("You interacted with Door 2. This would load Level 2.");
        this.scene.start('level2');
    } else if (door.name === 'door3') {
        console.log("You interacted with Door 3. This would load Level 3.");
        this.scene.start('level3');
    } else if (door.name === 'door4') {
        console.log("You interacted with Door 4. This would load Level 4.");
        this.scene.start('level4');
    }
}

// Function to open the Jeopardy game in an isolated container
function openJeopardyGame() {
    const jeopardyContainer = document.getElementById('jeopardy-container');
    const jeopardyIframe = document.getElementById('jeopardy-frame');

    jeopardyIframe.src = "jeopardy/jeopardy.html"; // Asegúrate de que esta ruta sea correcta
    jeopardyContainer.style.display = 'block';
    game.scene.pause();

    jeopardyIframe.onload = () => {
        console.log("Jeopardy iframe loaded successfully.");
    };

    jeopardyIframe.onerror = () => {
        console.error("Failed to load Jeopardy iframe.");
    };
}

// Maneja mensajes desde el iframe de Jeopardy
window.addEventListener('message', function(event) {
    if (event.data === 'closeJeopardy') {
        closeJeopardy();
    } else if (event.data === 'winJeopardy') {
        awardPoints();
        closeJeopardy();
    }
});

function closeJeopardy() {
    const jeopardyContainer = document.getElementById('jeopardy-container');
    const jeopardyIframe = document.getElementById('jeopardy-frame');
    
    jeopardyContainer.style.display = 'none';
    jeopardyIframe.src = ""; // Resetea la fuente del iframe para prevenir problemas
    game.scene.resume();
}

function awardPoints() {
    score += 10; // Otorga 10 puntos
    scoreText.setText('Score: ' + score);
    console.log("¡Has ganado en Jeopardy! 10 puntos añadidos.");
}
// Function to start the game
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    controlsEnabled = true;
    game.scene.resume(); // Ensure the game is running
}

// Event listener for the play button
document.getElementById('playButton').addEventListener('click', startGame);
