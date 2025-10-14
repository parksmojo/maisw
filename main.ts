import { Game } from './game.ts';

const game = new Game();
console.log(game.boardString);
console.log('-----');
game.play(4, 4);
console.log(game.boardString);
console.log('-----');
