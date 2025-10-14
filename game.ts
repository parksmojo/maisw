type GameOptions = {
  size?: { rows: number; columns: number } | number;
  bombCount?: number;
};

type SpaceValue = 'X' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Space = SpaceValue | ' ' | 'F';

export class Game {
  private spaces: SpaceValue[][] = [];
  public field: Space[][];
  public moves: [number, number][] = [];

  private rows: number;
  private columns: number;
  private bombCount: number;

  constructor({ size, bombCount: bombs }: GameOptions = {}) {
    this.rows = Math.max(typeof size === 'number' ? size : (size?.rows ?? 14), 3);
    this.columns = Math.max(typeof size === 'number' ? size : (size?.columns ?? 18), 3);
    this.bombCount = Math.max(bombs ?? Math.floor(this.rows * this.columns * 0.16), 1);

    this.field = Array.from({ length: this.rows }, () => Array(this.columns).fill(' '));
  }

  private generateField(firstMove: [number, number]): SpaceValue[][] {
    const field: SpaceValue[][] = Array.from({ length: this.rows }, () => Array<SpaceValue>(this.columns).fill('0'));

    const totalSpaces = this.rows * this.columns;
    const firstIndex = firstMove[0] * this.columns + firstMove[1];
    const protectedIndices = new Set<number>([firstIndex]);
    const neighborOffsets = [-1, 0, 1];

    const neighborCandidates: { index: number; priority: number }[] = [];
    for (const rowOffset of neighborOffsets) {
      for (const columnOffset of neighborOffsets) {
        if (rowOffset === 0 && columnOffset === 0) continue;
        const neighborRow = firstMove[0] + rowOffset;
        const neighborColumn = firstMove[1] + columnOffset;
        if (neighborRow < 0 || neighborRow >= this.rows || neighborColumn < 0 || neighborColumn >= this.columns) {
          continue;
        }
        const index = neighborRow * this.columns + neighborColumn;
        const priority = Math.abs(rowOffset) + Math.abs(columnOffset);
        neighborCandidates.push({ index, priority });
      }
    }

    neighborCandidates.sort((a, b) => a.priority - b.priority);

    const maxProtected = totalSpaces - this.bombCount;
    if (maxProtected <= 0) {
      throw new Error('Bomb count exceeds available spaces for this board.');
    }

    const neighborsToProtect = Math.min(neighborCandidates.length, Math.max(0, maxProtected - 1));
    for (let i = 0; i < neighborsToProtect; i++) {
      protectedIndices.add(neighborCandidates[i].index);
    }

    const positions: number[] = [];
    for (let index = 0; index < totalSpaces; index++) {
      if (!protectedIndices.has(index)) {
        positions.push(index);
      }
    }

    for (let i = positions.length - 1; i >= positions.length - this.bombCount; i--) {
      const swapIndex = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[swapIndex]] = [positions[swapIndex], positions[i]];
    }
    const bombPositions = positions.slice(positions.length - this.bombCount);

    for (const position of bombPositions) {
      const row = Math.floor(position / this.columns);
      const column = position % this.columns;
      field[row][column] = 'X';
    }

    for (const position of bombPositions) {
      const row = Math.floor(position / this.columns);
      const column = position % this.columns;

      for (const rowOffset of neighborOffsets) {
        for (const columnOffset of neighborOffsets) {
          if (rowOffset === 0 && columnOffset === 0) continue;

          const neighborRow = row + rowOffset;
          const neighborColumn = column + columnOffset;

          if (neighborRow < 0 || neighborRow >= this.rows || neighborColumn < 0 || neighborColumn >= this.columns) {
            continue;
          }

          const value = field[neighborRow][neighborColumn];

          if (value !== 'X') {
            const incremented = (Number(value) + 1).toString() as SpaceValue;
            field[neighborRow][neighborColumn] = incremented;
          }
        }
      }
    }

    return field;
  }

  public get fieldString(): string {
    let str = '';
    for (const row of this.field) {
      str += row.join(' ') + '\n';
    }
    return str;
  }

  public play(row: number, col: number): boolean | null {
    this.moves.push([row, col]);

    if (this.moves.length === 1) {
      this.spaces = this.generateField([row, col]);
    }

    if (this.spaces[row][col] === 'X') {
      this.field[row][col] = 'X';
      return false;
    }

    const neighborOffsets = [-1, 0, 1];
    const q: [number, number][] = [[row, col]];
    while (q.length) {
      const [row, col] = q.shift()!;
      const val = this.spaces[row][col];

      if (this.field[row][col] === '0') {
        continue;
      }
      this.field[row][col] = val;
      if (this.field[row][col] !== '0') {
        continue;
      }

      for (const rowOffset of neighborOffsets) {
        for (const columnOffset of neighborOffsets) {
          if (rowOffset === 0 && columnOffset === 0) continue;
          const nr = row + rowOffset;
          const nc = col + columnOffset;
          if (nr < 0 || nc < 0 || nr >= this.field.length || nc >= this.field[0].length) {
            continue;
          }
          q.push([nr, nc]);
        }
      }
    }

    return this.checkWin() || null;
  }

  private checkWin(): boolean {
    for (let row = 0; row < this.field.length; row++) {
      for (let column = 0; column < this.field[0].length; column++) {
        if (this.field[row][column] === ' ' && this.spaces[row][column] !== 'X') {
          return false;
        }
      }
    }
    return true;
  }
}
