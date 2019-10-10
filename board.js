
class Board {
  constructor(size) {
    this.size = size;
  }

  display(moves) {
    for (let row = 0; row <= this.size * 2; row++) {
      for (let col = 0; col <= this.size; col++) {
        if (row == 0) {
          this.drawNumberOfRow(col);
        } else if (row % 2 == 0) {
          if (row != this.size * 2) {
            this.drawSeparateLine(col);
          }
        } else {
          this.drawRow(Math.floor(row / 2) + 1, col, moves);
        }
      }
      if (row != this.size * 2) {
        this.newline();
      }
    }
  }

  drawNumberOfRow(col) {
    if (col == 0) {
      this.draw('    ');
    } else if (col == this.size) {
      this.draw(this.rowNumberString(col));
    } else {
      this.draw(this.rowNumberString(col) + ' ');
    }
  }

  drawRow(row, col, moves) {
    if (col == 0) {
      this.draw(this.colNumberString(row));
    } else if (col == this.size) {
      this.draw(this.drawPlayerMove(row, col, moves));
    } else {
      this.draw(this.drawPlayerMove(row, col, moves) + '|');
    }
  }

  drawPlayerMove(row, col, moves) {
    let move = moves.find(item => {
      if (item.row == row && item.col == col) return item;
    });
    if (move === undefined) {
      return '   ';
    } else {
      return ' ' + move.player + ' ';
    }
  }

  drawSeparateLine(col) {
    if (col == 0) {
      this.draw('    ');
    } else if (col == this.size) {
      this.draw('---');
    } else {
      this.draw('---+');
    }
  }

  rowNumberString(num) {
    let str = num.toString();
    if (str.length == 1) {
      return ' ' + str + ' ';
    } else if (str.length == 2) {
      return str + ' ';
    } else {
      return str;
    }
  }

  colNumberString(num) {
    let str = num.toString();
    if (str.length == 1) {
      return '  ' + str +' ';
    } else if (str.length == 2) {
      return ' ' + str + ' ';
    } else {
      return str + ' ';
    }
  }

  draw(str) {
    process.stdout.write(str);
  }

  newline() {
    process.stdout.write('\n');
  }
}

module.exports = {
    Board: Board,
}

if (require.main == module) {
    // Test case for win
    let m1 ={player: 'X', row: 1, col: 1};
    let m2 ={player: 'O', row: 1, col: 3};
    let m3 ={player: 'X', row: 2, col: 2};
    let m4 ={player: 'O', row: 3, col: 1};
    let m5 ={player: 'X', row: 3, col: 2};
    let moves = [m1, m2, m3, m4, m5];
    board = new Board(3);
    board.display(moves);
}
