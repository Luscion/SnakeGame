//Define HTML elements
const gameBoard = document.getElementById('game-board');
const instructions = document.getElementById('instructions');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//Define game variables
const gridSize = 20;

let snake = [{x: 10, y: 10}];

let food = generatedFood();

let direction = 'right';

let gameInterval;

let gameSpeedDelay = 150;

let gameStarted = false;

let highScore = 0;




function draw() {
    gameBoard.innerHTML = ''; //every time we draww this board will be reset
    drawSnake();
    snakeFood();
    updateScore();
};


function drawSnake () {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake')
        setPosition(snakeElement, segment)
        gameBoard.appendChild(snakeElement)
    })
};


function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};


//SetPosition will set the position of the snake or the food 

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
};


//Testing draw function
//draw();


function generatedFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
};


function snakeFood() {
    if(gameStarted) {
    const foodElement = createGameElement('div', 'food')
    setPosition(foodElement, food)
    gameBoard.appendChild(foodElement)
   }
};

function moveSnake() {
    const snakeHead = {... snake[0]}
    switch(direction) {
        case 'up': 
            snakeHead.y--
            break;
        case 'down': 
            snakeHead.y++
            break;
        case 'left': 
            snakeHead.x--
            break;
        case 'right': 
            snakeHead.x++
            break;
    }
    snake.unshift(snakeHead);
    // snake.pop();

    if(snakeHead.x === food.x && snakeHead.y === food.y)  {
        food = generatedFood();
        increaseSpeed()
        clearInterval(gameInterval  );
        gameInterval = setInterval(() => {
            moveSnake();
            checkCollision();
            draw();
        }, gameSpeedDelay)
    }else {
        snake.pop()
    }
};


// setInterval(() => {
//     moveSnake();
//     draw();
// }, 100)


function startGame() {
    gameStarted = true; //Keep track of running game
    instructions.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, gameSpeedDelay); 
};


function startGameListener(event) {
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) {
        startGame();
    }else {
        switch(event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;        
        }
    }
};

document.addEventListener('keydown', startGameListener);

function increaseSpeed() {
    console.log(gameSpeedDelay)
if(gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
 }else if(gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
 }else if(gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
 }else if(gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
 }
};

function checkCollision() {
    const head = snake[0]   
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for(let i = 1; i < snake.length; i++) {
        if(head.x === snake[i].x && head.y === snake[i].y) {
            resetGame()
        }
    }
};

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x:    10, y: 10}];
    food = generatedFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore()
};


function updateScore() {
    const currentScore = snake.length -1    
    score.textContent = currentScore.toString().padStart(3, '0')
};


function updateHighScore() {
    const currentScore = snake.length -1
    if(currentScore > highScore) {
        highScore = currentScore
        highScoreText.textContent = highScore.toString().padStart(3, '0')
    }
    highScoreText.style.display = 'block'
};


function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructions.style.display = 'block';
    logo.style.display = 'block'
};