/*****************************
*
*  CS-570 Lab#07 Sorted Set
*
*  Auther: Fan Luo
*  Date: 10/19/2018
*
*****************************/

const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
 }

class BinaryTree {
    constructor() {
        this.root = null;
    }

    isEmpty() {
        return this.root == null;
    }

    recursivelyAdd(current, value) {
        if (current == null) {
            return new Node(value)
        }

        if (value < current.value) {
            current.left = this.recursivelyAdd(current.left, value);
        } else if (value > current.value) {
            current.right = this.recursivelyAdd(current.right, value);
        } else {
            return current;
        }
        return current;
    }

    /*
    * Reference: https://www.geeksforgeeks.org/binary-search-tree-set-2-delete/
    */
    recursivelyRemove(current, value) {
        if (current == null) {
            return current;
        }
        if (value < current.value) {
            current.left = this.recursivelyRemove(current.left, value);
        } else if (value > current.value) {
            current.right = this.recursivelyRemove(current.right, value);
        } else {
            if (current.left == null && current.right == null) {
                return null;
            } else if (current.left == null) {
                return current.right;
            } else if (current.right == null) {
                return current.left;
            } else {
                current.value = this.findMinNode(current.right).value;
                current.right = this.recursivelyRemove(current.right, current.value);
                // current.value = this.findMaxNode(current.left).value;
                // current.left = this.recursivelyRemove(current.left, current.value);
            }
        }
        return current;
    }

    findMinNode(current) {
        let minNode = current;
        while (current.left != null) {
            minNode = current.left;
        }
        return minNode
    }

    findMaxNode(current) {
        let maxNode = current;
        while (current.right != null) {
            maxNode = current.right;
        }
        return maxNode;
    }

    find(current, value) {
        if (current == null) {
            return null;
        }

        let result = null;
        if (value < current.value) {
            result = this.find(current.left, value);
        } else if (value > current.value) {
            result = this.find(current.right, value);
        } else {
            result = current;
        }
        return result
    }

    insert(value) {
        this.root = this.recursivelyAdd(this.root, value);
    }

    contains(value) {
        return this.find(this.root, value) != null;
    }

    remove(value) {
        this.recursivelyRemove(this.root, value);
    }


    recursivelyOutput(current) {
        if (current == null) {
            return;
        }
        /*
        * Reference: https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/
        */
        this.recursivelyOutput(current.left);
        process.stdout.write(current.value + ' ');
        this.recursivelyOutput(current.right);
    }

    output() {
        this.recursivelyOutput(this.root);
    }
}

class SortedSet {
    constructor() {
        this.binaryTree = new BinaryTree();
    }

    isEmpty() {
        return this.binaryTree.isEmpty();
    }

    add(value) {
        this.binaryTree.insert(value);
    }

    contains(value) {
        return this.binaryTree.contains(value);
    }

    output() {
        this.binaryTree.output();
    }

    remove(value) {
        this.binaryTree.remove(value);
    }
}

// Main
if (require.main == module) {
    let sortedSet = new SortedSet();
    try {
        let data = fs.readFileSync(path.join(__dirname, 'infile.dat'), 'utf-8');
        data = data.trim().replace(/, */g, ',');
        let inputs = data.trim().split(',');
        for (let value of inputs) {
            sortedSet.add(Number(value));
        }
    } catch (error) {
        console.log('There is error: ' + error);
    }
    process.stdout.write('Sorted Set Contains: ');
    sortedSet.output();
    process.stdout.write('\n');

    while (true) {
        let input = readlineSync.question('Input a value: ');
        if (input.trim() === 'quit') {
            break;
        }
        let n = Number(input.trim());
        if (isNaN(n)) {
            console.log('Please input number');
            continue;
        }
        if (sortedSet.contains(n)) {
            console.log('Yes');
        } else {
            console.log('No');
        }
    }
}
