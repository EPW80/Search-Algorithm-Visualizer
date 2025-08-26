import { CellState } from "../context/GridContext";

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

// Main animation function for visualizing algorithms
export const animateAlgorithm = async (
  visited: [number, number][],
  path: [number, number][],
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void,
  speed: AnimationSpeedType = AnimationSpeed.NORMAL
): Promise<void> => {
  console.log('🎬 Animation started:', {
    visitedCount: visited.length,
    pathCount: path.length,
    speed: speed === AnimationSpeed.INSTANT ? 'INSTANT' : `${speed}ms`
  });

  // If speed is instant, update everything at once
  if (speed === AnimationSpeed.INSTANT) {
    // Update all visited nodes
    for (const [row, col] of visited) {
      updateCellState(row, col, { isVisited: true, isPath: false });
    }
    
    // Update all path nodes
    for (const [row, col] of path) {
      updateCellState(row, col, { isPath: true, isVisited: false });
    }
    console.log('✅ Instant animation complete');
    return;
  }

  // Animate visited nodes
  for (const [row, col] of visited) {
    updateCellState(row, col, { isVisited: true, isPath: false });
    await delay(speed);
  }
  
  // Small pause before showing path
  await delay(speed * 3);
  
  // Animate final path
  for (const [row, col] of path) {
    updateCellState(row, col, { isPath: true, isVisited: false });
    await delay(speed * 2);
  }
  
  console.log('✅ Animation complete');
};


// Clear specific animation states (legacy function, kept for compatibility)
export const clearAnimations = async (
  visited: [number, number][],
  path: [number, number][],
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void
): Promise<void> => {
  // Combine all nodes that might need clearing
  const allNodes = new Set([...visited, ...path].map(node => node.toString()));
  
  for (const nodeStr of Array.from(allNodes)) {
    const [row, col] = nodeStr.split(',').map(Number);
    updateCellState(row, col, { isVisited: false, isPath: false });
  }
};

// Reset all animations on the grid
export const resetGridAnimations = (
  grid: CellState[][],
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void
): void => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if (cell.isVisited || cell.isPath) {
        updateCellState(row, col, { isVisited: false, isPath: false });
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
