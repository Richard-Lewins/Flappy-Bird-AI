/* Represents a single connection between two nodes in a neural network.
   Each connection includes its weight, whether it's enabled, and an innovation number 
   to uniquely identify it for evolutionary purposes in a NEAT algorithm.
*/

class connectionGene{
    constructor(fromNode,toNode,weight,innovationNumber) {
        this.fromNode = fromNode;
        this.toNode = toNode;
        this.weight = weight;
        this.enabled = true;
        this.innovationNumber = innovationNumber;
    }

    


    //Returns Random Number between -1 and 1, but centred around 0(For slightly changing weights)
    centeredRandom() {
        let rand = 0; //Betweeen 0 and 1
        for(let i=0;i<6;i++) {
            rand += Math.random();
        }

        rand /= 6;

        return rand*2 - 1 //Between -1 and 1
    }

    //Mutates the weight of this ConnectionGene
    mutateWeight() {
        var changeType = Math.random();

        if (changeType < 0.1) { //Completely Change at Random Weight
            this.weight = randomRange(-1,1);
        }else{
            this.weight += this.centeredRandom()/40
        }

        //keep this.weight between bounds
         if (this.weight > 1) {
            this.weight = 1;
        }
        if (this.weight < -1) {
            this.weight = -1;
        }
    }

    //ToDo: areTwoNodesConnected() -Check if two nodes have connection in between

}