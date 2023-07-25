let player;
let balls = [];
let lives = 3;
let safeHalfWidth; // Variable to store the "safe" half of the screen's width
const maxBalls = 4; // Maximum number of balls on the screen
const speedIncrement = 0.1; // Amount by which the speed increases for each new ball
let score = 0; // Variable to keep track of the score

function setup() {
    createCanvas(windowWidth, windowHeight);
    safeHalfWidth = width / 2; // Set the "safe" half to the left half of the screen
    player = new Player();
    noCursor();
    rectMode(CENTER);
}

function draw() {
    background(245, 245, 220);
    
    strokeWeight(5);
    line(windowWidth/2, 0, windowWidth/2,windowHeight)
    
    noFill();
    arc(200,394,500,650,PI+HALF_PI,HALF_PI);
    arc(windowWidth-200,394,500,650,HALF_PI,PI+HALF_PI);

    ellipse(windowWidth/2, windowHeight/2, 200,200);
    fill(245, 245, 220);
    rect(50,windowHeight/2, 500, 250);
    rect(1390,windowHeight/2, 500, 250);

    arc(300,395,250,250,PI+HALF_PI,HALF_PI);
    arc(1140,395,250,250,HALF_PI,PI+HALF_PI);

    line(0,70,200,70);
    line(0,windowHeight-70,200,windowHeight-70);
    line(windowWidth,70,windowWidth-200,70);
    line(windowWidth,windowHeight-70,windowWidth-200,windowHeight-70);


    // Create new balls only on the "unsafe" half and aim towards the player
    if (random(1) < 0.03 && balls.length < maxBalls) {
        let ballX = random(safeHalfWidth + 100, width); // Generate balls more to the right
        let ballY = random(height);
        let angle = atan2(player.y - ballY, player.x - ballX);
        let initialSpeed = 20 + balls.length * speedIncrement; // Increase the initial speed
        balls.push(new Ball(ballX, ballY, angle, initialSpeed));
    }
    // Update and display the player
    player.update();
    player.display();
    // Update and display the balls
    for (let i = balls.length - 1; i >= 0; i--) {
        balls[i].update();
        balls[i].display();
        // Check for collisions with the player
        if (balls[i].collidesWith(player)) {
            balls.splice(i, 1);
            lives--;
        } else if (balls[i].isOutOfBounds()) {
            balls.splice(i, 1);
            score++; // Increment the score when a ball disappears
        }
    }
    // Display the score at the top
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 20, 20);
    // Display remaining lives
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Lives: ${lives}`, 20, 60);
    // Check for game over
    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    fill(0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    textSize(24);
    text(`Your Score: ${score}`, width / 2, height / 2 + 50);
    noLoop();
}

class Player {
    constructor() {
        this.size = 40;
        this.x = width / 4; // Start the player on the left side (1/4 of the screen)
        this.y = height / 2;
    }
    update() {
        // Restrict the player to the left "safe" half of the screen
        this.x = constrain(mouseX, 0, safeHalfWidth - this.size / 2);
        this.y = mouseY;
    }
    display() {
        fill(0, 255, 0);
        ellipse(this.x, this.y, this.size);
    }
}

class Ball {
    constructor(x, y, angle, initialSpeed) {
        this.size = 40;
        this.x = x;
        this.y = y;
        this.speed = initialSpeed; // Increase the ball speed
        this.speedX = this.speed * cos(angle); // Set the ball's speed towards the player
        this.speedY = this.speed * sin(angle);
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    display() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.size);
    }
    collidesWith(player) {
        const distance = dist(this.x, this.y, player.x, player.y);
        return distance < this.size / 2 + player.size / 2;
    }
    isOutOfBounds() {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }
}
