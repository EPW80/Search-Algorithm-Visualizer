import { BaseAlgorithm, AlgorithmResult } from "./BaseAlgorithm";
import PriorityQueue from "../helpers/PriorityQueue";
import { CellState } from "../context/GridContext";

export class DijkstraAlgorithm extends BaseAlgorithm {
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
    const distance = new Map<string, number>();

    const priorityQueue = new PriorityQueue<[number, number]>();

    // Initialize distances
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      if (!row) continue;

      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (!cell || cell.isWall) continue;

        const cellKey = this.createKey([i, j]);
        if (cell.isStart) {
          distance.set(cellKey, 0);
        } else {
          distance.set(cellKey, Infinity);
        }
      }
    }

    priorityQueue.push(start, 0);

    while (priorityQueue.size() > 0) {
      const minCell = priorityQueue.pop();
      if (!minCell) break;

      const currentNode = minCell.value;
      const currentKey = this.createKey(currentNode);

      // Skip if already visited
      if (this.isVisited(currentNode, visited)) {
        continue;
      }

      visited.push(currentNode);

      // Check if target is reached
      if (this.isTargetReached(currentNode, end)) {
        pathArray = this.reconstructPath(pathMap, end, start);
        break;
      }

      const neighbors = this.getValidNeighbors(currentNode, grid);

      for (const neighbor of neighbors) {
        const [row, col] = neighbor;
        const neighborCell = grid[row]?.[col];

        if (!neighborCell || neighborCell.isWall) continue;

        const neighborKey = this.createKey(neighbor);

        // Skip if already visited
        if (this.isVisited(neighbor, visited)) {
          continue;
        }

        // Calculate new distance
        const edgeWeight = this.getCellWeight(neighborCell);
        const currentDistance = distance.get(currentKey) || Infinity;
        const potentialDistance = currentDistance + edgeWeight;
        const neighborDistance = distance.get(neighborKey) || Infinity;

        if (potentialDistance < neighborDistance) {
          distance.set(neighborKey, potentialDistance);
          pathMap.set(neighborKey, currentNode);

          // Add to priority queue if not already processed
          if (!this.isVisited(neighbor, visited)) {
            priorityQueue.push(neighbor, potentialDistance);
          }
        }
      }
    }

    return this.createResult(grid, visited, pathArray);
  }
}

// Legacy function wrapper for backward compatibility
export function Dijkstra(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const algorithm = new DijkstraAlgorithm();
  return algorithm.execute(grid, start, end);
}
