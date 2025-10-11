import { CellState } from '../context/GridContext';

export interface MazeGeneratorResult {
  walls: [number, number][];
  animationOrder: [number, number][];
}

export class MazeGenerator {
  private grid: CellState[][];
  private rows: number;
  private cols: number;
  private start: [number, number];
  private end: [number, number];

  constructor(grid: CellState[][]) {
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0]?.length || 0;

    // Find start and end positions
    this.start = this.findNode('start');
    this.end = this.findNode('end');
  }

  private findNode(type: 'start' | 'end'): [number, number] {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row]?.[col];
        if (
          cell &&
          ((type === 'start' && cell.isStart) || (type === 'end' && cell.isEnd))
        ) {
          return [row, col];
        }
      }
    }
    return [0, 0];
  }

  /**
   * Recursive Division Maze
   */
  recursiveDivision(): MazeGeneratorResult {
    const walls: [number, number][] = [];
    const animationOrder: [number, number][] = [];

    // Add boundary walls
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (
          row === 0 ||
          row === this.rows - 1 ||
          col === 0 ||
          col === this.cols - 1
        ) {
          const cell = this.grid[row]?.[col];
          if (cell && !cell.isStart && !cell.isEnd) {
            walls.push([row, col]);
            animationOrder.push([row, col]);
          }
        }
      }
    }

    // Recursively divide the grid
    this.divide(
      1,
      this.cols - 2,
      1,
      this.rows - 2,
      walls,
      animationOrder,
      'horizontal'
    );

    return { walls, animationOrder };
  }

  private divide(
    x: number,
    width: number,
    y: number,
    height: number,
    walls: [number, number][],
    animationOrder: [number, number][],
    orientation: 'horizontal' | 'vertical'
  ): void {
    if (width < 2 || height < 2) return;

    const horizontal = orientation === 'horizontal';

    if (horizontal) {
      // Create horizontal wall
      const wallY = y + Math.floor(Math.random() * (height - 1)) + 1;
      const passageX = x + Math.floor(Math.random() * (width + 1));

      for (let i = x; i <= x + width; i++) {
        const cell = this.grid[wallY]?.[i];
        if (i !== passageX && cell && !cell.isStart && !cell.isEnd) {
          walls.push([wallY, i]);
          animationOrder.push([wallY, i]);
        }
      }

      // Recursively divide the two halves
      this.divide(
        x,
        width,
        y,
        wallY - y - 1,
        walls,
        animationOrder,
        this.chooseOrientation(width, wallY - y - 1)
      );
      this.divide(
        x,
        width,
        wallY + 1,
        y + height - wallY - 1,
        walls,
        animationOrder,
        this.chooseOrientation(width, y + height - wallY - 1)
      );
    } else {
      // Create vertical wall
      const wallX = x + Math.floor(Math.random() * (width - 1)) + 1;
      const passageY = y + Math.floor(Math.random() * (height + 1));

      for (let i = y; i <= y + height; i++) {
        const cell = this.grid[i]?.[wallX];
        if (i !== passageY && cell && !cell.isStart && !cell.isEnd) {
          walls.push([i, wallX]);
          animationOrder.push([i, wallX]);
        }
      }

      // Recursively divide the two halves
      this.divide(
        x,
        wallX - x - 1,
        y,
        height,
        walls,
        animationOrder,
        this.chooseOrientation(wallX - x - 1, height)
      );
      this.divide(
        wallX + 1,
        x + width - wallX - 1,
        y,
        height,
        walls,
        animationOrder,
        this.chooseOrientation(x + width - wallX - 1, height)
      );
    }
  }

  private chooseOrientation(
    width: number,
    height: number
  ): 'horizontal' | 'vertical' {
    if (width < height) return 'horizontal';
    if (height < width) return 'vertical';
    return Math.random() < 0.5 ? 'horizontal' : 'vertical';
  }

  /**
   * Random Maze Pattern
   */
  randomMaze(density: number = 0.3): MazeGeneratorResult {
    const walls: [number, number][] = [];
    const animationOrder: [number, number][] = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row]?.[col];
        if (cell && !cell.isStart && !cell.isEnd && Math.random() < density) {
          walls.push([row, col]);
          animationOrder.push([row, col]);
        }
      }
    }

    return { walls, animationOrder };
  }

  /**
   * Spiral Pattern
   */
  spiralPattern(): MazeGeneratorResult {
    const walls: [number, number][] = [];
    const animationOrder: [number, number][] = [];

    let left = 0,
      right = this.cols - 1;
    let top = 0,
      bottom = this.rows - 1;
    let direction = 0; // 0: right, 1: down, 2: left, 3: up

    while (left <= right && top <= bottom) {
      if (direction === 0) {
        // Moving right
        for (let col = left; col <= right; col++) {
          const cell = this.grid[top]?.[col];
          if (cell && !cell.isStart && !cell.isEnd) {
            walls.push([top, col]);
            animationOrder.push([top, col]);
          }
        }
        top++;
      } else if (direction === 1) {
        // Moving down
        for (let row = top; row <= bottom; row++) {
          const cell = this.grid[row]?.[right];
          if (cell && !cell.isStart && !cell.isEnd) {
            walls.push([row, right]);
            animationOrder.push([row, right]);
          }
        }
        right--;
      } else if (direction === 2) {
        // Moving left
        for (let col = right; col >= left; col--) {
          const cell = this.grid[bottom]?.[col];
          if (cell && !cell.isStart && !cell.isEnd) {
            walls.push([bottom, col]);
            animationOrder.push([bottom, col]);
          }
        }
        bottom--;
      } else if (direction === 3) {
        // Moving up
        for (let row = bottom; row >= top; row--) {
          const cell = this.grid[row]?.[left];
          if (cell && !cell.isStart && !cell.isEnd) {
            walls.push([row, left]);
            animationOrder.push([row, left]);
          }
        }
        left++;
      }

      direction = (direction + 1) % 4;

      // Create gaps in the spiral
      if (direction === 0) {
        // Skip some walls to create passages
        left += 2;
        right -= 2;
        top += 2;
        bottom -= 2;
      }
    }

    return { walls, animationOrder };
  }

  /**
   * Vertical Skew Pattern
   */
  verticalSkew(): MazeGeneratorResult {
    const walls: [number, number][] = [];
    const animationOrder: [number, number][] = [];

    for (let col = 0; col < this.cols; col += 2) {
      for (let row = 0; row < this.rows; row++) {
        const cell = this.grid[row]?.[col];
        if (cell && !cell.isStart && !cell.isEnd) {
          if (row % 3 !== 0) {
            // Create gaps
            walls.push([row, col]);
            animationOrder.push([row, col]);
          }
        }
      }
    }

    return { walls, animationOrder };
  }

  /**
   * Horizontal Skew Pattern
   */
  horizontalSkew(): MazeGeneratorResult {
    const walls: [number, number][] = [];
    const animationOrder: [number, number][] = [];

    for (let row = 0; row < this.rows; row += 2) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row]?.[col];
        if (cell && !cell.isStart && !cell.isEnd) {
          if (col % 3 !== 0) {
            // Create gaps
            walls.push([row, col]);
            animationOrder.push([row, col]);
          }
        }
      }
    }

    return { walls, animationOrder };
  }

  /**
   * Clear all walls
   */
  clearWalls(): MazeGeneratorResult {
    return { walls: [], animationOrder: [] };
  }
}

// Animation helper for maze generation
export async function animateMazeGeneration(
  animationOrder: [number, number][],
  updateCellState: (
    row: number,
    col: number,
    newState: Partial<CellState>
  ) => void,
  speed: number = 10
): Promise<void> {
  for (const [row, col] of animationOrder) {
    updateCellState(row, col, { isWall: true });
    if (speed > 0) {
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  }
}
