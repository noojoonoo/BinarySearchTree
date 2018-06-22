# Drawing Binary Tree (p5.js)

### 시작

https://www.youtube.com/watch?v=GcDshWmhF4A

유튜브에서 "Marble adding Machine"을 보고나서, 이진법을 눈에 보이도록 직관적으로 표현할 수 있다는 것에 흥미를 느꼈다. 

이 repo는 Binary Search Tree를 화면에 그리는 코드를 담고 있다. (물론 치명적인 문제 몇가지를 여전히 해결하지 못했다)

Marble adding Machine에 영향을 받아 Binary Tree Generator 를 만들고자 했다.

이루고 싶었던 목표

1. 이진 트리는 root 노드에 대한 참조만 갖고 있을 시에, 트리 속 모든 노드에 접근 가능하다. 이러한 특징을 눈으로 보여주고 싶었다.
   - 새로운 값이 트리에 추가 될 때, 그 과정을 시각화
2. 각 노드들이 어떻게 정렬이 이루어 지는지 시각화

### 작업 과정

1. 노드

   ```javascript
   // nodes.js
   function Node(val) {
       this.value = val,
       this.left= null,
       this.right = null,
           
       this.ancestors = [],
       this.xPos = windowWidth/2,
       this.yPos = 30
   }
   ```

   - `value` : 노드의 값
   - `left` : 왼쪽 노드, 즉 `value`가 더 작은 노드에 대한 참조
   - `right` : 오른쪽 노드, 즉 `value`가 더 큰 노드에 대한 참조
   - `ancestors` : root node 부터 자기 자신에 오기까지 부모 노드들이 담긴 배열 (이것을 만든 이유는 추후에 설명)
   - `xPos` `yPos`: 노드를 그리기 위해 필요. default value는 root node 일 때만 적용 된다.

2. 트리

   트리 생성자

   ```javascript
   // tree.js
   function Tree() {
       this.root = null;
   }
   ```

   실제 트리 생성 과정

   ```javascript
   // BinarySearchTree.js
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
   ```

   

   트리와 관련된 모든 동작은, root 노드를 통해 자식 노드에 재귀적으로 적용된다. 그렇기 때문에 `Tree` 는 root 노드에 대한 참조만 지니게 된다. 

   - 값 추가 (addValue)

     ```javascript
     // tree.js
     Tree.prototype.addValue = function(val) {
         var node = new Node(val);
         if (this.root == null) {
             this.root = node;
         } else {
             this.root.addNode(node);
         }
     }	
     ```

     `this.root.addNode()`는 node의 method이다. `value` 를 비교하며 트리 속으로 들어가서 자신의 자리를 찾는다.

     ```javascript
     // node.js
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
     ```

3. 트리 그리기

   Root 노드에 대한 참조로 시작해 트리를 순회하며, `this.node.xPos = parent.node.xPos + somevalue` 와 같은 방법으로 그릴 경우, 노드들이 겹치게 된다.

   내가 생각한 대안은, depth 가 같은 노드를 묶는 배열을 만드는 것이다. Depth 가 같다는 것은, root 노드에서 자기 자신 사이에 있는 노드들의 갯수가 같다는 것이다. `node.ancestors` 라는 프로퍼티를 이러한 이유에서 만들었다.

   ```javascript
   // node.js
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
   ```

   `node.prototype.floor` 는 `{depth1: [nodeA], depth2: [nodeB, nodeC...]}` 와 같은 오브젝트이다.

   `Node.prototype.visit()` 는 `Tree.traverse()` 에서 트리 순회를 위해 호출되는 함수이다.

   트리를 순회하면서, `floor` 오브젝트를 완성한다.

   완성된 후에, 트리를 그릴 때는 `floor` 의 `depth1` `depth2`를 돌아가며, 그 안의 노드를 순서대로 그린다.

   각 노드의 `xPos` 는 전 노드의 값을 기준으로 계산된다.

   ```javascript
   // node.js
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
                   line(node.xPos, node.yPos, 
                        parent.xPos, parent.yPos);
               }
               Node.prototype.draw.call(node);
           }
       }
   }
   ```

   

   ***이렇게 함으로써 모든 노드를 보여줄 수 있지만 이상적인 트리 모양은 그려지지 않는다***

   

