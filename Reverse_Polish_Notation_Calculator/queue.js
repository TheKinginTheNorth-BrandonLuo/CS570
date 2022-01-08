/*******************
*
* Implement Data Structure: Stack
*
* Auther: Fan Luo
* Date: 10/10/2018
*
********************/


class Queue {
    constructor() {
        this.arr = [];
    }

    enqueue(T) {
        this.arr.push(T);
    }

    dequeue() {
        return this.arr.shift();
    }

    peak() {
        return this.arr[0];
    }

    isEmpty() {
        return this.arr.length == 0
    }
}

module.exports = {
    Queue: Queue,
}

if (require.main == module) {
    let queue = new Queue();
    queue.enqueue(34);
    queue.enqueue(234);
    queue.enqueue(12);

    console.log(queue.peak());
    queue.dequeue();
    while (!queue.isEmpty()) {
        console.log(queue.dequeue());
    }
}
