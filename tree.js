function Tree() {
    this.root = null;
}

Tree.prototype.listNode = [];

Tree.prototype.drawListNode = function() {
    let yPos = 50;
    for(let i=this.listNode.length-1; i>=0; i--) {
        var value = this.listNode[i];
        ellipse(50, yPos, 30, 30);
        textAlign(CENTER);
        fill(0,0,0);
        text(value, 50, yPos);
        yPos += 40;
    }
}

Tree.prototype.traverse = function() {
    this.root.reset();
    this.root.visit();
}

Tree.prototype.search = function(val) {
    var result = this.root.search(val);
    return result;
}

Tree.prototype.addValue = function(val) {
    var node = new Node(val);
    if (this.root == null) {
        this.root = node;
    } else {
        this.root.addNode(node);
    }
}

Tree.prototype.drawTree = function() {
    this.root.drawNode();
}



