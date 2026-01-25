/**
 * Hook for finding start and end nodes in the grid
 */

import { CellState, Position } from '../types';

export const useGridNavigation = (grid: CellState[][]) => {
  const findStartNode = (): Position => {
    for (let row = 0; row < grid.length; row++) {
      const currentRow = grid[row];
      if (currentRow) {
        for (let col = 0; col < currentRow.length; col++) {
          const currentCell = currentRow[col];
          if (currentCell && currentCell.isStart) {
            return [row, col];
          }
        }
      }
    }
    // Dynamic fallback: use grid center or safe position
    const safeRow = Math.min(10, grid.length - 1);
    const safeCol = Math.min(5, (grid[0]?.length || 1) - 1);
    return [safeRow, safeCol];
  };

  const findEndNode = (): Position => {
    for (let row = 0; row < grid.length; row++) {
      const currentRow = grid[row];
      if (currentRow) {
        for (let col = 0; col < currentRow.length; col++) {
          const currentCell = currentRow[col];
          if (currentCell && currentCell.isEnd) {
            return [row, col];
          }
        }
      }
    }
    // Dynamic fallback: use grid right side or safe position
    const safeRow = Math.min(10, grid.length - 1);
    const safeCol = Math.max(0, Math.min(45, (grid[0]?.length || 50) - 1));
    return [safeRow, safeCol];
  };

  return {
    findStartNode,
    findEndNode,
  };
};
