/*var cvs = document.getElementById("FlappyCanvas");     
    <canvas id="FlappyCanvas" width="350" height="500"></canvas>
    <script src="game.js"></script> 
    <style> canvas{ border: 1px solid black; }</style> 
    
    //Canvas Variable */

var cvs = document.createElement("canvas");
cvs.id = "FlappyCanvas";
cvs.width = 350;
cvs.height = 500;
cvs.style.zIndex = 8;
cvs.style.position = "absolute";
cvs.style.border = "1px solid";

let body = document.getElementsByTagName("body")[0];
body.appendChild(cvs);

var ctx = cvs.getContext("2d"); //Drawing Canvas Context Variable

//Loading Images
var imgFloor = new Image();
imgFloor.src = "images/floor.png";

var imgBird = new Image();
imgBird.src = "images/bird.png";

var imgPipeTop = new Image();
imgPipeTop.src = "images/pipeTop.png";

var imgPipeBottom = new Image();
imgPipeBottom.src = "images/pipeBottom.png"

//Filling Background
ctx.fillStyle = "LightSkyBlue";
ctx.fillRect(0, 0, cvs.width, cvs.height);

//Creating Pipes
var pipes = [];
pipes[0] = {
    x: cvs.width,
    y:-300
}

//Pipe Variables
var pipeWidth = 60;
var pipeLength = cvs.height;
var pipeGap = 75; //Gap between top pipe and bottom pipe
var distanceBetweenPipes = 188; //Gaps between pipes coming from the right
var pipeSpeed = 1;

//Floor Variables
var positionOfFloor = 0; //So that floor appears as if it's moving
var floorHeight = 30;

//Bird Variables
var birdX = 50;
var birdY = 50;
var birdWidth = 58/2;
var birdHeight = 40/2;


//Other Variables
var gravity = 0.25;
var birdVelocity = 0;
var gameOver = false;

function drawPipes(){
    for(var i = 0;i < pipes.length ;i++){
        ctx.drawImage(imgPipeTop,pipes[i].x,pipes[i].y, pipeWidth, pipeLength); //Draw Top pipe
        ctx.drawImage(imgPipeBottom,pipes[i].x, pipes[i].y + pipeLength + pipeGap, pipeWidth, pipeLength); //Draw Bottom pipe
        pipes[i].x = pipes[i].x - pipeSpeed; //Move pipe to the left

        //If the pipe is a distanceBetweenPipes from the right, create a new pipe on the right
        if(pipes[i].x == cvs.width - distanceBetweenPipes){
            pipes.push(
                {
                x : cvs.width,
                y : Math.floor(Math.random()*(pipeLength-pipeGap-floorHeight) - pipeLength) //Randomly Set height of next pipe
                }
            );
        }
    }

    //To ensure that there is a maximum of five pipes in the pipes array
    if (pipes.length > 5){
        pipes.shift();
    }
}

function drawFloor(){
    //Add Floor
    positionOfFloor = positionOfFloor - pipeSpeed;
    if (positionOfFloor <= -floorHeight) positionOfFloor = 0;
    let groundCovered = positionOfFloor; //To ensure that the whole of the floor is covered

    while(groundCovered < cvs.width){
        ctx.drawImage(imgFloor,groundCovered,cvs.height-floorHeight)
        groundCovered = groundCovered + floorHeight;
    }
}

function drawBird(){
    ctx.drawImage(imgBird,birdX,birdY,birdWidth,birdHeight);
    birdVelocity += gravity;
    if(birdVelocity >= 15)
        birdVelocity = 15;//Sets maximum velocity to 15
    birdY += birdVelocity; 

    let closestPipe = pipes[0];
    for(let i = 0;i < pipes.length;i++){
        if (closestPipe.x < this.birdX || (pipes[i].x < closestPipe.x && pipes[i].x > this.birdX)){ 
            closestPipe = pipes[i];
        }
    }

}

document.addEventListener("keydown",handleKeyDown);
function handleKeyDown(e){
    if (e.keyCode == 32){
        moveUp();
    }
    if (e.keyCode == 13 && gameOver){
        reset();
    }
}
function moveUp(){
    if(birdY >= 0)
    birdVelocity = -4;
    else
    birdY=0;
}

//Checks if game is Over
function isGameOver(){
    for(var i = 0; i < pipes.length ;i++){
        if((birdX + birdWidth >= pipes[i].x) && //If bird is touching pipes
           (birdX <= pipes[i].x + pipeWidth) &&
           ((birdY + birdHeight >= pipes[i].y + pipeLength + pipeGap) || (birdY <= pipes[i].y + pipeLength)) ||
            (birdY+birdHeight >= cvs.height-floorHeight)
        )
        gameOver = true;
    }
    
}

function reset(){
    //Return Variables to default
    gameOver = false;
    pipes = [];
    pipes[0] = {
        x: cvs.width,
        y:-300
    }
    birdVelocity = 0;
    birdY = 50;
    draw();
}

function draw(){
    if(!gameOver){
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    drawPipes();
    drawFloor();
    drawBird();
    isGameOver();
    requestAnimationFrame(draw);
    }
}

draw();