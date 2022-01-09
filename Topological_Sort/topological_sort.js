/*
*	CS-570 Lab#9 Topological Sort
*
*	Auther: Fan Luo
*	Date: 11/16/2018
*/

const fs = require('fs');

class Node {
	constructor(value) {
		this.value = value;
		this.next = undefined;
	}
}

class SingleList {
	constructor(value) {
		this.header = new Node(value);
	}

	push(value) {
		let current = this.header;
		while (current.next !== undefined) {
			current = current.next;
		}
		current.next = new Node(value);
	}

	print() {
		let current = this.header;
		while (current !== undefined) {
			process.stdout.write(' -> ' + current.value);
			current = current.next;
		}
		process.stdout.write('\n');
	}
}

class DiGraph {
	constructor() {
		this.adjacency_list = [];
	}

	is_empty() {
		return this.adjacency_list.length == 0;
	}

	push_node_list(value) {
		let list = this.adjacency_list.find(list => list.header.value === value);
		if (list !== undefined) list.push(value);
		else {
			list = new SingleList(value);
			this.adjacency_list.push(list);
		}
	}

	push_edge(from, to) {
		let list = this.adjacency_list.find(list => list.header.value === from);
		list.push(to);
	}

	get_root() {
		let indegree_map = new Map();
		for (let list of this.adjacency_list) {
			indegree_map.set(list.header.value, 0);
		}
		for (let list of this.adjacency_list) {
			let current = list.header;
			while (current.next !== undefined) {
				current = current.next;
				indegree_map.set(current.value, indegree_map.get(current.value) + 1);
			}
		}

		let root = [];
		for (let [key, value] of indegree_map) {
			if (value == 0) {
				root.push(key);
			}
		}
		return root;
	}

	delete(value) {
		// console.log(this.adjacency_list);
		this.adjacency_list = this.adjacency_list.filter(list => list.header.value !== value);
	}

	print() {
		for (let list of this.adjacency_list) {
			list.print();
		}
	}
}

function topological_sort(digraph, time) {
	let i = 0;
	let sorted = new Map();
	while (!digraph.is_empty()) {
		let roots = digraph.get_root();
		if (roots.length === 0) {
			return 'Digraph is not a acyclic.';
		}
		i++;
		let root = undefined;
		if (roots.length < 2) root = roots[0];
		else {
			root = roots[time];
		}
		digraph.delete(root);
		sorted.set(i, root);
	}
	return sorted;
}

function create_graph() {
	let digraph = new DiGraph();
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

	for (let i = 0; i < nodes_number; i++) {
		digraph.push_node_list(i);
	}

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
		digraph.push_edge(from_value, to_value);
	}
	return digraph;
}

if (require.main == module) {
	console.log('CS-570 Lab#8, Topological Sort');

	for (let i = 0; i < 2; i++) {
		let digraph = create_graph();
		let result = topological_sort(digraph, i);
		if (typeof result === 'string') {
			console.log(result);
			break;
		}
		console.log('Topological ording ' + (i + 1) + ': ');
		console.log('order  ==>  node');
		for (let [key, value] of result) {
			console.log('  ' + key + '    ==>   ' + value);
		}
		console.log();
	}

}
