/***************
*
* Assignment 1: Tic Tac Toe
*
* Auther: Fan Luo
* Date: 09/10/2018
*
***************/

const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const board = require('./board');

const playersSymbols = ['X','O','A','B','C','D','E','F','G','H','I','J','K',
                        'L','M','N','P','Q','R','S','T','U','V','W','Y','Z'];

const stateType = {
    NEW_OR_RESUME: 'new_or_resume',
    RESUME_FILENAME: 'resume_filename',
    PLAYERS_NUM: 'players_number',
    BOARD_SIZE: 'board_size',
    WIN_SEQUENCE_COUNT: 'win_sequence_count',
    NEXT_MOVE: 'next_move',
    QUITING: 'quit',
    FINISHED: 'finished'
};

const result = {
    win: 'win',
    draw: 'draw',
    unknown: 'unknown'
}

class Move {
  constructor(player, row, col) {
    this.player = player;
    this.row = row;
    this.col = col;
  }

  to_json() {
    return {
      player: this.player,
      row: this.row,
      col: this.col
    }
  }
}

class TicTacToe {
    constructor() {
        this.players = [];
        this.state = stateType.NEW_OR_RESUME;
        this.moves = [];
        this.size = 0;
        this.board = null;
        this.win_seq_count = 3;
    }

    start() {
        let quit = false;
        while(true) {
            if (quit) break;
            switch (this.state) {
                case stateType.NEW_OR_RESUME:
                  this.new_or_resume();
                  break;
                case stateType.RESUME_FILENAME:
                  this.ask_filename();
                  break;
                case stateType.PLAYERS_NUM:
                  this.ask_players_num();
                  break;
                case stateType.BOARD_SIZE:
                  this.ask_board_size();
                  break;
                case stateType.WIN_SEQUENCE_COUNT:
                  this.ask_winning_count();
                  break;
                case stateType.NEXT_MOVE:
                  this.ask_new_move();
                  break;
                case stateType.QUITING:
                  this.quiting_game();
                  break;
                case stateType.FINISHED:
                  quit = true;
                  break
                default:
                  throw new Error('Fetal Error, Unknown state: ' + this.state);
            }
        }
        console.log("Thanks to play Kun&Fan's TicTacToe game.");
    }

    new_or_resume() {
        let answer = readlineSync.question('New Game(N) or Resume from file(R)? ');
        if (this.check_answer(answer)) return;
        if (answer.toLowerCase() == 'n') {
            this.state = stateType.PLAYERS_NUM;
        } else if (answer.toLowerCase() == 'r') {
            this.state = stateType.RESUME_FILENAME;
        } else {
            console.log('Invalid input, please input again.');
        }
    }

    ask_filename() {
        let filename = readlineSync.question('Please input the filename of the'
                                    + ' game you want to resume. ');
        if (this.check_answer(filename)) return;
        try {
            let data = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
            this.parse_json(data);
            this.board.display(this.moves);
            this.state = stateType.NEXT_MOVE;
        } catch(err) {
            console.log('Error occured while reading file, ' + err + ', please input filename again.');
        }
    }

    ask_players_num() {
        let answer = readlineSync.question('Player Number (2 - 26)? ');
        if (this.check_answer(answer)) return;
        let n = parseInt(answer.trim());
        if (isNaN(n) || n < 2 || n > 26) {
            console.log('Invalid number, please input again.');
        } else {
            this.players = playersSymbols.slice(0, n);
            this.state = stateType.BOARD_SIZE;
        }
    }

    ask_board_size() {
        let answer = readlineSync.question('Board size (3x3 - 999x999)? ');
        if (this.check_answer(answer)) return;
        let size = parseInt(answer.trim());
        if (isNaN(size) || size < 3 || size > 999) {
            console.log('Invalid size of board, please input again.');
        } else {
            this.size = size;
            this.board = new board.Board(size);
            this.state = stateType.WIN_SEQUENCE_COUNT;
        }
    }

    ask_winning_count() {
        let answer = readlineSync.question('Win sequence count (must less then board size)? ');
        if (this.check_answer(answer)) return;
        let win_seq_count = parseInt(answer.trim());
        if (win_seq_count < 3 || win_seq_count > this.board.size || isNaN(win_seq_count)) {
            console.log('Invalid win sequence count, please input again.');
        } else {
            this.win_seq_count = win_seq_count;
            this.state = stateType.NEXT_MOVE;
            this.board.display(this.moves);
            console.log('Game start, enjoy');
        }
    }

    ask_new_move() {
        let player = this.players.shift();
        let nextMove = readlineSync.question('Player ' + player
                            + ', your next move is (format - row column): ' );
        if (nextMove.toLowerCase() == 'q') {
            this.players.unshift(player);
            this.state = stateType.QUITING;
            return;
        }
        nextMove = nextMove.trim().replace(/ +/g, ' ');
        let vector = nextMove.split(' ');
        if (vector.length != 2) {
            console.log('Invalid format, please input again.');
            this.players.unshift(player);
            return;
        }
        let row = parseInt(vector[0]);
        let column = parseInt(vector[1]);
        if (isNaN(row) || row > this.size || row < 1
          || isNaN(column) || column > this.size || column < 1) {
            console.log('Invalid move, the valid input is 1 - ' + this.board.size
                  + ', please input again');
            this.players.unshift(player);
            return;
        }

        if (this.moves.find(item => item.row == row && item.col == column) !== undefined ) {
            console.log('Invalid move, this spot was taken by other player'
                      + ', please input again');
            this.players.unshift(player);
            return;
        }

        let move = new Move(player, row, column)
        this.moves.push(move);
        this.board.display(this.moves);
        this.players.push(player);
        let r = this.check_win_or_draw();
        if (r == result.win) {
            console.log(player + ' wins the game. Congrs!');
            return this.state = stateType.FINISHED;
        } else if (r == result.draw) {
            console.log('This game is draw. please try start again.');
            return this.state = stateType.FINISHED;
        }
    }

    quiting_game() {
        let answer = readlineSync.question('Are you sure to quit?(y/n) ');
        if (answer.toLowerCase() == 'y') {
            let need_save_file = readlineSync.question('Do you wang to save this game?(y/n) ');
            if (need_save_file.toLowerCase() == 'y') {
                let filename = readlineSync.question('Input filename to save this game (Input Q for quit without saving): ');
                let jsonData = JSON.stringify(this.to_json());
                try {
                    fs.writeFileSync(path.join(__dirname, filename), jsonData, 'utf8');
                    this.state = stateType.FINISHED;
                } catch (error) {
                    console.log('Error occured, ' + error + ', please input again.');
                }
            } else {
                this.state = stateType.FINISHED;
            }
        } else if (answer.toLowerCase() == 'n') {
            this.state = stateType.NEXT_MOVE;
            this.board.display(this.moves);
        } else {
            console.log('Invalid input please input again.');
        }
    }

    check_win_or_draw() {
        let winnable = false;

        for (let row = 1; row <= this.size; row++) {
            for (let col = 1; col <= this.size; col++) {
                let players_h = [];
                let players_v = [];
                let players_ld = [];
                let players_rd = [];
                for (let i = 0; i < this.win_seq_count; i++) {
                    let m1 = this.get_move(row, col + i);
                    if (m1 != undefined) players_h.push(m1.player);
                    let m2 = this.get_move(row + i, col);
                    if (m2 != undefined) players_v.push(m2.player);
                    let m3 = this.get_move(row + i, col + i);
                    if (m3 != undefined) players_ld.push(m3.player);
                    let m4 = this.get_move(row + i, col - i);
                    if (m4 != undefined) players_rd.push(m4.player);
                }
                if (this.check_winning(players_h) || this.check_winning(players_v)
                || this.check_winning(players_ld) || this.check_winning(players_rd)) {
                    return result.win;
                }

                if (this.check_winnable(players_h) || this.check_winnable(players_v)
                || this.check_winnable(players_ld) || this.check_winnable(players_rd)) {
                    winnable = true;
                }
            }
        }
        return winnable ? result.unknown: result.draw;
    }

    check_winnable(players) {
        if (players.length < this.win_seq_count) return false;
        let filtered = players.filter(item => item !== undefined);
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] != filtered[i+1]) {
                return false;
            }
        }
        return true;
    }

    check_winning(players) {
        let filtered = players.filter(item => item !== undefined)
        if (filtered.length != this.win_seq_count) return false;
        for (let i = 0; i < filtered.length - 1; i++) {
          if (filtered[i] != filtered[i+1]) return false;
        }
        return true;
    }

    get_move(row, col) {
        if (row < 1 || row > this.size || col < 1 || col > this.size) {
            return undefined;
        }
        let move = this.moves.find((item) => item.row == row && item.col == col);
        if (move === undefined) return new Move(undefined, row, col);
        return move;
    }

    check_answer(answer) {
        if (answer === 'q' || answer === 'Q') {
            this.state = stateType.FINISHED;
            return true;
        } else {
            return false;
        }
    }

    to_json() {
        return {
            players: this.players,
            size: this.size,
            win_seq_count: this.win_seq_count,
            moves: this.moves.map(item => item.to_json())
        }
    }

    parse_json(data) {
        let json = JSON.parse(data);
        this.players = json.players;
        this.size = json.size;
        this.win_seq_count = json.win_seq_count;
        for (let m of json.moves) {
            this.moves.push(new Move(m.player, m.row, m.col))
        }
        this.board = new board.Board(this.size);
    }

}

module.exports = {
    TicTacToe: TicTacToe,
    Move: Move
}

// enter main program
if (require.main === module) {
    console.log('Welcome to Tic Tac Toe game, input Q/q to quit.');
    let ticTacToe = new TicTacToe()
    try {
        ticTacToe.start();
    } catch (error) {
        console.trace('Some error occured, ' + error.stack);
    }
}
