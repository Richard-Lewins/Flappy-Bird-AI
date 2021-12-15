class population{
    constructor(numOfPlayers){
        this.players = [];
        this.arrSpecies = [];
        this.originalNumOfPlayers = numOfPlayers
        this.deadCount = 0;
        this.gameOver = false;
        this.generationNumber = 1;

        
        
        for(let i = 0;i<numOfPlayers;i++){
            this.players.push(new player());
        }
        this.bestPlayer = this.players[0];
        
    }

    run(){
        for(let i = 0;i<this.players.length;i++){
            if(this.players[i].alive){
                this.players[i].getInputs();
                this.players[i].getOutputs();
                this.players[i].processOutputs();
                this.players[i].updatePlayer();
                this.players[i].drawPlayer(ctx,imgBird);

                if(this.players[i].isPlayerDead()){
                    this.deadCount++;
                }
            }
        }

        if(this.deadCount == this.players.length){
            this.gameOver = true;
        }
    }

    
    restart(){
        this.generationNumber++;

        let oldTotalFitness = this.getTotalFitness();
        let bestPlayer = this.getBestPlayer();

        this.speciate();


        for(let i = 0;i<this.arrSpecies.length;i++){
            this.arrSpecies[i].killHalf();
            //this.arrSpecies[i].killBelowAverage();
        }


        this.players = [];

        this.players.push(new player());
        this.players[0].playerGenome = bestPlayer.playerGenome.clone();

        for(let i = 0;i < this.arrSpecies.length;i++){
            //My adaptation of explicit fitness sharing, higher average fitness means more babies
            let numberOfBabies = Math.floor((this.arrSpecies[i].getTotalSpeciesFitness()/oldTotalFitness)*this.originalNumOfPlayers)
            for(let ii = 0;ii < numberOfBabies;ii++){
                this.players.push(this.arrSpecies[i].getBaby())
            }
        }

        for(let i= this.players.length - 1;i<this.originalNumOfPlayers;i++){
            this.players.push(new player())
            this.players[i].playerGenome = bestPlayer.playerGenome.clone()
            this.players[i].playerGenome.mutate()
        }
        
        this.gameOver = false;
        this.deadCount = 0;
        
        
    }

    
    getBestPlayer(){
        let bestPlayer = this.players[0];
        let bestFitness = 0;
        for(let i = 0;i < this.players.length;i++){
            if(this.players[i].fitness > bestFitness){
                bestFitness = this.players[i].fitness;
                bestPlayer = this.players[i];
            }
        }

        return bestPlayer;
    }

    getTotalFitness(){
        let total = 0;
        for(let i = 0;i < this.players.length;i++){
            total += this.players[i].fitness;
        }

        return total;
    }

    speciate(){
        //Create new species with first player
        this.arrSpecies = []
        this.arrSpecies.push(new species());
        this.arrSpecies[0].addPlayer(this.players[0]);
        
        //For all of the players, iterate through species array until a species that they belong in is found, else create a new species

        for(let i = 0;i<this.players.length;i++){

            let foundSpecies = false; //If the player fits in any of the species
            for(let ii=0;ii<this.arrSpecies.length;ii++){
                if(this.arrSpecies[ii].belongsInSpecies(this.players[i])){
                    
                    this.arrSpecies[ii].addPlayer(this.players[i]);
                    foundSpecies = true;
                    break;
                }
            }
            
            //Create new species
            if(!foundSpecies){
                this.arrSpecies.push(new species())
                this.arrSpecies[this.arrSpecies.length - 1].addPlayer(this.players[i]);
                
            }

        }

    }
}