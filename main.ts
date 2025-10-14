import { Game } from './game.ts';

const randomMove = (game: Game): [number, number] => {
  const i = Math.floor(Math.random() * game.field.length);
  const j = Math.floor(Math.random() * game.field[0].length);
  return [i, j] as const;
};

function mark(game: Game) {
  const dir = [-1, 0, 1];
  const height = game.field.length;
  const width = game.field[0].length;

  let marked = false;
  let madeChange = true;
  while (madeChange) {
    madeChange = false;
    for (let k = 1; k < 9; k++) {
      const kstr = String(k);
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (game.field[i][j] !== kstr) continue;

          let blanks = 0;
          for (const dirx of dir) {
            for (const diry of dir) {
              if (!dirx && !diry) continue;
              const x = i + dirx;
              const y = j + diry;
              if (x < 0 || y < 0 || y >= width || x >= height) continue;
              if (game.field[x][y] === ' ' || game.field[x][y] === 'F') blanks++;
            }
          }

          if (blanks === k) {
            for (const dirx of dir) {
              for (const diry of dir) {
                if (!dirx && !diry) continue;
                const x = i + dirx;
                const y = j + diry;
                if (x < 0 || y < 0 || y >= width || x >= height) continue;
                if (game.field[x][y] === ' ') {
                  game.mark(x, y);
                  madeChange = true;
                  marked = true;
                }
              }
            }
          }
        }
      }
    }
  }
  return marked;
}

const bruteForce = (game: Game): [number, number] => {
  const dir = [-1, 0, 1];
  const height = game.field.length;
  const width = game.field[0].length;

  while (mark(game)) {
    for (let k = 1; k < 9; k++) {
      const kstr = String(k);
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (game.field[i][j] !== kstr) continue;

          let blanks = 0;
          let marked = 0;
          for (const dirx of dir) {
            for (const diry of dir) {
              if (!dirx && !diry) continue;
              const x = i + dirx;
              const y = j + diry;
              if (x < 0 || y < 0 || y >= width || x >= height) continue;
              if (game.field[x][y] === ' ') blanks++;
              if (game.field[x][y] === 'F') marked++;
            }
          }

          if (marked === k && blanks > 0) {
            for (const dirx of dir) {
              for (const diry of dir) {
                if (!dirx && !diry) continue;
                const x = i + dirx;
                const y = j + diry;
                if (x < 0 || y < 0 || y >= width || x >= height) continue;
                if (game.field[x][y] === ' ') return [x, y];
              }
            }
          }
        }
      }
    }
  }

  return randomMove(game);
};

const method = {
  randomMove,
  bruteForce,
};
function solve(game: Game, by: keyof typeof method) {
  while (true) {
    const [i, j] = method[by](game);
    const result = game.play(i, j);
    console.log(game.fieldString);
    if (result) {
      return 'I won!';
    }
    if (result === false) {
      return 'I lost...';
    }
  }
}

console.log(solve(new Game(), 'bruteForce'));
