# Assignment description

Create or use any graph data structure that reveals the graph using an adjacency matrix instead of an an adjacency list. Implement the breadth-first search algorithm as described in the lecture notes, using a queue to represent S'. Just like you can generate dfn for a depth-first search, generate a bfn number for this breadth-first search. Use the bfn number to represent S, do not use a separate data structure.

Read in a graph in the same format as last week from infile.dat. Assume node 0 is the start point (s). Output a valid bfn number for each node to the screen in the following format:

node# bfn

For example, a 3-node graph might generate the following output:

0 1
2 3
1 2
