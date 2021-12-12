var canvas = document.createElement('canvas');

canvas.id = "GenomeCanvas";
canvas.width = 500;
canvas.height = 500;
canvas.style.zIndex = 8;
canvas.style.position = "absolute";
canvas.style.border = "1px solid";


var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);
/*
cvs = document.getElementById("GenomeCanvas");

ctx = cvs.getContext("2d");

let testGenome = new genome(4,1);
testGenome.connectInputsAndOutputs();
ctx.fillStyle = "White";


//To Draw lines 
function draw_line(context, fromx, fromy, tox, toy,width,colour) {

    context.strokeStyle = colour;
    context.lineWidth = width

    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);


  }

//Sets up input,output and bias nodes x and y

let inputX =  20 + 30;
let outputX = canvas.width - 30 - 10;

function setup(){
//input and bias
    for(let i = 0; i <= testGenome.inputs;i++){
        testGenome.nodeGenes[i].y = (i+1) * (canvas.height/(testGenome.inputs + 2));
        testGenome.nodeGenes[i].x = inputX; //20 from edge
}

    for(let i = 0; i < testGenome.outputs;i++){
        testGenome.nodeGenes[i + testGenome.inputs + 1].y = (i+1) * (canvas.height/(testGenome.outputs + 1));
        testGenome.nodeGenes[i + testGenome.inputs + 1].x = outputX; 
    }
}

//Updates x and y of nodes in the middle
function update(){
    let layersInBetween = testGenome.layers - 1
    for(let i = testGenome.inputs+testGenome.outputs + 1;i < testGenome.nodeGenes.length;i++){

        //Number of layers between toNode and fromNode

        let x1 = testGenome.nodeGenes[i].oldConnection.fromNode.x;
        let x2 = testGenome.nodeGenes[i].oldConnection.toNode.x;
        let y1 = testGenome.nodeGenes[i].oldConnection.fromNode.y;
        let y2 = testGenome.nodeGenes[i].oldConnection.toNode.y;
        let gradient = (y2-y1)/(x2-x1);
        let offset = gradient*(-x1) + y1;

        let positionRatio = testGenome.nodeGenes[i].layer/(layersInBetween);
        let newX = (outputX-inputX) * positionRatio + inputX;
        testGenome.nodeGenes[i].x = (outputX-inputX) * positionRatio + inputX; //X coordinate in relation to old positions
        testGenome.nodeGenes[i].y = newX*gradient + offset; //(y1+y2)/2//positionRatio * y1 + 1/(layersInBetween + 1) *y2;
    }
}


function draw(){
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Connection Genes(lines)
    for(let i = 0; i < testGenome.connectionGenes.length;i++){
        if(testGenome.connectionGenes[i].enabled){ //Only Draw if enabled
            let fromX = testGenome.connectionGenes[i].fromNode.x;
            let fromY = testGenome.connectionGenes[i].fromNode.y;
            let toX = testGenome.connectionGenes[i].toNode.x;
            let toY = testGenome.connectionGenes[i].toNode.y;
    
            width = Math.abs(testGenome.connectionGenes[i].weight)*3 + 1; //Width proportional to weight
            colour = (testGenome.connectionGenes[i].weight >= 0)? "blue" : "red"; //Blue if positive weight, red if negative weight
            ctx.beginPath();
            draw_line(ctx,fromX,fromY,toX,toY,width,colour);
            ctx.stroke();
        
            }
        }

     //Circles: Nodes
    for(let i = 0; i < testGenome.nodeGenes.length;i++){
        ctx.beginPath();
        ctx.arc(testGenome.nodeGenes[i].x, testGenome.nodeGenes[i].y, 30, 0, 2 * Math.PI,false);
        ctx.strokeStyle = "black";
        ctx.fillStyle = "grey"
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();

    }

}

setup();

*/