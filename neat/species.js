class species{
    constructor(){
        this.speciatedPlayers = [];
        //coefficients for testing compatibility
        this.excessCoeff = 1;
        this.disjointCoeff = 1;
        this.weightDiffCoeff = 2;
        this.compatibilityThreshold = 1;
    }

    // Add a player to this species
    addPlayer(player){
        this.speciatedPlayers.push(player);
    }

    // NEAT Algorithm speciation from Kenneth O. Stanley and Risto Miikkulainen

    /**
     * Determines if a given player belongs to this species based on compatibility metrics.
     * Uses the NEAT algorithm for calculating compatibility between genomes.
     * Compatibility is calculated as a weighted combination of:
     * - Excess genes - Number of genes that exist on one genome but do not exist on the other
     * - Disjoint genes - Number of genes that exist on both genomes but do not match up
     * - Average weight differences
     */
    
    belongsInSpecies(player){
    
        // Get the length of the largest genome
        let N = Math.max(this.speciatedPlayers[0].playerGenome.connectionGenes.length, player.playerGenome.connectionGenes.length);

        let excessGenes = this.speciatedPlayers[0].playerGenome.getExcessGenes(player.playerGenome);
        let disjointGenes = this.speciatedPlayers[0].playerGenome.getDisjointGenes(player.playerGenome);
        let weightDifference = this.speciatedPlayers[0].playerGenome.getWeightDifference(player.playerGenome)
        
        let compatibility = this.excessCoeff*(excessGenes/N) + this.disjointCoeff*(disjointGenes/N) + weightDifference;
        if (compatibility < this.compatibilityThreshold )
            return true;
        else
            return false;
    }

    // Kill worse half of the species
    killHalf(){
        this.orderSpeciesByFitness();
        
        let median = this.speciatedPlayers.length/2;
        this.speciatedPlayers = this.speciatedPlayers.splice(0,median);
    }

    // Kill below average players (Not used in this implementation)
    killBelowAverage(){
        let averageFitness = this.getTotalSpeciesFitness()/this.speciatedPlayers.length;

        let aboveAveragePlayers = this.speciatedPlayers.filter(Player => {Player.fitness > averageFitness});

        this.speciatedPlayers = aboveAveragePlayers;
    }

    // Get a baby from two random parents in the species
    getBaby(){
        let parent1 = this.speciatedPlayers[Math.floor(randomRange(0,this.speciatedPlayers.length))];
        let parent2 = this.speciatedPlayers[Math.floor(randomRange(0,this.speciatedPlayers.length))];
        let babyGenome = parent1.playerGenome.crossOver(parent2.playerGenome);
        let baby = new player();
        baby.playerGenome = babyGenome;
        baby.playerGenome.mutate();
        return baby;

    }

    // Get the total fitness of the species
    getTotalSpeciesFitness(){
        let total = 0;

        for(let i = 0;i < this.speciatedPlayers.length;i++){
            total += this.speciatedPlayers[i].fitness;
        }

        return total;
    }

    //Highest Fitness first
    orderSpeciesByFitness(){
        this.speciatedPlayers.sort((a,b) => (a.fitness < b.fitness) ? 1 : ((b.fitness < a.fitness) ? -1 : 0))
    }
}