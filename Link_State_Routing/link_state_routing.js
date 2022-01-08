const readline = require('readline');
const rlSync = require('readline-sync');
const fs = require('fs');

class Node {
	constructor(value) {
		this.value = value;
		this.next = undefined;
	}

	hasNext() {
		return this.next !== undefined;
	}
}

class Graph {
	constructor() {
		this.nodes = [];
		this.adjacency_list = [];
	}

	add_router(router) {
		this.nodes.push(router);
		let header = this.adjacency_list.find((node) => {node.value === router.id})
		if (header !== undefined) {
			console.log('Router ' + router.id + ' has been in the list.');
		} else {
			this.adjacency_list.push(new Node(router.id));
		}
	}

	add_path(from, to) {
		let header = this.adjacency_list.find(node => node.value === from);
		if (header === undefined) {
			throw new Error('Invalid header :', header.id);
		}
		this.recursive_push_node(header, to);
	}

  update(router_id, list) {
    let header = this.adjacency_list.find(node => node.value === router_id);
    if (header === undefined) {
      throw new Error('Invalid header :', header.id);
    }
  }

	recursive_push_node(current, value) {
		if (!current.hasNext()) {
			current.next = new Node(value);
		} else {
			this.recursive_push_node(current.next, value);
		}
	}

	get_router_by_id(router_id) {
		return this.nodes.find(item => item.id === router_id);
	}

  get_routers_directly_connect(router_id) {
    let routers = [];
    for (let header of this.adjacency_list) {
      let node = header.next
      while (node) {
        if (node.value === router_id) {
          let router = this.nodes.find(item => item.id === header.value);
          routers.push(router);
          break;
        }
        node = node.next;
      }
    }
    return routers;
  }

	*[Symbol.iterator]() {
        for (let i = 0; i < this.nodes.length; i++) {
            yield this.nodes[i];
        }
    }

	print() {
		for (let header of this.adjacency_list) {
			let node = header;
			while (node.hasNext()) {
				process.stdout.write(node.value + '->');
				node = node.next;
			}
			process.stdout.write(node.value + '\n');
		}
	}
}

class LinkStatePacket {
	constructor(origin_id, sequence_number, reachable_network) {
		this.origin_id = origin_id;
		this.sequence_number = sequence_number;
		this.ttl = 10;
    this.reachable_network = reachable_network;
	}
}

var ROUTER_STATE_ON = 1;
var ROUTER_STATE_OFF = 2;

class Router {
	constructor(id, name, network) {
		this.id = id;
		this.network_name = name;
		this.state = ROUTER_STATE_ON;
		this.direct_routers = new Map();
		this.routing_table = new Map();
		this.sequence_number = 0;
		this.tick_counter = new Map();
		this.network = network;
		this.sn_history_table = new Map();
	}

	add_directly_connected_router(router_id, cost=1) {
		this.direct_routers.set(router_id, cost);
		this.tick_counter.set(router_id, 0);
	}

	get_directly_connected_cost(router_id) {
		return this.direct_routers.get(router_id) || Infinity;
	}

	shutdown() {
		console.log('######## Shut down Router' + this.id + ' ########');
		this.state = ROUTER_STATE_OFF;
	}

	startup() {
		console.log('######## Start up of Router' + this.id + ' ########');
		this.state = ROUTER_STATE_ON;
	}

  update_directly_list(router_id, cost) {
    if (this.direct_routers.has(router_id)) {
      this.direct_routers.set(router_id, cost);
    }
  }

	dijkstra() {
		let S = [this];
		let VS = [];

		for (let router of this.network) {
			if (router.id === this.id) {
				continue;
			}
			let cost = this.direct_routers.get(router.id) || Infinity;
			let outgoing_link = cost < Infinity ? router.id.toString() : '';
			this.routing_table.set(router.id, [router.network_name, outgoing_link, cost])
			VS.push(router)
		}

		while (VS.length > 0) {
			let min_cost = Infinity;
			let min_router = undefined;
			for (let router of VS) {
        let cost = this.routing_table.get(router.id)[2];
        if (min_router === undefined) min_router = router;
				if (min_cost > cost) {
					min_cost = cost;
					min_router = router;
				}
			}

			VS = VS.filter(router => router.id !== min_router.id);
			S.push(min_router);

			for (let router of VS) {
				let origin_cost = this.routing_table.get(router.id)[2];
				let new_cost = this.routing_table.get(min_router.id)[2] + min_router.get_directly_connected_cost(router.id)
				let cost = Math.min(origin_cost, new_cost);
				let outgoing_link = new_cost < origin_cost ? this.routing_table.get(min_router.id)[1] : this.routing_table.get(router.id)[1];
        // if (outgoing_link === '') outgoing_link = 'Shutdown';
				this.routing_table.set(router.id, [router.network_name, outgoing_link, cost]);
			}
		}
	}

	print_routing_table() {
    if (this.state === ROUTER_STATE_OFF) {
      console.log('Router ' + this.id + ' has been shutdown.');
      return;
    }
		console.log('######## Routing Table of Router' + this.id + ' ########');
		for (let [key, value] of this.routing_table) {
      if (value[1] === '') continue;
			console.log(value[0] + ', ' + value[1]);
		}
	}

	receive_packet(packet, from_id) {
		if (this.state == ROUTER_STATE_OFF) return;

		this.tick_counter.set(packet.origin_id, 0);

		packet.ttl--;
		let history_sn = this.sn_history_table.get(packet.origin_id) || -1;
		if (packet.ttl <= 0 || history_sn >= packet.sequence_number) {
			// Discard packet
			return;
		}
		this.sn_history_table.set(packet.origin_id, packet.sequence_number)

		for (let id of this.direct_routers.keys()) {
			if (id === from_id || id === packet.origin_id) continue;
			let router = this.network.get_router_by_id(id);
			if (router === undefined) throw 'Can not find router by id: ' + id;
			router.receive_packet(packet, this.id);
		}

		this.dijkstra();
	}

	originate_packet() {
		if (this.state == ROUTER_STATE_OFF) return;

		for (let [id, tick] of this.tick_counter) {
			this.tick_counter.set(id, tick+1);
			if (tick+1 >= 2) {
				this.direct_routers.set(id, Infinity);
			}
		}
    // Create list for LSP to indicate each reachable network
    let reachable_network = [];
    for (let id of this.direct_routers.keys()) {
      let router = this.network.get_router_by_id(id);
      reachable_network.push(router.network_name);
    }
    // generate a lsp and send to directly connected routers
		let packet = new LinkStatePacket(this.id, this.sequence_number++, reachable_network);
		for (let id of this.direct_routers.keys()) {
			let router = this.network.get_router_by_id(id);
			router.receive_packet(packet, this.id)
		}
	}
}

function continue_network(network) {
	for (let router of network) {
		router.originate_packet();
	}
}

function print_router(network, router_id) {
	if (isNaN(router_id)) {
		console.log('Please input router ID that you want to PRINT.');
		return;
	}
	let router = network.get_router_by_id(router_id);
	if (router === undefined) throw 'Router not exist. Id: ' + router_id;

	router.print_routing_table();
}

function shutdown_router(network, router_id) {
	if (isNaN(router_id)) {
		console.log('Please input router ID that you want to SHUT DOWN.');
		return;
	}
	let router = network.get_router_by_id(router_id);
	if (router === undefined) throw 'Router not exist, id: ' + router_id;
	router.shutdown();

  let directly_routers = network.get_routers_directly_connect(router_id);
  for (let router of directly_routers) {
    router.update_directly_list(router_id, Infinity);
  }

  for (let router of network) {
    router.dijkstra();
  }
}

function startup_router(network, router_id) {
	if (isNaN(router_id)) {
		console.log('Please input router ID that you want to START UP.');
		return;
	}

	let router = network.get_router_by_id(router_id);
	if (router === undefined) throw 'Router not exist, id: ' + router_id;

	router.startup();

  let directly_routers = network.get_routers_directly_connect(router_id);
  for (let router of directly_routers) {
    router.update_directly_list(router_id, 1);
  }

  for (let router of network) {
    router.dijkstra();
  }
}

const rl_file = readline.createInterface({
	input: fs.createReadStream('infile.dat'),
	crlfDelay: Infinity
})

if (require.main == module) {
	console.log('CS-570, Assignment#5, Link State Routing.');

	// Reading infile.dat, and initialize system...
	let graph = new Graph();
	let header = undefined;
	rl_file.on('line', (line) => {
		if (line.startsWith(' ') || line.startsWith('\t')) {
			// Add path to graph
			let split_line = line.trim().split(' ');
			let id = parseInt(split_line[0]);
			let cost = split_line.length < 2 ? 1 : split_line[1];
			header.add_directly_connected_router(id, cost);
			graph.add_path(header.id, id);
		} else {
			// Add node to graph
			let split_line = line.trim().split(' ');
			router = new Router(parseInt(split_line[0]), split_line[1], graph);
			graph.add_router(router);
			header = router;
		}
	})

	rl_file.on('close', () => {
    for (let router of graph) {
  		router.dijkstra();
  	}

		while (true) {
			let input = rlSync.question('Command: ').trim().toLowerCase();
			if (input === 'q') {
				console.log('Quiting, Thanks.');
				break;
			}

      if (input.length == 0) {
        continue;
      }

			split_input = input.split(' ');
      if (split_input.length < 2) {
        var command = input[0];
        var router_id = parseInt(input[1]);
      } else {
        var command = split_input[0];
        var router_id = parseInt(split_input[1]);
      }

			switch (command) {
				case 'c':
					continue_network(graph);
					break;
				case 'p':
					print_router(graph, router_id);
					break;
				case 's':
					shutdown_router(graph, router_id);
					break;
				case 't':
					startup_router(graph, router_id);
					break;
				default:
					console.log('Invalid input, please input again.');
					break;
			}
		}
	})
}
