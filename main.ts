import { Game } from './game.ts';

const game = new Game();
console.log(game.fieldString);
console.log('-----');
console.log(game.play(4, 4));
console.log(game.fieldString);
console.log('-----');
