const readlineSync = require('readline-sync');
const readline = require('readline');
const fs = require('fs');
const Table = require('cli-table');

class TrieNode {
	constructor(father, value, is_end) {
		this.father = father;
		this.children = [];
		this.value = value;
		this.is_end = is_end;
	}

	insert(node) {
		if (this.children.length == 0) {
			this.children.push(node)
			return;
		}
		for (let i in this.children) {
			if (node.value < this.children[i].value) {
				this.children.splice(i, 0, node);
				break;
			}
			if (i == this.children.length - 1) {
				this.children.push(node);
			}
		}
	}

	is_root() {
		return this.value == null;
	}

	get_child(value) {
		return this.children.find(node => node.value === value);
	}

	get_key() {
		if (!this.is_end) {
			throw new Error('This node is not the end.');
		}
		let key = [];
		let current = this;
		while (!current.is_root()) {
			key.unshift(current.value);
			current = current.father;
		}
		return key.join('');
	}

	// Reference: https://stackoverflow.com/questions/4965335/how-to-print-binary-tree-diagram
	print(prefix, is_tail) {
		console.log(prefix, (is_tail ? ' -- ' : '|-- ') + (this.is_root() ? 'root' : this.value));
		for (let i in this.children) {
			this.children[i].print(prefix + (is_tail ? '     ' : ' |   '), i == this.children.length - 1);
		}
	}
}

class Trie {
	constructor() {
		this.root = new TrieNode(null);
		this.current = this.root;
		this.candidate = null;
	}

	insert(key) {
		let current = this.root;
		for (let i in key) {
			let child = current.get_child(key[i]);
			if (child !== undefined) {
				if (i == key.length - 1) child.is_end = true;
				else {
					current = child;
				}
			} else {
				let new_node = new TrieNode(current, key[i], i == key.length - 1);
				current.insert(new_node);
				current = new_node;
			}
		}
	}

	search(char) {
		let child = this.current.get_child(char);
		if (child !== undefined) {
			if (child.is_end) {
				this.candidate = child;
			}
			this.current = child;
		} else {
			if (this.current != this.root) this.current = this.root;
			if (this.candidate !== null) {
				let key = this.candidate.get_key();
				this.candidate = null;
				return key;
			}
		}
	}

	print() {
		this.root.print('', true);
	}
}

const rl_file = readline.createInterface({
	input: fs.createReadStream('company.dat'),
	crlfDelay: Infinity
});

const ignore_words = ['a', 'an', 'the', 'and', 'or', 'but'];

function output_result(statistic, total_words) {
	let table = new Table();
	table.push(['Company', 'Hit Count', 'Relevance']);
	// console.log('Company, Hit Count, Relevance');
	let total = 0;
	for (let [key, value] of statistic) {
		let relevance = Math.round(value / total_words * 1000000) / 10000;
		table.push([key, value, relevance + '%']);
		total += value;
	}
	let relevance = Math.round(total / total_words * 1000000) / 10000;
	table.push(['Total', total, relevance + '%']);
	table.push(['Total Words', total_words]);
	console.log(table.toString());
}

if (require.main == module) {
    console.log("CS570 Assignment#4 Tire Articles");
	console.log("Reading company.dat and create Tries data structure"); //https://nodejs.org/api/readline.html
	let trie = new Trie();
	let companies_map = new Map();
	rl_file.on('line', (line) => {
		let company_names = line.split('\t');
		for (let name of company_names) {
			trie.insert(name);
		}
		let primary_name = company_names.shift();
		for (let synonym of company_names) {
			companies_map.set(synonym, primary_name);
		}
	});
	rl_file.on('close', () => {
		let statistic = new Map();
		let total_words = 0;

		while (true) {
			let news = readlineSync.question('Input news article: ');
			if (news.trim() === '.') {
				output_result(statistic, total_words);
				break;
			}
			let companies = [];
			for (let c of news) {
				let company = trie.search(c);
				if (company !== undefined) {
					companies.push(company);
					if (companies_map.has(company)) {
						company = companies_map.get(company);
					}
					if (statistic.has(company)) {
						statistic.set(company, statistic.get(company) + 1);
					} else {
						statistic.set(company, 1);
					}
				}
			}

			// Filter Comapanies name
			for (let company_name of companies) {
				news =  news.replace(company_name, '').trim();
			}

			let news_words = news.trim().replace(/[^\w\s]|_/g, '').replace(/ +/g, ' ').split(' ');
			news_words = news_words.filter(word => !ignore_words.includes(word));
			total_words += news_words.length;

			if (companies.length > 0) {
				total_words += companies.join(' ').split(' ').length;
			}
		}
	});
}
