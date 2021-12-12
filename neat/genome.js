class genome{
    constructor(inputs,outputs){
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

        for(let i = 0; i < this.outputs; i++){
            this.nodeGenes.push(new nodeGene(1,this.currentNodeId));
            this.currentNodeId++;
        }

        
        this.connectInputsAndOutputs();
    }

    updateNodeConnections(){
        for (var i = 0; i < this.nodeGenes.length; i++) { //clear the connections
            this.nodeGenes[i].connections = [];

          }
      
          for (var i = 0; i < this.connectionGenes.length; i++) { //for each connectionGene
            this.connectionGenes[i].fromNode.connections.push(this.connectionGenes[i]); //add it to node
          }
    }

    //Get a random number between min(inclusive) and max(exclusive)
    randomRange(min,max){
        return Math.random()*(max-min) + min;
    }

    //Connects inputs/bias and ouput nodes
    connectInputsAndOutputs(){
        for(let input = 0; input <= this.inputs;input++){
            for(let output = 0; output<this.outputs;output++){
                //Connect input and outputs with connectionGenes
                this.connectionGenes.push(new connectionGene(this.nodeGenes[input],this.nodeGenes[this.inputs + output + 1],this.randomRange(-1,1),this.getInnovationNumber(this.nodeGenes[input],this.nodeGenes[this.inputs + output])));
            }
        }
        //connects bias node

        this.updateNodeConnections();
    }

    //Adds Connection between two nodes
    addConnectionMutation(){
        if (this.connectionGenes.length >= this.maxConnections()){ //If no more possible connections, cannot add new one
            console.log("Max Connections Reached...")
            return;
        }
        
        let randomNode1 = Math.floor(Math.random()*(this.nodeGenes.length)); //Get two random nodes
        let randomNode2 = Math.floor(Math.random()*(this.nodeGenes.length));
        while(this.nodesCannotBeConnected(randomNode1,randomNode2)){ //If nodes can't be connected, get new node
            randomNode1 = Math.floor(Math.random()*(this.nodeGenes.length));
            randomNode2 = Math.floor(Math.random()*(this.nodeGenes.length));
        }
        //If Layer of randomNode1 > randomNode2 Create connectionGene with switch to and from nodes
        
        if (this.nodeGenes[randomNode1].layer > this.nodeGenes[randomNode2].layer) {
            var innovationNumber = this.getInnovationNumber(this.nodeGenes[randomNode2],this.nodeGenes[randomNode1]);
            this.connectionGenes.push(new connectionGene(this.nodeGenes[randomNode2],this.nodeGenes[randomNode1],Math.random()*2 - 1,innovationNumber));//Pushes with weight between -1 and 1
        }else{
            var innovationNumber = this.getInnovationNumber(this.nodeGenes[randomNode1],this.nodeGenes[randomNode2]);
            this.connectionGenes.push(new connectionGene(this.nodeGenes[randomNode1],this.nodeGenes[randomNode2],Math.random()*2 - 1,innovationNumber));//Pushes with weight between -1 and 1
        }

        this.updateNodeConnections();
    }

    //Returns the max connections this genome can have, given amount of nodes (Enabled and disabled)
    maxConnections(){
        this.orderLayers();
        let numConnections = 0;

        for(let i = 0;i<this.layers - 1;i++){
            for(let ii = i+1;ii<this.layers;ii++){
            numConnections += this.orderedByLayers[i].length * this.orderedByLayers[ii].length;
        }}
        console.log(numConnections);
        return numConnections;
    }

    //Tests too see if two Nodes Can be connected
    nodesCannotBeConnected(node1,node2){

        // if the this.nodes are in the same layer or n1 is layer after n2
        if (this.nodeGenes[node1].layer == this.nodeGenes[node2].layer) return true; 

        //If connection is already made between these two nodes

        for(let i = 0; i < this.connectionGenes.length;i++){
            if (this.connectionGenes[i].toNode.nodeId == this.nodeGenes[node1].nodeId && this.connectionGenes[i].fromNode.nodeId == this.nodeGenes[node2].nodeId){
                return true;
            }
            if (this.connectionGenes[i].toNode.nodeId == this.nodeGenes[node2].nodeId && this.connectionGenes[i].fromNode.nodeId == this.nodeGenes[node1].nodeId){
                return true;
            }
        }

        return false;
    }

    addNodeMutation(){
        if(this.connectionGenes.length == 0){
            //If no connections already, add one
            this.addConnectionMutation();
            return;
        }

        //Get random connection
        let randomConnectionGene = this.connectionGenes[Math.floor(Math.random()*this.connectionGenes.length)];

        //If random Connection is a connection  from the bias node, choose a new node
        while(randomConnectionGene.fromNode === this.nodeGenes[this.biasNode] || !randomConnectionGene.enabled){
            randomConnectionGene = this.connectionGenes[Math.floor(Math.random()*this.connectionGenes.length)];
        }

        //Add node to nodeGenes Array
        let connectionFromLayer = randomConnectionGene.fromNode.layer;
        let connectionToLayer = randomConnectionGene.toNode.layer;
        let layer = connectionFromLayer + 1; //ConnectionFrom = 0,Layer=1,ConnectionTo=1

        //If no layers in between created, create new layer
        if (layer == connectionToLayer){
            for(let i = 0; i<this.nodeGenes.length;i++){
                if(this.nodeGenes[i].layer >= layer){
                    this.nodeGenes[i].layer++; //increase layer of all other connections after current layer 
                }
            }
            this.layers++;
        }
        
        //Add nodeGene to gene Array
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
    getInnovationNumber(fromNode, toNode){
        for(var i = 0; i< connectionHistory.length;i++){
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

    //Ranomly mutates genome
    mutate(){
        let randomNum = Math.random();

        //Mutate All Weights of this genome
        if (randomNum < 0.8){
            this.connectionGenes.forEach(gene => {
            gene.mutateWeight();
            });
        }

        //Add random connection
        if (randomNum < 0.1){
            this.addConnectionMutation();
        }

        if (randomNum < 0.02){
            this.addNodeMutation();
        }

    }

    feedForward(arrInputs){
        for(let i = 0;i<this.inputs;i++){ //set values of input nodes
            this.nodeGenes[i].inputValue = arrInputs[i];
        }
        this.orderLayers();
        for(let i = 0;i < this.orderedByLayers.length - 1;i++){
            for(let ii = 0;ii < this.orderedByLayers[i].length;ii++){
                this.orderedByLayers[i][ii].sendOutput();
            }
        }
        let outputArray = []
        //Assign Outputs as variable to be returned
        for(let i = 0;i < this.orderedByLayers[this.orderedByLayers.length -1].length;i++){
            outputArray.push(this.sigmoid(this.orderedByLayers[this.orderedByLayers.length - 1][i].inputValue));
        }

        return outputArray;

    }

    //Activation Function
    sigmoid(x){
        return 1.0 / (1.0 + Math.pow(Math.E, -4.9 * x));
    }
    //Order Nodes into its layers
    orderLayers(){
        this.orderedByLayers = [];
        for(let i = 0; i < this.layers; i++){
            let layer = [];
            for(let ii = 0; ii < this.nodeGenes.length;ii++){
                if(this.nodeGenes[ii].layer == i){
                    layer.push(this.nodeGenes[ii]);
                }
            }
            this.orderedByLayers.push(layer);
        }
    }

    clone(){
        let newGenome = new genome(this.inputs,this.outputs);
        newGenome.nodeGenes = [];
        newGenome.connectionGenes = [];
        //Add nodeGenes array to new genome
        for(let i = 0;i < this.nodeGenes.length;i++){
            newGenome.nodeGenes.push(this.nodeGenes[i].clone());
        }

        for(let i = 0;i < this.nodeGenes.length;i++){
            //For each of the connections connected to each of the nodes
            for(let ii = 0; ii < newGenome.nodeGenes[i].connections.length;ii++){
                //Find new nodeGene that matches fromGenome of the connection, and create connection using that nodeGene
                let toNode = null;
                for(let iii=0;iii < newGenome.nodeGenes.length; iii++){
                    if (newGenome.nodeGenes[iii].nodeId == newGenome.nodeGenes[i].connections[ii].toNode.nodeId){
                        toNode = newGenome.nodeGenes[iii]
                    }
                }
                let newConnection = new connectionGene(newGenome.nodeGenes[i],toNode,newGenome.nodeGenes[i].connections[ii].weight,newGenome.nodeGenes[i].connections[ii].innovationNumber);
                newConnection.enabled = newGenome.nodeGenes[i].connections[ii].enabled;
                newGenome.connectionGenes.push(newConnection);
            }
        }
        newGenome.layers = this.layers;
        newGenome.currentNodeId = this.currentNodeId;
        return newGenome;
        
    }


    //Genome drawing
    draw_line(context, fromx, fromy, tox, toy,width,colour) {

        context.strokeStyle = colour;
        context.lineWidth = width
    
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
    
    
      }

     
    setup(canvas,radius){
        this.canvas = canvas;
        this.radius = radius;
        this.inputX =  20 + radius; //20 From Front
        this.outputX = canvas.width - radius - 20; //20 From Back
        
    //input and bias
        for(let i = 0; i <= this.inputs;i++){
            this.nodeGenes[i].y = (i+1) * (canvas.height/(this.inputs + 2));
            this.nodeGenes[i].x = this.inputX; //20 from edge
        }
        
        for(let i = 0; i < this.outputs;i++){
            this.nodeGenes[i + this.inputs + 1].y = (i+1) * (canvas.height/(this.outputs + 1));
            this.nodeGenes[i + this.inputs + 1].x = this.outputX; 
        }
    }     

    draw(){
        let ctx = this.canvas.getContext("2d");
        //Update X and Y coordinates of nodeGenes
        let layersInBetween = this.layers - 1
        for(let i = this.inputs+this.outputs + 1;i < this.nodeGenes.length;i++){
    
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
        for(let i = 0; i < this.connectionGenes.length;i++){
            if(this.connectionGenes[i].enabled){ //Only Draw if enabled
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
        for(let i = 0; i < this.nodeGenes.length;i++){
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