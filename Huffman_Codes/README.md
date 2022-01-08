This work implements program that takes any input text and produces both a frequency table and the corresponding Huffman code.

1. Take approximately 360 words from any English document as your input text. Ignore all blanks, all punctuation marks, all special symbols. Create an input file with this input text.
2. Construct the frequency table according to the input text read from the file:
   1. The frequency's must be listed, in order, from largest (at the top) to smallest (at the bottom)
3. Then, using the Huffman algorithm, construct the optimal prefix binary code for the table.
   1. The Huffman codes will be sorted in the same manner as the one above i.e. frequency, highest to lowest.
4. Design your program to read the input from the input file "infile.dat". Your program must produce the output, in the file "outfile.dat",(Files must be named "infile.dat" and "outfile.dat" consisting of
   1. the frequency table for the source text,
   2. the Huffman code for each letter and digit in the source code, and
   3. the length of the coded message in terms of number of bits, 
