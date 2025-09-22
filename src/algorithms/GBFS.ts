import { BaseAlgorithm, AlgorithmResult } from "./BaseAlgorithm";
import PriorityQueue from "../helpers/PriorityQueue";
import { CellState } from "../context/GridContext";

export class GBFSAlgorithm extends BaseAlgorithm {
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
    const priorityQueue = new PriorityQueue<[number, number]>();

    // Start with the initial node
    const startHeuristic = this.calculateManhattanDistance(start, end);
    priorityQueue.push(start, startHeuristic);

    while (priorityQueue.size() > 0) {
      const minCell = priorityQueue.pop();
      if (!minCell) break;

      const currentNode = minCell.value;

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

        // Only add to queue if not already processed
        if (
          !pathMap.has(neighborKey) &&
          !this.isTargetReached(neighbor, start)
        ) {
          pathMap.set(neighborKey, currentNode);

          // Calculate heuristic (Manhattan distance to goal)
          const heuristic = this.calculateManhattanDistance(neighbor, end);

          // Add to priority queue if not already there
          if (
            !priorityQueue.hasElement((element) =>
              this.isTargetReached(element.value, neighbor)
            )
          ) {
            priorityQueue.push(neighbor, heuristic);
          }
        }
      }
    }

    return this.createResult(grid, visited, pathArray);
  }
}

// Legacy function wrapper for backward compatibility
export function GBFS(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const algorithm = new GBFSAlgorithm();
  return algorithm.execute(grid, start, end);
}
