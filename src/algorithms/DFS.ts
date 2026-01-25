import { BaseAlgorithm, AlgorithmResult } from "./BaseAlgorithm";
import { CellState } from '../types';

export class DFSAlgorithm extends BaseAlgorithm {
  execute(
    grid: CellState[][],
    start: [number, number],
    end: [number, number]
  ): AlgorithmResult {
    this.resetState();
    this.validateInputs(grid, start, end);

    const stack: [number, number][] = [];
    const visited: [number, number][] = [];
    const pathMap = new Map<string, [number, number]>();
    let pathArray: [number, number][] | null = null;

    stack.push(start);

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) break;

      // Skip if already visited
      if (this.isVisited(current, visited)) continue;

      visited.push(current);

      // Check if target is reached
      if (this.isTargetReached(current, end)) {
        pathArray = this.reconstructPath(pathMap, end, start);
        break;
      }

      // Explore neighbors
      const neighbors = this.getValidNeighbors(current, grid);
      for (const neighbor of neighbors) {
        const [row, col] = neighbor;
        const neighborCell = grid[row]?.[col];

        if (!neighborCell || neighborCell.isWall) {
          continue;
        }

        if (!this.isVisited(neighbor, visited)) {
          pathMap.set(this.createKey(neighbor), current);
          stack.push(neighbor);
        }
      }
    }

    return this.createResult(grid, visited, pathArray);
  }
}

// Legacy function wrapper for backward compatibility
export function DFS(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const algorithm = new DFSAlgorithm();
  return algorithm.execute(grid, start, end);
}
