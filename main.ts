import { Board } from './board.ts';

const board = new Board();
console.log(board.boardString);
console.log('-----');
board.play(4, 4);
console.log(board.boardString);
console.log('-----');
