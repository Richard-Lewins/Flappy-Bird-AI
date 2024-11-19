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
        this.alive = true;
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

    updateInputs(){ //Inputs: [Distance From bird to closest pipe(X), Distance From bird to Bottom of pipe(y), birdVelelocity,Distance from bird to top of pipe]
        this.inputs=[];
        let closestPipe = pipes[0];
        for(let i = 0;i < pipes.length;i++){
            if (closestPipe.x + pipeWidth < this.birdX || (pipes[i].x < closestPipe.x && pipes[i].x + pipeWidth> this.birdX)){ 
                closestPipe = pipes[i];
            }
        }

        this.inputs[0] = this.linearActivation(closestPipe.x - this.birdX,0,distanceBetweenPipes);
        this.inputs[1] = this.linearActivation((closestPipe.y + pipeLength + pipeGap - this.birdY),-flappyCanvas.height,flappyCanvas.height);
        this.inputs[2] = this.linearActivation(this.birdVelocity,-4,15);
        this.inputs[3] = this.linearActivation((closestPipe.y + pipeLength - this.birdY),-flappyCanvas.height,flappyCanvas.height);

    }

    getScore(){
        let score = Math.floor((this.fitness - (flappyCanvas.width + pipeWidth - this.birdX))/distanceBetweenPipes) + 1;
        if (score < 0) {score = 0};
        return score
    }
    
    checkIfPlayerDead(){
        for(var i = 0; i < pipes.length ;i++){
            if((this.birdX + this.birdWidth >= pipes[i].x) && //If bird is touching pipes
                (this.birdX <= pipes[i].x + pipeWidth) &&
                ((this.birdY + this.birdHeight >= pipes[i].y + pipeLength + pipeGap) || (this.birdY <= pipes[i].y + pipeLength)) ||
                (this.birdY+this.birdHeight >= flappyCanvas.height-floorHeight)
            ){
            this.alive = false
            return true;
            }
        }
        return false;
    }
    getOutputs() {
        this.outputs = this.playerGenome.feedForward(this.inputs)
        
    }

    processOutputs(){
        if (this.outputs[0] > 0.5)
            this.moveUp();
    }
    
    moveUp(){
        if(this.birdY > 0){
            this.birdVelocity = -4;
        }else{
            this.fitness -= 0.5; //naughty bird
            this.birdY=0;
        }
    }

    //"Squishes" into given ranges
    linearActivation(input,min,max){
        return ((input-min)/(max-min)) * 2 - 1
    }

    
}
