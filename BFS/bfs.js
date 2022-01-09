/*
* CS-570 Lab # 10, BFS
*
* Author: Fan Luo
* Date: 11/28/2018
*/

const fs = require('fs');

class Graph {
	constructor(nodes) {
		this.size = nodes.length;
		this.nodes = new Map();
		for (let i = 0; i < this.size; i++) {
			this.nodes.set(i, nodes[i]);
		}
		this.adjacency_matrix = [];
		this.unused_matrix = [];
		for (let i = 0; i < this.size; i++) {
			let edge = [];
			let unused = [];
			for (let j = 0; j < this.size; j++) {
				edge.push(-1);
				unused.push(true);
			}
			this.adjacency_matrix.push(edge);
			this.unused_matrix.push(unused);
		}
	}

	bfs(start) {

		let S = [start];
		let SI = [start];

		let bfn = new Map();
		for (let [key, node] of this.nodes) {
			bfn.set(node, 0);
		}
		let i = 1
		bfn.set(start, i);
		this.mark_edges_unused();

		while (SI.length > 0) {
			let node = SI.shift();
			let w = this.next_unused_edge(node)
			if (w !== undefined) {
				if (bfn.get(w) === 0 ) {
					bfn.set(w, ++i);
				}
				SI.unshift(node);
				let index_node = this.get_keys_by_value(node)
				let index_w = this.get_keys_by_value(w);
				this.unused_matrix[node][w] = false;
				if (!S.includes(w)) {
					S.push(w);
				}
				SI.push(w);
			}
		}
		return bfn;
	}

	next_unused_edge(node) {
		let key = this.get_keys_by_value(node);
		for (let i = 0; i < this.size; i++) {
			if (this.adjacency_matrix[key][i] == 1 && this.unused_matrix[key][i] == true) {
				return this.nodes.get(i);
			}
		}
		return undefined;
	}

	mark_edges_unused() {
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				this.unused_matrix[j][i] = true;
			}
		}
	}

	push_edge(from, to) {
		let from_index = this.get_keys_by_value(from);
		let to_index = this.get_keys_by_value(to);
		this.adjacency_matrix[from_index][to_index] = 1;
	}

	get_keys_by_value(value) {
		for (let [key, node] of this.nodes) {
			if (node === value) return key;
		}
		throw new Error('Can not find node ' + value + ' in this graph');
	}

	// print_node() {
	// 	console.log(this.nodes);
	// }
	//
	// print_matrix() {
	// 	for (let i = 0; i < this.size; i++) {
	// 		for (let j = 0; j < this.size; j++) {
	// 			process.stdout.write(this.adjacency_matrix[j][i] + ' ');
	// 		}
	// 		process.stdout.write('\n')
	// 	}
	// 	process.stdout.write('\n')
	// }
	//
	// print_unused_matrix() {
	// 	for (let i = 0; i < this.size; i++) {
	// 		for (let j = 0; j < this.size; j++) {
	// 			process.stdout.write(this.unused_matrix[j][i] + ' ');
	// 		}
	// 		process.stdout.write('\n')
	// 	}
	// 	process.stdout.write('\n')
	// }
}

function create_graph() {
	let nodes = [];
	let edges = [];

	let input = fs.readFileSync('infile.dat', 'utf8');
	let lines = input.split('\n');
	let nodes_number = parseInt(lines[0].trim().split(' ')[0]);
	if (isNaN(nodes_number)) {
		throw new Error('Can not parse ' + lines[0].trim().split(' ')[0] + ' to a number ');
	}
	let edges_number = parseInt(lines[0].trim().split(' ')[1]);
	if (isNaN(edges_number)) {
		throw new Error('Can not parse ' + lines[0].trim().split(' ')[1] + ' to a number ');
	}

	for (let i = 0; i <= nodes_number; i++) {
		nodes.push(i);
	}

	let graph = new Graph(nodes);
	for (let i = 1; i < lines.length; i++) {
		let params = lines[i].trim().split(' ');
		if (lines[i].length == 0) {
			continue;
		}
		let from_value = parseInt(params[0]);
		if (isNaN(from_value)) {
			throw new Error('Can not parse ' + params[0] + ' to a number');
		}
		let to_value = parseInt(params[1]);
		if (isNaN(to_value)) {
			throw new Error('Can not parse ' + params[1] + ' to a number');
		}
		graph.push_edge(from_value, to_value);
	}
	return graph;
}

if (require.main == module) {
	console.log('CS-570 Lab#10, BFS Sort');
	let graph = create_graph();
	let bfn = graph.bfs(2);
	for (let [key, value] of bfn) {
		console.log(key + ' ' + value);
	}
}
