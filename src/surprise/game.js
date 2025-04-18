const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');

// Game constants
const GRID_SIZE = 40;
const FROG_SIZE = 30;
const CAR_WIDTH = 50;
const CAR_HEIGHT = 30;
const LOG_WIDTH = 80;
const LOG_HEIGHT = 30;

// Game state
let score = 0;
let gameOver = false;
let frog = {
    x: canvas.width / 2 - FROG_SIZE / 2,
    y: canvas.height - FROG_SIZE,
    width: FROG_SIZE,
    height: FROG_SIZE
};

// Cars and logs
let cars = [];
let logs = [];

// Initialize game elements
function initGame() {
    // Create cars
    cars = [
        { x: 0, y: 300, width: CAR_WIDTH, height: CAR_HEIGHT, speed: 2, direction: 1 },
        { x: 200, y: 300, width: CAR_WIDTH, height: CAR_HEIGHT, speed: 3, direction: 1 },
        { x: 400, y: 250, width: CAR_WIDTH, height: CAR_HEIGHT, speed: 2, direction: -1 },
        { x: 100, y: 250, width: CAR_WIDTH, height: CAR_HEIGHT, speed: 3, direction: -1 }
    ];

    // Create logs
    logs = [
        { x: 0, y: 150, width: LOG_WIDTH, height: LOG_HEIGHT, speed: 1.5, direction: 1 },
        { x: 200, y: 150, width: LOG_WIDTH, height: LOG_HEIGHT, speed: 2, direction: 1 },
        { x: 400, y: 100, width: LOG_WIDTH, height: LOG_HEIGHT, speed: 1.5, direction: -1 },
        { x: 100, y: 100, width: LOG_WIDTH, height: LOG_HEIGHT, speed: 2, direction: -1 }
    ];
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw frog
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(frog.x, frog.y, frog.width, frog.height);

    // Draw cars
    ctx.fillStyle = '#FF0000';
    cars.forEach(car => {
        ctx.fillRect(car.x, car.y, car.width, car.height);
    });

    // Draw logs
    ctx.fillStyle = '#8B4513';
    logs.forEach(log => {
        ctx.fillRect(log.x, log.y, log.width, log.height);
    });

    // Draw safe zones (grass)
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 0, canvas.width, 50);
    ctx.fillRect(0, 200, canvas.width, 50);
}

// Update game state
function update() {
    if (gameOver) return;

    // Move cars
    cars.forEach(car => {
        car.x += car.speed * car.direction;
        if (car.direction === 1 && car.x > canvas.width) {
            car.x = -car.width;
        } else if (car.direction === -1 && car.x < -car.width) {
            car.x = canvas.width;
        }
    });

    // Move logs
    logs.forEach(log => {
        log.x += log.speed * log.direction;
        if (log.direction === 1 && log.x > canvas.width) {
            log.x = -log.width;
        } else if (log.direction === -1 && log.x < -log.width) {
            log.x = canvas.width;
        }
    });

    // Check collisions
    checkCollisions();
}

// Check for collisions
function checkCollisions() {
    // Check car collisions
    cars.forEach(car => {
        if (isColliding(frog, car)) {
            gameOver = true;
            gameOverElement.style.display = 'block';
        }
    });

    // Check if frog is on a log
    let onLog = false;
    logs.forEach(log => {
        if (isColliding(frog, log)) {
            onLog = true;
            frog.x += log.speed * log.direction;
        }
    });

    // Check if frog fell in water
    if (frog.y < 200 && frog.y > 50 && !onLog) {
        gameOver = true;
        gameOverElement.style.display = 'block';
    }

    // Check if frog reached the top
    if (frog.y <= 50) {
        score += 100;
        scoreElement.textContent = `Score: ${score}`;
        frog.y = canvas.height - FROG_SIZE;
        frog.x = canvas.width / 2 - FROG_SIZE / 2;
    }
}

// Collision detection
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    const step = GRID_SIZE;
    switch(e.key) {
        case 'ArrowUp':
            frog.y = Math.max(0, frog.y - step);
            break;
        case 'ArrowDown':
            frog.y = Math.min(canvas.height - FROG_SIZE, frog.y + step);
            break;
        case 'ArrowLeft':
            frog.x = Math.max(0, frog.x - step);
            break;
        case 'ArrowRight':
            frog.x = Math.min(canvas.width - FROG_SIZE, frog.x + step);
            break;
    }
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Restart game
restartButton.addEventListener('click', () => {
    gameOver = false;
    gameOverElement.style.display = 'none';
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    frog.x = canvas.width / 2 - FROG_SIZE / 2;
    frog.y = canvas.height - FROG_SIZE;
    initGame();
});

// Start the game
initGame();
gameLoop(); 