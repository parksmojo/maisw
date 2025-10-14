type GameOptions = {
  size?: { rows: number; columns: number } | number;
  bombCount?: number;
};

type BoardOptions = {
  rows: number;
  columns: number;
  bombCount: number;
};

type SpaceValue = 'X' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Space = SpaceValue | ' ' | 'F';

export class Board {
  private spaces: SpaceValue[][];
  public board: Space[][];

  constructor({ size, bombCount: bombs }: GameOptions = {}) {
    const rows = typeof size === 'number' ? size : (size?.rows ?? 14);
    const columns = typeof size === 'number' ? size : (size?.columns ?? 18);
    const bombCount = bombs ?? 40;

    this.board = Array.from({ length: rows }, () => Array(columns).fill(' '));
    this.spaces = this.generateBoard({ rows, columns, bombCount });
  }

  private generateBoard({ rows, columns, bombCount }: BoardOptions): SpaceValue[][] {
    const board: SpaceValue[][] = Array.from({ length: rows }, () => Array<SpaceValue>(columns).fill('0'));

    const totalSpaces = rows * columns;
    const positions = Array.from({ length: totalSpaces }, (_, index) => index);
    for (let i = positions.length - 1; i > 0; i--) {
      const swapIndex = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[swapIndex]] = [positions[swapIndex], positions[i]];
    }
    const bombPositions = positions.slice(0, bombCount);

    for (const position of bombPositions) {
      const row = Math.floor(position / columns);
      const column = position % columns;
      board[row][column] = 'X';
    }

    const neighborOffsets = [-1, 0, 1];

    for (const position of bombPositions) {
      const row = Math.floor(position / columns);
      const column = position % columns;

      for (const rowOffset of neighborOffsets) {
        for (const columnOffset of neighborOffsets) {
          if (rowOffset === 0 && columnOffset === 0) continue;

          const neighborRow = row + rowOffset;
          const neighborColumn = column + columnOffset;

          if (neighborRow < 0 || neighborRow >= rows || neighborColumn < 0 || neighborColumn >= columns) {
            continue;
          }

          const value = board[neighborRow][neighborColumn];

          if (value !== 'X') {
            const incremented = (Number(value) + 1).toString() as SpaceValue;
            board[neighborRow][neighborColumn] = incremented;
          }
        }
      }
    }

    return board;
  }

  public get boardString(): string {
    let str = '';
    for (const row of this.board) {
      str += row.join(' ') + '\n';
    }
    return str;
  }

  public play(row: number, col: number) {
    if (this.spaces[row][col] === 'X') {
      throw 'you lose';
    }

    const neighborOffsets = [-1, 0, 1];
    const q: [number, number][] = [[row, col]];
    while (q.length) {
      console.log(this.boardString);
      const [row, col] = q.shift()!;
      const val = this.spaces[row][col];

      if (this.board[row][col] === '0') {
        continue;
      }
      this.board[row][col] = val;
      if (this.board[row][col] !== '0') {
        continue;
      }

      for (const rowOffset of neighborOffsets) {
        for (const columnOffset of neighborOffsets) {
          if (rowOffset === 0 && columnOffset === 0) continue;
          const nr = row + rowOffset;
          const nc = col + columnOffset;
          if (nr < 0 || nc < 0 || nr >= this.board.length || nc >= this.board[0].length) {
            continue;
          }
          q.push([nr, nc]);
        }
      }
    }
  }
}
