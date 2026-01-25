import { CellState } from "../store/gridStore";

// Delay utility function
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Animation speeds (in milliseconds)
export const AnimationSpeed = {
  SLOW: 50,
  NORMAL: 10,
  FAST: 5,
  INSTANT: 0
} as const;

export type AnimationSpeedType = typeof AnimationSpeed[keyof typeof AnimationSpeed];

// OPTIMIZED: Direct DOM manipulation for animations (no React re-renders)
const animateCellDOM = (row: number, col: number, type: 'visited' | 'path'): void => {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (cell) {
    // Remove conflicting classes
    if (type === 'visited') {
      cell.classList.remove('cell-path');
      cell.classList.add('cell-visited');
    } else if (type === 'path') {
      cell.classList.remove('cell-visited');
      cell.classList.add('cell-path');
    }
  }
};

// OPTIMIZED: Main animation function using direct DOM manipulation
export const animateAlgorithm = async (
  visited: [number, number][],
  path: [number, number][],
  _updateCellState: (row: number, col: number, newState: Partial<CellState>) => void,
  speed: AnimationSpeedType = AnimationSpeed.NORMAL
): Promise<void> => {
  console.log('🎬 Animation started (DOM optimized):', {
    visitedCount: visited.length,
    pathCount: path.length,
    speed: speed === AnimationSpeed.INSTANT ? 'INSTANT' : `${speed}ms`
  });

  // If speed is instant, update everything at once
  if (speed === AnimationSpeed.INSTANT) {
    // Use direct DOM manipulation for instant rendering
    for (const [row, col] of visited) {
      animateCellDOM(row, col, 'visited');
    }

    for (const [row, col] of path) {
      animateCellDOM(row, col, 'path');
    }

    console.log('✅ Instant animation complete (DOM optimized)');
    return;
  }

  // Animate visited nodes using DOM manipulation
  for (const [row, col] of visited) {
    animateCellDOM(row, col, 'visited');
    await delay(speed);
  }

  // Small pause before showing path
  await delay(speed * 3);

  // Animate final path using DOM manipulation
  for (const [row, col] of path) {
    animateCellDOM(row, col, 'path');
    await delay(speed * 2);
  }

  console.log('✅ Animation complete (DOM optimized)');
};


// OPTIMIZED: Clear animation classes from DOM
const clearCellAnimationDOM = (row: number, col: number): void => {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (cell) {
    cell.classList.remove('cell-visited', 'cell-path');
  }
};

// OPTIMIZED: Clear all animations using direct DOM manipulation
export const clearAnimations = async (
  visited: [number, number][],
  path: [number, number][],
  _updateCellState: (row: number, col: number, newState: Partial<CellState>) => void
): Promise<void> => {
  // Combine all nodes that might need clearing
  const allNodes = new Set([...visited, ...path].map(node => node.toString()));

  for (const nodeStr of Array.from(allNodes)) {
    const parts = nodeStr.split(',').map(Number);
    const row = parts[0];
    const col = parts[1];
    if (row !== undefined && col !== undefined) {
      clearCellAnimationDOM(row, col);
    }
  }
};

// OPTIMIZED: Reset all animations on the grid using DOM manipulation
export const resetGridAnimations = (
  grid: CellState[][],
  _updateCellState: (row: number, col: number, newState: Partial<CellState>) => void
): void => {
  for (let row = 0; row < grid.length; row++) {
    const gridRow = grid[row];
    if (!gridRow) continue;
    for (let col = 0; col < gridRow.length; col++) {
      const cell = gridRow[col];
      if (cell && (cell.isVisited || cell.isPath)) {
        clearCellAnimationDOM(row, col);
      }
    }
  }
};

// OPTIMIZED: Reset entire board (clears visited, path, and walls)
// Walls require React state updates since they're structural changes
export const resetBoard = (
  grid: CellState[][],
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void
): void => {
  for (let row = 0; row < grid.length; row++) {
    const gridRow = grid[row];
    if (!gridRow) continue;
    for (let col = 0; col < gridRow.length; col++) {
      const cell = gridRow[col];
      if (cell) {
        // Clear animation classes from DOM
        if (cell.isVisited || cell.isPath) {
          clearCellAnimationDOM(row, col);
        }
        // Clear walls from React state (structural change)
        if (cell.isWall || cell.isVisited || cell.isPath) {
          updateCellState(row, col, { isWall: false, isVisited: false, isPath: false });
        }
      }
    }
  }
};

// Get algorithm result without animations (for instant mode)
export const getAlgorithmResult = (
  algorithmFunction: (grid: CellState[][], start: [number, number], end: [number, number]) => any,
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
) => {
  return algorithmFunction(grid, start, end);
};
