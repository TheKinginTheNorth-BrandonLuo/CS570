# Assignment description
Implement the pseudocode presented in the lecture for both creating a graph and for topological sort. Put each algorithm into a separate function. Construct a data structure to store a graph, which can be based on an adjacency matrix, adjacency list, or any other underlying structure you create.

When the program starts, read in a graph from a file called infile.dat. Then, print out two different topological orderings for the graph to the screen. The graph we input to test is guaranteed to have at least two valid orderings, and you do not need to error check for that. You will need to modify the topological sort algorithm slightly to allow it to come up with a different valid topological ordering the second time, by tweaking one of the id(0) nodes that it selects.
