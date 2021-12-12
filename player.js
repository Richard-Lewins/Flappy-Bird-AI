//Class that will be different for each game

class player{
    constructor(){
        this.alive = true;
        this.playerGenome = new genome(4,1); //Brain of the bird
        this.birdX = 50;
        this.birdY = 50;
        this.birdWidth = 58/2;
        this.birdHeight = 40/2;
        this.birdVelocity = 0;
        this.gravity = 0.25;
        this.inputs = [];
        this.outputs = [];

        this.fitness = 0;
    }

    resetPlayer(){
        alive = true;
        this.birdY = 50;
        this.birdVelocity = 0;
        this.fitness = 0;
    }

    drawPlayer(ctx,img){
        ctx.drawImage(img,this.birdX,this.birdY,this.birdWidth,this.birdHeight);
    }

    updatePlayer(){
        this.birdVelocity += this.gravity;

        if(this.birdVelocity >= 15)
            this.birdVelocity = 15;//Sets maximum velocity to 15

        this.birdY += this.birdVelocity;
        this.fitness++;
    }

    getInputs(){ //Inputs: [Distance From bird to closest pipe(X), Distance From bird to Bottom of pipe(y), birdVelelocity,birdY]
        this.inputs=[];
        let closestPipe = pipes[0];
        for(let i = 0;i < pipes.length;i++){
            if (closestPipe.x < this.birdX || (pipes[i].x < closestPipe.x && pipes[i].x > this.birdX)){ 
                closestPipe = pipes[i];
            }
        }

        this.inputs[0] = linearActivation(closestPipe.x - this.birdX,0,distanceBetweenPipes);
        this.inputs[1] = linearActivation((closestPipe.y + pipeLength + pipeGap - this.birdY),-cvs.height,cvs.height);
        this.inputs[2] = linearActivation(this.birdVelocity,-4,15);
        this.inputs[3] = linearActivation(this.birdY,0,cvs.height);

    }
    
    getOutput(){
        this.outputs = this.genome.feedForward(this.inputs)
    }

    processOutput(){
        if (this.outputs[0] > 0.5)
            moveUp();
    }
    
    moveUp(){
        if(this.birdY >= 0)
            this.birdVelocity = -4;
        else
            this.birdY=0;
    }

    //"Squishes" into given ranges
    linearActivation(input,min,max){
        return ((input-min)/(max-min)) * 2 - 1
    }

    
}