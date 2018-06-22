var tree;
var listOfNodes;

function setup() {
    createCanvas(windowWidth, windowHeight);
    generateNewTree();
}

function draw() {
    background(255);
    tree.drawListNode();
    tree.traverse(); // the problem.. must reset the entire floor which is object
    tree.drawTree();
}

function windowResized() {
    // responsie to window size
    resizeCanvas(windowWidth, windowHeight);
    tree.root.xPos = windowWidth / 2;
}

function mouseClicked() {
    // user interaction
    if(listOfNodes.length ==0 ){
        generateNewTree();
    } else {
        tree.addValue(listOfNodes.pop());
    }
}

function generateNewTree() {
    // generate new tree
    tree = new Tree();
    for(var i=0; i<20; i++) {
        let value = Math.floor((Math.random() * 50) + 1);
        tree.listNode.push(value);
        // tree.addValue(value);
        // set list of nodes that will be added
    }
    listOfNodes = tree.listNode;
    console.log(listOfNodes);

    tree.addValue(listOfNodes.pop());
    // set floor by traversing the tree
    tree.traverse();
}