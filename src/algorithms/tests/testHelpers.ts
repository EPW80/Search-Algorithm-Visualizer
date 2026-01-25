import { CellState } from '../../types';

/**
 * Creates a grid with all cells initialized to default state
 */
export function createEmptyGrid(rows: number, cols: number): CellState[][] {
  const grid: CellState[][] = [];
  for (let row = 0; row < rows; row++) {
    const currentRow: CellState[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        isWeight: false,
        isPath: false,
        isVisited: false,
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

/**
 * Sets a cell as the start position
 */
export function setStart(grid: CellState[][], row: number, col: number): void {
  grid[row][col].isStart = true;
}

/**
 * Sets a cell as the end position
 */
export function setEnd(grid: CellState[][], row: number, col: number): void {
  grid[row][col].isEnd = true;
}

/**
 * Sets a cell as a wall
 */
export function setWall(grid: CellState[][], row: number, col: number): void {
  grid[row][col].isWall = true;
}

/**
 * Sets a cell as weighted
 */
export function setWeight(grid: CellState[][], row: number, col: number): void {
  grid[row][col].isWeight = true;
}

/**
 * Creates walls at specified positions
 */
export function setWalls(grid: CellState[][], walls: [number, number][]): void {
  walls.forEach(([row, col]) => setWall(grid, row, col));
}

/**
 * Creates weighted cells at specified positions
 */
export function setWeights(grid: CellState[][], weights: [number, number][]): void {
  weights.forEach(([row, col]) => setWeight(grid, row, col));
}

/**
 * Checks if a path exists in the result
 */
export function hasPath(pathArray: [number, number][] | null): boolean {
  return pathArray !== null && pathArray.length > 0;
}

/**
 * Checks if a coordinate is in a list
 */
export function includesCoord(
  list: [number, number][],
  coord: [number, number]
): boolean {
  return list.some(([r, c]) => r === coord[0] && c === coord[1]);
}

/**
 * Creates a simple test grid with start and end
 */
export function createSimpleGrid(
  rows: number = 5,
  cols: number = 5,
  start: [number, number] = [0, 0],
  end: [number, number] = [4, 4]
): { grid: CellState[][]; start: [number, number]; end: [number, number] } {
  const grid = createEmptyGrid(rows, cols);
  setStart(grid, start[0], start[1]);
  setEnd(grid, end[0], end[1]);
  return { grid, start, end };
}

/**
 * Creates a grid with a wall blocking the direct path
 */
export function createGridWithWalls(
  walls: [number, number][]
): { grid: CellState[][]; start: [number, number]; end: [number, number] } {
  const grid = createEmptyGrid(5, 5);
  const start: [number, number] = [0, 0];
  const end: [number, number] = [4, 4];
  setStart(grid, start[0], start[1]);
  setEnd(grid, end[0], end[1]);
  setWalls(grid, walls);
  return { grid, start, end };
}

/**
 * Creates a grid with weighted cells
 */
export function createGridWithWeights(
  weights: [number, number][]
): { grid: CellState[][]; start: [number, number]; end: [number, number] } {
  const grid = createEmptyGrid(5, 5);
  const start: [number, number] = [0, 0];
  const end: [number, number] = [4, 4];
  setStart(grid, start[0], start[1]);
  setEnd(grid, end[0], end[1]);
  setWeights(grid, weights);
  return { grid, start, end };
}

/**
 * Creates a grid where no path exists (completely blocked)
 */
export function createNoPathGrid(): {
  grid: CellState[][];
  start: [number, number];
  end: [number, number];
} {
  const grid = createEmptyGrid(5, 5);
  const start: [number, number] = [0, 0];
  const end: [number, number] = [4, 4];
  setStart(grid, start[0], start[1]);
  setEnd(grid, end[0], end[1]);

  // Create a wall that completely blocks the path
  for (let col = 0; col < 5; col++) {
    setWall(grid, 2, col);
  }

  return { grid, start, end };
}
