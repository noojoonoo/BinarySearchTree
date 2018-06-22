Node.prototype.search = function(val) {
    if(this.value == val) {
        return this;
    } else if(val < this.value && this.left != null) {
        return this.left.search(val);
    } else if(val > this.value && this.right != null) {
        return this.right.search(val);
    }
}

Node.prototype.floor = {};

Node.prototype.visit = function() {
    if(this.left != null) {
        this.left.visit();
    }
    if(!this.floor[this.ancestors.length]){
        this.floor[this.ancestors.length] = [this];
    } else {
        if(!this.floor[this.ancestors.length].includes(this)) {
            this.floor[this.ancestors.length].push(this);
        }
    }
    if(this.right != null) {
        this.right.visit();
    }
}

Node.prototype.reset = function() {
    if(this.left != null) {
        this.left.reset();
    }
    for (let key in this.floor) {
        this.floor[key] = [];
    }
    if(this.right != null) {
        this.right.reset();
    }
}

Node.prototype.addNode = function(node) {
    if(node.value < this.value) {
        if(this.left == null) {
            node.ancestors.push(this);
            this.left = node;
        }
        else {
            node.ancestors.push(this);
            this.left.addNode(node);
        }
    } else if (node.value > this.value) {
        if(this.right == null) {
            node.ancestors.push(this);
            this.right = node;
        }
        else {
            node.ancestors.push(this);
            this.right.addNode(node);
        }
    }
}

Node.prototype.drawNode = function() {
    for (let key in this.floor) {
        let eachFloor = this.floor[key];
        for(let i=0; i<eachFloor.length; i++) {

            let node = eachFloor[i];
            let parent = node.ancestors[node.ancestors.length-1];
            
            if (parent != undefined) {
                // set xPos
                if (i == 0) {
                    node.xPos = parent.xPos - 40;
                } else {
                    node.xPos = eachFloor[i-1].xPos + 40;
                }
                // set yPos
                if (node.ancestors.length != 0) {
                    node.yPos = parent.yPos + 50;
                }
                line(node.xPos, node.yPos, parent.xPos, parent.yPos);

            }
            // console.log(eachFloor[i])
            // console.log(parent);
            
            Node.prototype.draw.call(node);
        }
    }
}

Node.prototype.draw = function() {
    fill(0,0,0);
    ellipse(this.xPos, this.yPos, 30, 30);

    textAlign(CENTER);
    fill(255, 255, 255);
    text(this.value, this.xPos, this.yPos);
    
}

function Node(val) {
    this.value = val,
    this.left= null,
    this.right = null,
    this.ancestors = [],

    this.xPos = windowWidth/2,
    this.yPos = 30
}