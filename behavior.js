// Template
let board;
const boardWidth = 450;
const boardHeight = 500;
let context;

// Bird
let BirdWidth = 34;
let BirdHeight = 24;

let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let bird ={
    x : birdX,
    y : birdY,
    width : BirdWidth,
    height : BirdHeight
}

// Pipe
let pipeArray = [];
let pipewidth = 64;
let pipeheight = 400;
let pipeX = boardWidth;
let pipeY = 0;

let TopPipeImg;
let BottomPipeImg;

// Phsicy
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;

let score = 0;

window.onload = function(){
    board = document.getElementById('board');
    
    // Draw template
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Draw Bird
    // context.fillStyle = "red";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    birdImg = new Image();
    birdImg.src = "./bird.png";
    birdImg.onload = ()=>{
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    TopPipeImg = new Image();
    TopPipeImg.src = "./pipeTop.png";

    BottomPipeImg = new Image();
    BottomPipeImg.src = "./pipeBottom.png";


    requestAnimationFrame(update);
    setInterval(placePipes,2000);

    document.addEventListener('keydown',moveBird);
}

function update(){
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width,board.height);
    
    // BIrd
    velocityY += gravity;  
    bird.y = Math.max(bird.y + velocityX,0);
      
    bird.y += velocityY;
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // Pipe
    for(let i = 0 ; i < pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }    
        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x < -pipewidth){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "35px sans-serif";
    context.fillText(score, 5 ,45);

    if (gameOver) {
        context.fillText("GAME OVER", boardHeight/4.5,boardWidth/2);
        context.fillText("press 'space' to continue", boardHeight/15,270);
    }
}

function placePipes(){
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeheight/4 - Math.random()*(pipeheight/2);
    let openingSpace = board.height/4;
    let topPipe = {
        img : TopPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipeArray.push(topPipe);

    let BottomPipe ={
        img : BottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeheight + openingSpace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipeArray.push(BottomPipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "keyX"){
        velocityY = -6;
        if (gameOver) {
            score = 0;
            bird.x = birdX;
            bird.y = birdY;
            gameOver = false;
            pipeArray = []; 
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}