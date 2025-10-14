import { Game } from './game.ts';

function solve(game: Game) {
  const height = game.field.length;
  const width = game.field[0].length;
  while (true) {
    const i = Math.floor(Math.random() * height);
    const j = Math.floor(Math.random() * width);
    const result = game.play(i, j);
    if (result) {
      return 'I won!';
    }
    console.log(game.fieldString);
    if (result === false) {
      return 'I lost...';
    }
  }
}

console.log(solve(new Game()));
