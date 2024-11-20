class genome{
    constructor(inputs,outputs) {
        this.connectionGenes = [];
        this.nodeGenes = [];
        this.inputs = inputs;
        this.outputs = outputs;
        this.layers = 2; //Input and output by default
        this.orderedByLayers = [[]]; //Nodes ordered by layers
        this.currentNodeId = 0; //When adding new nodes, to ensure that each ID is different
        
        //Variables for drawing
        this.inputX = 0;
        this.outputX = 0;
        this.canvas = null;
        this.radius = 0;

        //Set up input and bias nodes--Bias node will have id of this.inputs
        for (let i = 0; i<=this.inputs;i++)
        {
            this.nodeGenes.push(new nodeGene(0,this.currentNodeId));
            this.currentNodeId++;
        }
        this.biasNode = this.inputs;
        this.nodeGenes[this.biasNode].inputValue = 1;

        for(let i = 0; i < this.outputs; i++) {
            this.nodeGenes.push(new nodeGene(1,this.currentNodeId));
            this.currentNodeId++;
        }

        
        this.connectInputsAndOutputs();
    }

    // For all of the nodes in the genome, basically let them get
    // a reference to all the connections that are connected to them
    updateNodeConnections() {
        for (var i = 0; i < this.nodeGenes.length; i++) { //clear the connections
            this.nodeGenes[i].connections = [];
          }
      
          //for each connectionGene
          for (var i = 0; i < this.connectionGenes.length; i++) { 
            // store the refereence the connectionGene in the node its coming from
            this.connectionGenes[i].fromNode.connections.push(this.connectionGenes[i]);
          }
    }

    //Connects inputs/bias and ouput nodes
    connectInputsAndOutputs() {
        // This.inputs + 1 to include the bias node
        for(let input = 0; input <= this.inputs;input++) {
            for(let output = 0; output<this.outputs;output++) {
                //Connect input and outputs with connectionGenes
                this.connectionGenes.push(new connectionGene(this.nodeGenes[input],this.nodeGenes[this.inputs + output + 1],randomRange(-1,1),this.getInnovationNumber(this.nodeGenes[input],this.nodeGenes[this.inputs + output])));
            }
        }

        this.updateNodeConnections();
    }

    //Adds Connection between two nodes
    addConnectionMutation() {
        if (this.connectionGenes.length >= this.maxConnections()) { //If no more possible connections, cannot add new one
            return;
        }
        
        let randomNode1 = Math.floor(Math.random()*(this.nodeGenes.length)); //Get two random nodes
        let randomNode2 = Math.floor(Math.random()*(this.nodeGenes.length));
        while(!this.nodesCanBeConnected(randomNode1,randomNode2)) { //If nodes can't be connected, get new node
            randomNode1 = Math.floor(Math.random()*(this.nodeGenes.length));
            randomNode2 = Math.floor(Math.random()*(this.nodeGenes.length));
        }
        //If Layer of randomNode1 > randomNode2 Create connectionGene with switch to and from nodes
        
        /* Add a connectionGene, but ensure that fromNode is in a lower layer than toNode */
        if (this.nodeGenes[randomNode1].layer > this.nodeGenes[randomNode2].layer) {
            var innovationNumber = this.getInnovationNumber(this.nodeGenes[randomNode2],this.nodeGenes[randomNode1]);
            this.connectionGenes.push(new connectionGene(this.nodeGenes[randomNode2],this.nodeGenes[randomNode1],Math.random()*2 - 1,innovationNumber));//Pushes with weight between -1 and 1
        }else{
            var innovationNumber = this.getInnovationNumber(this.nodeGenes[randomNode1],this.nodeGenes[randomNode2]);
            this.connectionGenes.push(new connectionGene(this.nodeGenes[randomNode1],this.nodeGenes[randomNode2],Math.random()*2 - 1,innovationNumber));//Pushes with weight between -1 and 1
        }

        this.updateNodeConnections();
    }

    // Returns the max connections this genome can have, given amount of nodes (Enabled and disabled)
    // This is if every node is connected to every other node in later layers
    maxConnections() {
        this.orderLayers();
        let numConnections = 0;

        for(let fromLayer = 0; fromLayer<this.layers - 1; fromLayer++) {
            for(let toLayer = fromLayer+1; toLayer<this.layers; toLayer++) {
            numConnections += this.orderedByLayers[fromLayer].length * this.orderedByLayers[toLayer].length;
        }}
        return numConnections;
    }

    // Tests too see if two Nodes Can be connected
    nodesCanBeConnected(node1,node2) {

        // If the this.nodes are in the same layer, they cannot be connected
        if (this.nodeGenes[node1].layer == this.nodeGenes[node2].layer) return false; 

        // If connection is already made between these two nodes
        for(let i = 0; i < this.connectionGenes.length;i++) {
            if (this.connectionGenes[i].toNode.nodeId == this.nodeGenes[node1].nodeId && this.connectionGenes[i].fromNode.nodeId == this.nodeGenes[node2].nodeId) {
                return false;
            }
            if (this.connectionGenes[i].toNode.nodeId == this.nodeGenes[node2].nodeId && this.connectionGenes[i].fromNode.nodeId == this.nodeGenes[node1].nodeId) {
                return false;
            }
        }

        return true;
    }

    // Adds a new node to the genome
    // It does this by by taking a random connection and splitting it into two connections
    // The new node is placed in a new layer between the two nodes
    addNodeMutation() {
        if(this.connectionGenes.length == 0) {
            //If no connections already, add one
            this.addConnectionMutation();
            return;
        }

        //Get random connection
        let randomConnectionGene = this.connectionGenes[Math.floor(Math.random()*this.connectionGenes.length)];

        //If random Connection is a connection  from the bias node, choose a new node
        while(randomConnectionGene.fromNode === this.nodeGenes[this.biasNode] || !randomConnectionGene.enabled) {
            randomConnectionGene = this.connectionGenes[Math.floor(Math.random()*this.connectionGenes.length)];
        }

        //Add node to nodeGenes Array
        let connectionFromLayer = randomConnectionGene.fromNode.layer;
        let connectionToLayer = randomConnectionGene.toNode.layer;
        let layer = connectionFromLayer + 1; // ConnectionFrom = 0,Layer=1,ConnectionTo=1

        // If no layers in between created, create new layer
        if (layer == connectionToLayer) {
            for(let i = 0; i<this.nodeGenes.length;i++) {
                if(this.nodeGenes[i].layer >= layer) {
                    this.nodeGenes[i].layer++; // increase layer of all other connections after current layer 
                }
            }
            this.layers++;
        }
        
        // Add nodeGene to gene Array
        let newNode = new nodeGene(layer,this.currentNodeId)
        newNode.oldConnection = randomConnectionGene;
        this.nodeGenes.push(newNode);
        this.currentNodeId++;
        
        //AddConnection: FromNode-NewNode (Weight of 1)
        this.connectionGenes.push(new connectionGene(randomConnectionGene.fromNode,newNode,1,this.getInnovationNumber(randomConnectionGene.fromNode,newNode)))
        
        //AddConnection: NewNode-ToNode (Weight of old connectionGene)
        this.connectionGenes.push(new connectionGene(newNode,randomConnectionGene.toNode,randomConnectionGene.weight,this.getInnovationNumber(newNode,randomConnectionGene)))

        //Connect Bias node to New Node
        this.connectionGenes.push(new connectionGene(this.nodeGenes[this.biasNode],newNode,0,this.getInnovationNumber(this.nodeGenes[this.biasNode],newNode)))

        //Disable old connection Gene
        randomConnectionGene.enabled = false;

        this.updateNodeConnections();
    }

    //If connection has been created before, get that innovation number, otherwise give a new unique innovation number
    getInnovationNumber(fromNode, toNode) {
        for(var i = 0; i< connectionHistory.length;i++) {
            if(connectionHistory[i].fromNode.nodeId == fromNode.nodeId && connectionHistory[i].toNode.nodeId == toNode.nodeId) 
                return connectionHistory[i].innovationNumber; //If new connection gene has same input/output genes as a previous connection, give the same innovation number
        }

        //else give unique innovation Number
        let uniqueInno = currentInnovationNumber;
        currentInnovationNumber++;

        //Add this connection to the connectionHistory
        connectionHistory.push(new connectionGene(fromNode,toNode,0,uniqueInno));
        return uniqueInno;
    }

    // Randomly mutates genome
    mutate() {
        let randomNum = Math.random();

        //Mutate All Weights of this genome
        if (randomNum < 0.8) {
            this.connectionGenes.forEach(gene => {
            gene.mutateWeight();
            });
        }

        // Sometimes add a new connection
        if (randomNum < 0.1) {
            this.addConnectionMutation();
        }

        // Sometimes add a new node (in a new layer)
        if (randomNum < 0.02) {
            this.addNodeMutation();
        }

    }

    /* Takes the inputs in arrInputs, feeds it through the neural network
       and returns the output of the network in an array. */
    feedForward(arrInputs) {
        // set values of input nodes
        for(let i = 0;i<this.inputs;i++) { 
            this.nodeGenes[i].inputValue = arrInputs[i];
        }
        // split nodes into layers
        this.orderLayers();

        // send output through connections
        for(let i = 0;i < this.orderedByLayers.length - 1;i++) {
            for(let ii = 0;ii < this.orderedByLayers[i].length;ii++) {
                this.orderedByLayers[i][ii].sendOutput();
            }
        }
        let outputArray = []

        // Assign Outputs as variable to be returned
        for(let i = 0;i < this.orderedByLayers[this.orderedByLayers.length -1].length;i++) {
            outputArray.push(this.sigmoid(this.orderedByLayers[this.orderedByLayers.length - 1][i].inputValue));
        }

        return outputArray;
    }

    // "Squishes" values into given ranges
    sigmoid(x) {
        return 1.0 / (1.0 + Math.pow(Math.E, -4.9 * x));
    }

    //Order Nodes into its layers
    orderLayers() {
        this.orderedByLayers = [];
        for(let i = 0; i < this.layers; i++) {
            let layer = [];
            for(let ii = 0; ii < this.nodeGenes.length;ii++) {
                if(this.nodeGenes[ii].layer == i) {
                    layer.push(this.nodeGenes[ii]);
                }
            }
            this.orderedByLayers.push(layer);
        }
    }

    /*
      Creates a deep copy of the genome, duplicating all nodes and connections.
      
      - **Step 1**: Initializes a new genome with the same inputs and outputs.
      - **Step 2**: Copies each node from `nodeGenes` into the new genome, maintaining node properties.
      - **Step 3**: Recreates connections:
         - Finds matching nodes in the new genome for each connection.
         - Reconstructs connections using the new nodes, preserving weights, states, and innovation numbers.
      - **Step 4**: Updates each node's `oldConnection` to match the cloned connections.
      - **Step 5**: Copies metadata (layers, IDs) and ensures the bias node is set correctly.
      - **Step 6**: Updates connections in the new genome for consistency.
      
      Returns a fully independent clone of the original genome.
     */

    deepClone() {
        let newGenome = new genome(this.inputs,this.outputs);
        newGenome.nodeGenes = [];
        newGenome.connectionGenes = [];
        //Add nodeGenes array to new genome
        for(let nodeGene = 0; nodeGene < this.nodeGenes.length; nodeGene++) {
            newGenome.nodeGenes.push(this.nodeGenes[nodeGene].shallowClone());
        }

        // TODO: Maybe there's a more effecient way than n^3
        for(let ngNodeIndex1 = 0; ngNodeIndex1 < newGenome.nodeGenes.length; ngNodeIndex1++) {
            let ngNodeFrom = newGenome.nodeGenes[ngNodeIndex1];
            //For each of the connections connected to each of the nodes
            for(let ngConnIndex = 0; ngConnIndex < ngNodeFrom.connections.length; ngConnIndex++) {
                let ngConnection = ngNodeFrom.connections[ngConnIndex];

                //Find new nodeGene that matches fromGenome of the connection, and create connection using that nodeGene
                let toNode = null;
                for(let ngNodeIndex2=0; ngNodeIndex2 < newGenome.nodeGenes.length; ngNodeIndex2++) {
                    if (newGenome.nodeGenes[ngNodeIndex2].nodeId == ngConnection.toNode.nodeId) {
                        toNode = newGenome.nodeGenes[ngNodeIndex2]
                    }
                }
                let newConnection = new connectionGene(ngNodeFrom,toNode,ngConnection.weight,ngConnection.innovationNumber);
                newConnection.enabled = ngConnection.enabled;
                newGenome.connectionGenes.push(newConnection);
            }
        }

        //Set oldConnection of the each node in newGenome to be the same as this oldconnection
        for(let i = 0;i < newGenome.nodeGenes.length;i++) {
            for(let ii = 0;ii < newGenome.connectionGenes.length;ii++) {
                if(newGenome.connectionGenes[ii].innovationNumber == this.nodeGenes[i].oldConnection.innovationNumber) {
                    newGenome.nodeGenes[i].oldConnection = newGenome.connectionGenes[ii];
                }
            }
        }
        newGenome.layers = this.layers;
        newGenome.currentNodeId = this.currentNodeId;
        //Bias node should always be one
        newGenome.nodeGenes[this.biasNode].weight = 1;
        newGenome.updateNodeConnections();
        return newGenome;
    }

    // Returns total weight difference between thisgenome and genome2
    getWeightDifference(genome2) {
        let genome1Total = 0;
        for(let i = 0;i < this.connectionGenes.length;i++) {
            genome1Total += this.connectionGenes[i].weight;
        }
        let genome1Average = genome1Total/this.connectionGenes.length;

        let genome2Total = 0;
        for(let i = 0;i < genome2.connectionGenes.length;i++) {
            genome2Total += genome2.connectionGenes[i].weight;
        }
        let genome2Average = genome2Total/genome2.connectionGenes.length;

        return Math.abs(genome1Average-genome2Average);
    } 

    /* Returns the number of excess genes between this genome and another genome.
      Excess genes are genes that are in genome1 but not in genome2, or vice versa.
    */
    getExcessGenes(genome2) {

        // Order the connection genes of both genomes by their innovation number (ascending).
        // This ensures that the genes are in the same order, based on the historical sequence of mutations.
        this.orderConnectionGenes();
        genome2.orderConnectionGenes();
        let excessGenes = 0;

        // Basically iterating down the innovation number of the higher genome, and counting the excess genes
        // until the innovation number of the lower genome is reached.

        // if this genome has the highest innovation number
        if(this.connectionGenes[this.connectionGenes.length - 1].innovationNumber > genome2.connectionGenes[genome2.connectionGenes.length - 1].innovationNumber) {
            for(let i = this.connectionGenes.length - 1;i >= 0;i--) {
                //Increase excessGenes until innovationNumber of genome2 found that is lower or equal to genome2 max

                if(this.connectionGenes[i].innovationNumber <= genome2.connectionGenes[genome2.connectionGenes.length - 1].innovationNumber) {
                    break;
                }
                excessGenes++;
                
            }

        }
        
        // if genome2 has the highest innovation number
        if(this.connectionGenes[this.connectionGenes.length - 1].innovationNumber < genome2.connectionGenes[genome2.connectionGenes.length - 1].innovationNumber) {
            for(let i = genome2.connectionGenes.length - 1;i >= 0;i--) {
                //Increase excessGenes until innovationNumber of genome2 found that is lower or equal to genome2 max
                
                if(genome2.connectionGenes[i].innovationNumber <= this.connectionGenes[this.connectionGenes.length - 1].innovationNumber) {
                    break;
                }
                excessGenes++;
                
            }
        }
        return excessGenes;
    }

    /* Returns the number of disjoint genes - 
       Number of genes that exist on both genomes but do not match up
    */
    getDisjointGenes(genome2) {
        // Order the connection genes of both genomes by their innovation number (ascending).
        this.orderConnectionGenes();
        genome2.orderConnectionGenes();
        
        let genome1Position = 0;
        let genome2Position = 0;
        let disjointGenes = 0;
        
        // Get the minimum innovation number of the last gene of both genomes
        // Almost like the last innovation that both genomes share
        let endInnovationNumber = Math.min(this.connectionGenes[this.connectionGenes.length - 1].innovationNumber,
                                           genome2.connectionGenes[genome2.connectionGenes.length - 1].innovationNumber)

        while(true) {
            if(this.connectionGenes[genome1Position].innovationNumber > genome2.connectionGenes[genome2Position].innovationNumber) {
                    disjointGenes++;
                    genome2Position++;
            }else if(this.connectionGenes[genome1Position].innovationNumber < genome2.connectionGenes[genome2Position].innovationNumber) {
                    disjointGenes++;
                    genome1Position++;
            }else{
                    genome1Position++;
                    genome2Position++;
            }

            if(this.connectionGenes[genome1Position].innovationNumber >= endInnovationNumber && genome2.connectionGenes[genome2Position].innovationNumber >= endInnovationNumber)
                return disjointGenes;
        }


    }

    // OrderConnectionGene array in ascending comparing by innovation numbers
    orderConnectionGenes() {
        this.connectionGenes.sort((a,b) => (a.innovationNumber > b.innovationNumber) ? 1 : ((b.innovationNumber> a.innovationNumber) ? -1 : 0))
    }

    // Assuming that this is the more fit Genome parent1 = this,parent2 = parentGenome2
    crossOver(parentGenome2) {

        // TODO: Change from doing n^2 check of connections to sorting and then 2 pointers
        let babyGenome = this.deepClone();

        // Keep the topology of the most fit parent(this), but 50% use weights of parent1, 50% parent2, if connection shares innovationNumber
        for(let babyConnection = 0; babyConnection < babyGenome.connectionGenes.length; babyConnection++) {

            //See if parentGenome2 has matching connection
            for(let parentConnection = 0; parentConnection < parentGenome2.connectionGenes.length; parentConnection++) {
                if(babyGenome.connectionGenes[babyConnection].innovationNumber == parentGenome2.connectionGenes[parentConnection].innovationNumber) {
                    let rand = Math.random();
                    if (rand >0.5) {
                        babyGenome.connectionGenes[babyConnection].weight = parentGenome2.connectionGenes[parentConnection].weight;
                    }
                }
            }
        }

        return babyGenome;
    }



    /* The following code is used for drawing the genome to the screen */

    //Draws a line between two points
    draw_line(context, fromx, fromy, tox, toy,width,colour) {

        context.strokeStyle = colour;
        context.lineWidth = width
    
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
      }

    //Set up the canvas and node positions/size
    setup(canvas,radius) {
        this.canvas = canvas;
        this.radius = radius;
        this.inputX =  20 + radius; //20 From Front
        this.outputX = canvas.width - radius - 20; //20 From Back
        
    //input and bias
        for(let i = 0; i <= this.inputs;i++) {
            this.nodeGenes[i].y = (i+1) * (canvas.height/(this.inputs + 2));
            this.nodeGenes[i].x = this.inputX; //20 from edge
        }
        
        for(let i = 0; i < this.outputs;i++) {
            this.nodeGenes[i + this.inputs + 1].y = (i+1) * (canvas.height/(this.outputs + 1));
            this.nodeGenes[i + this.inputs + 1].x = this.outputX; 
        }
    }     

    //Draws the genome to the screen
    draw() {
        let ctx = this.canvas.getContext("2d");
        //Update X and Y coordinates of nodeGenes
        let layersInBetween = this.layers - 1
        for(let i = this.inputs+this.outputs + 1;i < this.nodeGenes.length;i++) {
    
            //Number of layers between toNode and fromNode

            let x1 = this.nodeGenes[i].oldConnection.fromNode.x;
            let x2 = this.nodeGenes[i].oldConnection.toNode.x;
            let y1 = this.nodeGenes[i].oldConnection.fromNode.y;
            let y2 = this.nodeGenes[i].oldConnection.toNode.y;
            let gradient = (y2-y1)/(x2-x1);
            let constant = gradient*(-x1) + y1; // Create equation for the lines using Y - Y1 = m(X-X1)
    
            let positionRatio = this.nodeGenes[i].layer/(layersInBetween);
            let newX = (this.outputX-this.inputX) * positionRatio + this.inputX;
            this.nodeGenes[i].x = (this.outputX-this.inputX) * positionRatio + this.inputX; //X coordinate in relation to old positions
            this.nodeGenes[i].y = newX*gradient + constant; //Y coordinate by using equation above
        }

        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        //Connection Genes(lines)
        for(let i = 0; i < this.connectionGenes.length;i++) {
            if(this.connectionGenes[i].enabled) { //Only Draw if enabled
                let fromX = this.connectionGenes[i].fromNode.x;
                let fromY = this.connectionGenes[i].fromNode.y;
                let toX = this.connectionGenes[i].toNode.x;
                let toY = this.connectionGenes[i].toNode.y;
    
                let width = Math.abs(this.connectionGenes[i].weight)*3 + 1; //Width proportional to weight
                let colour = (this.connectionGenes[i].weight >= 0)? "blue" : "red"; //Blue if positive weight, red if negative weight
                ctx.beginPath();
                this.draw_line(ctx,fromX,fromY,toX,toY,width,colour);
                ctx.stroke();
        
            }
        }

        //Circles: Nodes
        for(let i = 0; i < this.nodeGenes.length;i++) {
            ctx.beginPath();
            ctx.arc(this.nodeGenes[i].x, this.nodeGenes[i].y, this.radius, 0, 2 * Math.PI,false);
            ctx.strokeStyle = "black";
            ctx.fillStyle = "grey"
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.stroke();

        }
    }
}