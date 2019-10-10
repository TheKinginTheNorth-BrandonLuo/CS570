class Stack {
    constructor() {
        this.arr = [];
    }

    push(T) {
        this.arr.push(T);
    }

    pop() {
        return this.arr.pop();
    }

    peak() {
        return this.arr[this.arr.length - 1];
    }

    isEmpty() {
        return this.arr.length == 0
    }

    toString() {
        return this.arr.toString()
    }
}

module.exports = {
    Stack: Stack
}
