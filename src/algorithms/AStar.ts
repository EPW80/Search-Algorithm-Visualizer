import { CellState } from '../context/GridContext';
import PriorityQueue from '../helpers/PriorityQueue';
import { AlgorithmResult, BaseAlgorithm } from './BaseAlgorithm';

export class AStarAlgorithm extends BaseAlgorithm {
  execute(
    grid: CellState[][],
    start: [number, number],
    end: [number, number]
  ): AlgorithmResult {
    this.resetState();
    this.validateInputs(grid, start, end);

    const visited: [number, number][] = [];
    let pathArray: [number, number][] | null = null;

    const pathMap = new Map<string, [number, number]>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const openSet = new PriorityQueue<[number, number]>();

    const startKey = this.createKey(start);
    gScore.set(startKey, 0);
    const startFScore = this.calculateManhattanDistance(start, end);
    fScore.set(startKey, startFScore);
    openSet.push(start, startFScore);

    // Initialize all non-wall cells
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      if (!row) continue;

      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (!cell || cell.isWall) continue;

        const cellKey = this.createKey([i, j]);
        if (!cell.isStart) {
          gScore.set(cellKey, Infinity);
          fScore.set(cellKey, Infinity);
        }
      }
    }

    while (openSet.size() > 0) {
      const minCell = openSet.pop();
      if (!minCell) break;

      const currentNode = minCell.value;
      const currentKey = this.createKey(currentNode);

      if (this.isTargetReached(currentNode, end)) {
        pathArray = this.reconstructPath(pathMap, end, start);
        break;
      }

      if (!visited.some(node => this.isTargetReached(node, currentNode))) {
        visited.push(currentNode);
      }

      const neighbors = this.getValidNeighbors(currentNode, grid);

      for (const neighbor of neighbors) {
        const [row, col] = neighbor;
        const neighborCell = grid[row]?.[col];

        if (!neighborCell || neighborCell.isWall) {
          continue;
        }

        const neighborKey = this.createKey(neighbor);
        const currentGScore = gScore.get(currentKey);
        if (currentGScore === undefined) {
          continue;
        }

        const tentativeGScore =
          currentGScore + this.getCellWeight(neighborCell);
        const neighborGScore = gScore.get(neighborKey) || Infinity;

        if (tentativeGScore < neighborGScore) {
          pathMap.set(neighborKey, currentNode);
          gScore.set(neighborKey, tentativeGScore);
          const heuristic = this.calculateManhattanDistance(neighbor, end);
          const newFScore = tentativeGScore + heuristic;
          fScore.set(neighborKey, newFScore);

          if (
            !openSet.hasElement(element =>
              this.isTargetReached(element.value, neighbor)
            )
          ) {
            openSet.push(neighbor, newFScore);
          }
        }
      }
    }

    return this.createResult(grid, visited, pathArray);
  }
}

// Legacy function wrapper for backward compatibility
export function AStar(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const algorithm = new AStarAlgorithm();
  return algorithm.execute(grid, start, end);
}
