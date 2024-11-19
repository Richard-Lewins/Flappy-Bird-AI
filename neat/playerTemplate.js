/* A template that can be used to create a player 
    that can use the NEAT algorithm to learn how to play a game. */

/* Class that will be different for each game
 But the functions in this template need to be implemented */

const NUM_INPUTS = 4;
const NUM_OUTPUTS = 1;

class player{
    constructor() {
        this.alive = true;
        this.playerGenomee = new genome(NUM_INPUTS, NUM_OUTPUTS); //Brain of the player
        this.inputs = [];
        this.outputs = [];
        this.fitness = 0;
    }

    resetPlayer(){
        this.alive = true;
        this.fitness = 0;
    }

    // Draw the player on the screen
    drawPlayer(ctx,img){
        // Implement this function
    }

    // Use the outputs to decide what the player should do
    updatePlayer(){
        // Implement this function
    }

    // Get the inputs of the player from whatever game you're using
    updateInputs(){
        // Implement this function
    }

    // Get the outputs of the player
    getOutputs(){
        this.outputs = this.playerGenome.feedForward(this.inputs)
        // Add other features
    }

    // Get the score of the player
    getScore(){
        // Implement this function
    }

    // After updating the player, check if the player died
    checkIfPlayerDead(){
        // Implement this function
        // this.alive = ....
    }

    // Activation Function
    linearActivation(x,min,max){
        return (x-min)/(max-min);
    }

}
