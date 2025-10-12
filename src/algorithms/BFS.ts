import { BaseAlgorithm, AlgorithmResult } from './BaseAlgorithm';
import { CellState } from '../context/GridContext';

export class BFSAlgorithm extends BaseAlgorithm {
  execute(
    grid: CellState[][],
    start: [number, number],
    end: [number, number]
  ): AlgorithmResult {
    this.resetState();
    this.validateInputs(grid, start, end);

    const queue: [number, number][] = [];
    const visited: [number, number][] = [];
    const pathMap = new Map<string, [number, number]>();
    let pathArray: [number, number][] | null = null;

    queue.push(start);
    visited.push(start);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;

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
          visited.push(neighbor);
          pathMap.set(this.createKey(neighbor), current);
          queue.push(neighbor);
        }
      }
    }

    return this.createResult(grid, visited, pathArray);
  }
}

// Legacy function wrapper for backward compatibility
export function BFS(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const algorithm = new BFSAlgorithm();
  return algorithm.execute(grid, start, end);
}
