class population{
    constructor(numOfPlayers) {
        this.players = [];
        this.arrSpecies = [];
        this.originalNumOfPlayers = numOfPlayers
        this.deadCount = 0;
        this.gameOver = false;
        this.generationNumber = 1;

        // Add all the players, and set the best player to the first player (arbitrary)
        for(let i = 0;i<numOfPlayers;i++) {
            this.players.push(new player());
        }
        this.bestPlayer = this.players[0];
        
    }

    // Runs a single step of the game simulation for all players in the population.
    // Updates inputs, processes outputs, moves players, and checks for deaths.
    run() {
        for(let i = 0;i<this.players.length;i++) {
            if(this.players[i].alive) {
                this.players[i].updateInputs();
                this.players[i].getOutputs(); // Feed Forward and run the neural network
                this.players[i].processOutputs();
                this.players[i].updatePlayer();
                this.players[i].drawPlayer(ctx,imgBird);
                
                if(this.players[i].checkIfPlayerDead()) {
                    this.deadCount++;
                }
            }
        }

        if(this.deadCount == this.players.length) {
            this.gameOver = true;
        }
    }

    // Restarts the game with a new generation.
    // Selects the best players, applies mutations, and forms the next generation of players.
    restart() {
        this.generationNumber++;

        let oldTotalFitness = this.getTotalFitness();
        let bestPlayer = this.getBestPlayer();

        // Group the players into species based on genome similarities
        this.speciate();

        // Cull weaker players within each species to preserve only the fittest individuals
        for(let i = 0;i<this.arrSpecies.length;i++) {
            this.arrSpecies[i].killHalf();
            //this.arrSpecies[i].killBelowAverage();
        }

        // This is the new generation of players
        this.players = [];

        // Add the best player 1 from the previous generation to the new generation unchanged
        this.players.push(new player());
        this.players[0].playerGenome = bestPlayer.playerGenome.deepClone();
        
        // Create new players based on species fitness to maintain diversity
        // The diversity is needed to prevent the population from converging to a local maximum
        for(let i = 0;i < this.arrSpecies.length;i++) {
            //My adaptation of explicit fitness sharing, higher average fitness means more babies
            let numberOfBabies = Math.floor((this.arrSpecies[i].getTotalSpeciesFitness()/oldTotalFitness)*this.originalNumOfPlayers)
            for(let ii = 0;ii < numberOfBabies;ii++) {
                this.players.push(this.arrSpecies[i].getBaby())
            }
        }

        // Fill the rest of the population with new players if necessary
        for(let i= this.players.length - 1;i<this.originalNumOfPlayers;i++) {
            this.players.push(new player())
            // if(Math.random() > 0.5)

            // Take the best player and mutate it
            this.players[i].playerGenome = bestPlayer.playerGenome.deepClone()
            this.players[i].playerGenome.mutate()
        }
        
        this.gameOver = false;
        this.deadCount = 0;
        
    }

    // Returns the player with the highest fitness in the population.
    getBestPlayer() {
        let bestPlayer = this.players[0];
        let bestFitness = 0;
        for(let i = 0;i < this.players.length;i++) {
            if(this.players[i].fitness > bestFitness) {
                bestFitness = this.players[i].fitness;
                bestPlayer = this.players[i];
            }
        }

        return bestPlayer;
    }

    getTotalFitness() {
        let total = 0;
        for(let i = 0;i < this.players.length;i++) {
            total += this.players[i].fitness;
        }

        return total;
    }

    // Groups players into species based on their genome similarities.
    // Each species contains players that are genetically similar to one another.
    speciate() {
        //Create new species with first player
        this.arrSpecies = []
        this.arrSpecies.push(new species());
        this.arrSpecies[0].addPlayer(this.players[0]);
        
        //For all of the players, iterate through species array until a species that they belong in is found, else create a new species

        for(let i = 0;i<this.players.length;i++) {

            let foundSpecies = false; //If the player fits in any of the species
            for(let ii=0;ii<this.arrSpecies.length;ii++) {
                if(this.arrSpecies[ii].belongsInSpecies(this.players[i])) {
                    
                    this.arrSpecies[ii].addPlayer(this.players[i]);
                    foundSpecies = true;
                    break;
                }
            }
            
            //Create new species
            if(!foundSpecies) {
                this.arrSpecies.push(new species())
                this.arrSpecies[this.arrSpecies.length - 1].addPlayer(this.players[i]);
                
            }

        }
    }
}