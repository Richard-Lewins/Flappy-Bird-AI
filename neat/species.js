class species{
    constructor(){
        this.speciatedPlayers = [];
        //coefficients for testing compatibility
        this.excessCoeff = 1;
        this.disjointCoeff = 1;
        this.weightDiffCoeff = 2;
        this.compatibilityThreshold = 1;
    }

    addPlayer(player){
        this.speciatedPlayers.push(player);
    }

    belongsInSpecies(player){
        let N = (this.speciatedPlayers[0].playerGenome.connectionGenes.length > player.playerGenome.connectionGenes.length) ? this.speciatedPlayers[0].playerGenome.connectionGenes.length : player.playerGenome.connectionGenes.length; 

        let excessGenes = this.speciatedPlayers[0].playerGenome.getExcessGenes(player.playerGenome);
        let disjointGenes = this.speciatedPlayers[0].playerGenome.getDisjointGenes(player.playerGenome);
        let weightDifference = this.speciatedPlayers[0].playerGenome.getWeightDifference(player.playerGenome)
        
        let compatibility = this.excessCoeff*(excessGenes/N) + this.disjointCoeff*(disjointGenes/N) + weightDifference;
        console.log(compatibility);
        if (compatibility < this.compatibilityThreshold )
            return true;
        else
            return false;
    }

    //Kill worse half of the species
    killHalf(){
        this.orderSpeciesByFitness();
        
        let median = this.speciatedPlayers.length/2;
        this.speciatedPlayers = this.speciatedPlayers.splice(0,median);
    }

    killBelowAverage(){
        let averageFitness = this.getTotalSpeciesFitness()/this.speciatedPlayers.length;

        let aboveAveragePlayers = this.speciatedPlayers.filter(Player => {Player.fitness > averageFitness});

        this.speciatedPlayers = aboveAveragePlayers;
    }

    getBaby(){
        let parent1 = this.speciatedPlayers[Math.floor(this.randomRange(0,this.speciatedPlayers.length))];
        let parent2 = this.speciatedPlayers[Math.floor(this.randomRange(0,this.speciatedPlayers.length))];
        let babyGenome = parent1.playerGenome.crossOver(parent2.playerGenome);
        let baby = new player();
        baby.playerGenome = babyGenome;
        baby.playerGenome.mutate();
        return baby;

    }

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

    randomRange(min,max){
        return Math.random()*(max-min) + min;
    }
}