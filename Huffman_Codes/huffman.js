/*****************************
*
*  CS-570 Assignment#03 Huffman Code
*
*  Auther: Fan Luo
*  Date: 11/02/2018
*
*****************************/

const fs = require('fs');

/*
* Node of binary tree and Symbol information
*/
class Node {
    constructor(left, right, value) {
        this.left = left;
        this.right = right;
        this.value = value;
    }
}

/*
* Priority queue of data struct
*/
class ForestRoot {
    constructor(weight, root) {
        this.weight = weight;
        this.root = root;
    }
}

/*
* class for Huffman Coding Algorithm
*/
class HuffmanCompression {
    constructor() {
        this.huffman_table = new Map();
    }

    // Main func for Huffman Compression
    compress(data) {
        // Pre-processing the data, remove all the space and other marks.
        console.log('###### Start to generate frequency table...');
        let result = '';
        data = this.pre_process(data);
        let frequency_table = this.generate_freqency_table(data);
        result += this.print_frequency_table(frequency_table);

        // Copy the order of the frequency table
        for (let [key, value] of frequency_table) {
            this.huffman_table.set(key, '');
        }
        console.log('###### Finished.');
        // Generate huffman code
        console.log('###### Start to generate huffman code table...');
        let huffman_tree = this.generate_huffman_tree(frequency_table);
        this.generate_huffman_table(huffman_tree);
        result += this.print_huffman_table();
        console.log('###### Finished.');

        // Translate the data to huffman code
        let coded_bit_count = 0;
        for (let c of data) {
            if (!this.huffman_table.has(c)) {
                throw new Error('Fatal Error: Can find ' + c + ' in the huffman table.');
            }
            coded_bit_count += this.huffman_table.get(c).length;
        }

        result += 'Total Bits: ' + coded_bit_count;
        return result;
    }

    pre_process(data) {
        return data.trim().replace(/\W/g, '');
    }

    recurse_generate_huffman_code(current, code) {
        if (current.left === null && current.right === null) {
            this.huffman_table.set(current.value, code);
            return;
        }
        let left_code = (code || '') + '0';
        let right_code = (code || '') + '1';
        this.recurse_generate_huffman_code(current.left, left_code);
        this.recurse_generate_huffman_code(current.right, right_code);
    }

    generate_huffman_table(huffman_tree) {
        this.recurse_generate_huffman_code(huffman_tree, null);
    }

    generate_freqency_table(data) {
        if (typeof data != 'string') throw new Error('Unexpected type of data');
        let map = new Map();
        map.set('total_count', data.length);
        for (let c of data) {
            if (map.has(c)) map.set(c, map.get(c) + 1);
            else {
                map.set(c, 1);
            }
        }
        return new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    }

    generate_huffman_tree(frequency_table) {
        let forest = [];
        for (let [key, value] of frequency_table) {
            let node = new Node(null, null, key);
            let forest_root = new ForestRoot(value, node);
            forest.push(forest_root);
        }

        while (forest.length > 1) {
            let least = forest.pop();
            let second = forest.pop();
            let node = new Node(least.root, second.root, null);
            let new_root = new ForestRoot(least.weight+second.weight, node)
            if (forest.length == 0) forest.push(new_root);
            else {
                for (let i = 0; i < forest.length; i++) {
                    if (new_root.weight >= forest[i].weight) {
                        forest.splice(i, 0, new_root);
                        break;
                    } else {
                        if (i == forest.length - 1) {
                            forest.push(new_root);
                            break;
                        }
                    }
                }
            }
        }

        return forest[0].root;
    }

    print_frequency_table(frequency_table) {
        let output = 'Symbol    frequency\n'
        let total_count = frequency_table.get('total_count');
        frequency_table.delete('total_count');
        for (let [key, value] of frequency_table) {
            let frequency = Math.round(value / total_count * 10000) / 100;
            output += '  ' + key + ',       ' + frequency+'%\n';
        }
        output += '\n'
        return output;
    }

    print_huffman_table() {
        let output = 'Symbol   Huffman Codes\n';
        for (let [key, value] of this.huffman_table) {
            output += '  ' + key + ',         ' + value + '\n';
        }
        output += '\n'
        return output
    }
}

// Main function
if (require.name = module) {
    try {
        // reading infile.dat
        fs.readFile('infile.dat', 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log('Error: infile.dat does not exist. Please build a input file name: infile.dat.');
                    return;
                }
                throw err;
            }

            huffman = new HuffmanCompression();
            let output = huffman.compress(data);
            fs.writeFile('output.dat', output, (err) => {
                if (err) throw err;
                console.log('###### Compression Successed! Outfile.dat is created.');
            });
        })
    } catch (e) {
        console.log(e);
    }
}
