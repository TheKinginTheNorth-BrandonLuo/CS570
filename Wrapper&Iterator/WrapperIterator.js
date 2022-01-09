/******************
*
* Advanced Wrapper Iterator
*
* Auther: Fan Luo
* Date: 09/28/2018
*
******************/

class FakeVector {
    constructor(capacity = 0) {
        this.array = new Array(capacity);
        this.length = capacity;
    }

    get capacity() {
        return this.array.length;
    }

    get(index) {
        if (index < 0) {
            throw new Error('Index cannot be negative.');
        } else if (index >= this.length) {
            throw new Error('Index is out of array range.');
        }
        return this.array[index];
    }

    set(index, value) {
        if (index < 0) {
            throw new Error('Index can not be negative.');
        } else if (index >= this.length) {
            throw new Error('Index is over size.');
        }
        this.array[index] = value;
    }

    resize(length) {
        if (length > this.capacity) {
            this.increase_capcaity(length);
        }
        this.length = length;
    }

    increase_capcaity(capacity) {
        if (capacity >= this.capacity) {
            let copy = new Array(capacity * 2);
            for (let i = 0; i < this.length; i++) {
                copy[i] = this.array[i];
            }
            this.array = copy;
        }
    }

    push(value) {
        this.resize(this.length + 1);
        this.array[this.length - 1] = value;
    }

    pop() {
        let pop_value = this.array[this.length - 1];
        this.array[this.length - 1] = undefined;
        this.resize(this.length - 1);
        return pop_value;
    }

    insert(index, value) {
        if (index < 0) {
            throw new Error('Index can not be negative.');
        } else if (index > this.array.length) {
            throw new Error('Index is over size.');
        }

        this.resize(this.length + 1);
        for (let i = this.length - 1; i >= 0; i--) {
            if (i > index) {
                this.array[i] = this.array[i - 1];
            } else if (i == index) {
                this.array[i] = value;
            }
        }
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this.array[i];
        }
    }
}


if (require.main == module) {
    console.log('======== Test Set and Get ========');
    let fakeV = new FakeVector(10);
    for (let i = 0; i < 10; i++) {
        fakeV.set(i, i);
    }

    if (fakeV.get(4) != 4) {
        console.log('Error, there is problem in the Get() function');
    } else {
        console.log('PASS');
    }
    console.log('======== Finish Test ========');
    console.log();
    console.log('======== Test Push and Pop ========');
    fakeV.push(200);
    if (fakeV.get(10) != 200) {
        console.log('!!!!!!!!! Unpassed, value not match!');
        return;
    }
    if (fakeV.length != 11) {
        console.log('!!!!!!!!! Unpassed, length is unexpected!');
        return;
    }

    let element = fakeV.pop();
    if (element != 200) {
        console.log('!!!!!!!!!!! Unpassed, pop function untest!');
        return;
    }
    if (fakeV.length != 10) {
        console.log('!!!!!!!!!!!!! Unpassed, length is unexpected!');
        return;
    }
    console.log('PASS');
    console.log('======== Finish Test ========');
    console.log();

    console.log('======== Test Insert ========');
    fakeV.insert(7, 70);
    if (fakeV.get(7) != 70) {
        console.log('Error, insert function unpassed, value does not match.');
        return;
    }
    if (fakeV.length != 11) {
        console.log('Error, insert function unpassed, length is wrong!');
        return;
    }
    console.log('PASS!');
    console.log('======== Finish Test ========');
    console.log();

    console.log('========== Test iterator ============');
    for (let v of fakeV) {
        console.log('iterator: ' + v);
    }
    console.log('========== Finished Test ============');
}
