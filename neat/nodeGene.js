/* Represents a single node (or neuron) in a neural network.
   Each node is part of a specific layer and has an associated ID. 
   It maintains its input value, outgoing connections, and handles the activation of its output.
   This is a core component of the NEAT algorithm's genome structure.
*/

class nodeGene{
    constructor(layer,nodeId){
        this.layer = layer; //To prevent recursion
        this.nodeId = nodeId;
        this.inputValue = 0; //Sum of all inputs
        this.connections = []; //List of connections that come out of this node (Initialized with genome.updateNodeConnections())

        //For drawing Genome to screen
        this.oldConnection = connectionGene;
        this.x = 0;
        this.y = 0;
    }

    // Activation Function to normalize the input value
    sigmoid(x){
        return 1.0 / (1.0 + Math.pow(Math.E, -4.9 * x));
    }

    //Sends Output of this node through connectionGene to All genes connected to
    sendOutput(){
        let activatedValue = this.inputValue;
        if(this.layer != 0){ //Don't sigmoid input nodes
            activatedValue = this.sigmoid(this.inputValue);
        }

        for(var i = 0; i<this.connections.length;i++){
            if(this.connections[i].enabled){
                this.connections[i].toNode.inputValue += activatedValue * this.connections[i].weight;

            }
        }
    }
    
    /* Clones the node, but not the connections (this is a job for the genome) */
    shallowClone(){
        let newNode = new nodeGene(this.layer,this.nodeId);
        newNode.connections = this.connections;
        return newNode;
    }
}