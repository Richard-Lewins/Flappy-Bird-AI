let body = document.getElementsByTagName("body")[0];

//Create Flappy Canvas
var flappyCanvas = document.createElement("canvas");
var flappyLeft = 5;
var flappyTop = 5;
flappyCanvas.id = "FlappyCanvas";
flappyCanvas.width = 350;
flappyCanvas.height = 500;
flappyCanvas.style.zIndex = 8;
flappyCanvas.style.position = "absolute";
flappyCanvas.style.border = "1px solid";
flappyCanvas.style.left = flappyLeft;
flappyCanvas.style.top = flappyTop;
body.appendChild(flappyCanvas);

var ctx = flappyCanvas.getContext("2d"); //Drawing Canvas Context Variable

//Create Canvas For Drawing Genome;
var genomeCanvas = document.createElement("canvas");
genomeCanvas.id = "GenomeCanvas";
genomeCanvas.width = 200;
genomeCanvas.height = 200;
genomeCanvas.style.zIndex = 8;
genomeCanvas.style.position = "absolute";
genomeCanvas.style.border = "1px solid";
genomeCanvas.style.left = flappyLeft + flappyCanvas.width;
genomeCanvas.style.top = flappyTop + flappyCanvas.height - genomeCanvas.height;
body.appendChild(genomeCanvas);

//Assign inputs and labels to variables
var speedSpinner = document.getElementById("speedSpinner");
var generationLabel = document.getElementById("generationLabel");
var scoreLabel = document.getElementById("scoreLabel");

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
ctx.fillRect(0, 0, flappyCanvas.width, flappyCanvas.height);

//Creating Pipes
var pipes = [];
pipes[0] = {
    x: flappyCanvas.width,
    y:-300
}

//Pipe Variables
var pipeWidth = 60;
var pipeLength = flappyCanvas.height;
var pipeGap = 100; //Gap between top pipe and bottom pipe
var distanceBetweenPipes = 200; //Gaps between pipes coming from the right
var pipeSpeed = 1;

let gameSpeed = 1;

//Floor Variables
var positionOfFloor = 0; //So that floor appears as if it's moving
var floorHeight = 30;

//Bird Variables
//let newPlayer = new player();

let birdPopulation = new population(1000);

var gameOver = false;

function drawPipes(){
    for(var i = 0;i < pipes.length ;i++){
        ctx.drawImage(imgPipeTop,pipes[i].x,pipes[i].y, pipeWidth, pipeLength); //Draw Top pipe
        ctx.drawImage(imgPipeBottom,pipes[i].x, pipes[i].y + pipeLength + pipeGap, pipeWidth, pipeLength); //Draw Bottom pipe
        pipes[i].x = pipes[i].x - pipeSpeed; //Move pipe to the left

        //If the pipe is a distanceBetweenPipes from the right, create a new pipe on the right
        if(pipes[i].x == flappyCanvas.width - distanceBetweenPipes){
            pipes.push(
                {
                x : flappyCanvas.width,
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

    while(groundCovered < flappyCanvas.width){
        ctx.drawImage(imgFloor,groundCovered,flappyCanvas.height-floorHeight)
        groundCovered = groundCovered + floorHeight;
    }
}



document.addEventListener("keydown",handleKeyDown);
function handleKeyDown(e){
    if (e.keyCode == 32){
        //moveUp();
        newPlayer.moveUp();
    }
    if (e.keyCode == 13 && gameOver){
        reset();
    }
}


function reset(){
    //Return Variables to default
    gameOver = false;
    pipes = [];
    pipes[0] = {
        x: flappyCanvas.width,
        y:-300
    }
    birdPopulation.restart();
    bestPlayer = birdPopulation.players[0];
    generationLabel.innerText = `Generation: ${birdPopulation.generationNumber}`;

    gameOver = false;
}


let bestPlayer = birdPopulation.players[0];

function draw(){
    if(!gameOver){
        for(let i = 0;i<speedSpinner.value;i++){
            ctx.fillRect(0, 0, flappyCanvas.width, flappyCanvas.height);
            drawPipes();
            drawFloor();

            birdPopulation.run();
            let newBest = birdPopulation.getBestPlayer()
            if(newBest.fitness > bestPlayer.fitness){
                bestPlayer = newBest;
                bestPlayer.playerGenome.setup(genomeCanvas,10);
                bestPlayer.playerGenome.draw();
            }


            //Draw current Best Genome
            scoreLabel.innerText = `Score: ${bestPlayer.getScore()}`
            if(birdPopulation.gameOver){
                gameOver = true;
                reset();
                break;
            }
        }
    requestAnimationFrame(draw);
    }
}

draw();