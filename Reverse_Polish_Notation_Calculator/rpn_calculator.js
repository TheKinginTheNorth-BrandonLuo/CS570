/*******************
*
* Assignment#2 Reverse Polish Notation
*
* Auther: Fan Luo
* Date: 10/10/2018
*
********************/

const readlineSync = require('readline-sync');
const Stack = require('./stack').Stack;
const Queue = require('./queue').Queue;

const operators = ['+','-','*','/','(',')','%','POW']
const numbers = ['1','2','3','4','5','6','7','8','9','0']

class Postfix {
    constructor(infix) {
        this.opStack = new Stack();
        this.postQueue = new Queue();
        let infixQueue = this.parseInfixToQueue(infix);
        this.convertToPostfix(infixQueue)
    }

    convertToPostfix(infixQueue) {
        while (!infixQueue.isEmpty()) {
            let t = infixQueue.dequeue();
            if (!operators.includes(t)) {
                this.postQueue.enqueue(t);
            } else if (this.opStack.isEmpty()) {
                this.opStack.push(t);
            } else if (t === '(') {
                this.opStack.push(t);
            } else if (t === ')') {
                while (this.opStack.peak() != '(') {
                    this.postQueue.enqueue(this.opStack.pop());
                }
                this.opStack.pop();
            } else {
                while (!this.opStack.isEmpty() && this.opStack.peak() != '('
                      && this.precedence(t) <= this.precedence(this.opStack.peak())) {
                    this.postQueue.enqueue(this.opStack.pop());
                }
                this.opStack.push(t);
            }
        }
        while (!this.opStack.isEmpty()) {
            this.postQueue.enqueue(this.opStack.pop());
        }
    }

    parseInfixToQueue(infix) {
        let queue = new Queue();
        let numberStr = '';
        let isDecimals = false;
        for (let i = 0; i < infix.length; i++) {
            let c = infix.charAt(i);
            if (operators.includes(c)) {
                if (numberStr !== '') {
                    let operand = Number(numberStr)
                    if (isNaN(operand)) {
                        throw new Error('NaN exception.')
                    }
                    queue.enqueue(operand);
                    numberStr = '';
                    isDecimals = false;
                }
                queue.enqueue(c);
            } else if (c == ' ') {
                if (numberStr !== '') {
                    let operand = Number(numberStr)
                    if (isNaN(operand)) {
                        throw new Error('NaN exception.')
                    }
                    queue.enqueue(operand);
                    numberStr = '';
                    isDecimals = false;
                }
            } else if (c == 'P'){
                if (numberStr !== '') {
                    let operand = Number(numberStr)
                    if (isNaN(operand)) {
                        throw new Error('NaN exception.')
                    }
                    queue.enqueue(operand);
                    numberStr = '';
                    isDecimals = false;
                }

                let c2 = infix.charAt(++i);
                let c3 = infix.charAt(++i);
                if ((c+c2+c3) != 'POW') {
                    throw new Error("Invalid input");
                }
                queue.enqueue((c+c2+c3));
            } else if (numbers.includes(c)) {
                numberStr += c;
            } else if (c == '.') {
                isDecimals = true
                numberStr += c;
            } else {
                throw new Error("NaN exception.");
            }
        }
        if (numberStr !== '') {
            let operand = Number(numberStr)
            if (isNaN(operand)) {
                throw new Error('NaN exception.')
            }
            queue.enqueue(operand);
            numberStr = '';
            isDecimals = false;
        }
        return queue;
    }

    precedence(operator) {
        if (operator == '+' || operator == '-') {
            return 0;
        } else {
            return 1;
        }
    }

    postfixResult() {
        let evaluating = new Stack();
        let topNum = 0;
        let nextNum = 0;
        let answer = 0;

        while (!this.postQueue.isEmpty()) {
            let t = this.postQueue.dequeue()
            if (!operators.includes(t)) {
                evaluating.push(t);
            } else {
                topNum = evaluating.pop();
                nextNum = evaluating.pop();

                switch (t) {
                    case '+': answer = nextNum + topNum; break;
                    case '-': answer = nextNum - topNum; break;
                    case '*': answer = nextNum * topNum; break;
                    case '/':
                        if (topNum === 0) {
                            throw new Error('Divide by zero exception.');
                        }
                        answer = nextNum / topNum;
                        break;
                    case '%':
                        if (topNum === 0) {
                            throw new Error('Divide by zero exception.');
                        }
                        answer = nextNum % topNum;
                        break;
                    case 'POW': answer = Math.pow(nextNum, topNum); break;
                    default:
                }
                if (answer == NaN) {
                    throw new Error('NaN exception.');
                }
                evaluating.push(answer);
            }
        }
        return Math.round(evaluating.peak() * 100) / 100;
    }

    toString() {
        let str = '';
        for (let i of this.postQueue.arr) {
            str += i;
            str += ' ';
        }
        return str;
    }
}

if (require.main == module) {
    while (true) {
        let infix = readlineSync.question("Please input a infix math problem('quit' to exit): ");
        if (infix.trim().toLowerCase() == 'quit') {
            console.log("Have a good day. Bye");
            break;
        }
        try {
            let postfix = new Postfix(infix)
            console.log();
            console.log("######## ==> Converting Infix: " + infix);
            console.log("The Postfix: ", postfix.toString());
            console.log("result: " + postfix.postfixResult());
            console.log("===================================");
            console.log();
        } catch (error) {
            console.error(error + ', please input again.');
            console.log();
        }
    }
}
