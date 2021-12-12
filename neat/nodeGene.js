class nodeGene{
    constructor(layer,nodeId){
        this.layer = layer; //To prevent recursion
        this.nodeId = nodeId;
        this.inputValue = 0; //Sum of all inputs
        this.connections = []; //List of connections that come our of this node (OutputConnections)

        //For drawing Genome to screen
        this.oldConnection = connectionGene;
        this.x = 0;
        this.y = 0;
    }

    //Activation Function
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
    //Todo: Clone and isConnectedTo
}