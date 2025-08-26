import { searchHelpers } from "../helpers/searchHelpers";
import PriorityQueue from "../helpers/PriorityQueue";
import { CellState } from "../context/GridContext";

export function Dijkstra(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
) {
  const visited: [number, number][] = [];
  let pathArray: [number, number][] | null = [];

  const path: { [key: string]: [number, number] | null } = {};
  const distance: { [key: string]: number } = {};

  const priorityQueue = new PriorityQueue<[number, number]>();

  // Initialize distances
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const thisCell = grid[i][j];
      const thisCellKey = [i, j].toString();

      if (!thisCell.isWall) {
        if (thisCell.isStart) {
          distance[thisCellKey] = 0;
        } else {
          distance[thisCellKey] = Infinity;
        }
        path[thisCellKey] = null;
      }
    }
  }

  priorityQueue.push(start, 0);

  while (priorityQueue.size() > 0) {
    const minCell = priorityQueue.pop();
    if (!minCell) break;
    const currentNode = minCell.value;

    // Skip if already visited
    if (visited.some((node) => searchHelpers.arraysMatch(node, currentNode))) {
      continue;
    }

    visited.push(currentNode);

    // Target found
    if (searchHelpers.arraysMatch(currentNode, end)) {
      pathArray = searchHelpers.getPath(path, end);
      break;
    }

    const neighbors = searchHelpers.getNeighbours(
      currentNode,
      grid,
      grid.length,
      grid[0].length
    );

    for (const neighbor of neighbors) {
      const [row, col] = neighbor;
      const neighborCell = grid[row][col];
      const neighborKey = neighbor.toString();
      const currentNodeKey = currentNode.toString();

      // Skip walls and already visited nodes
      if (
        neighborCell.isWall ||
        visited.some((node) => searchHelpers.arraysMatch(node, neighbor))
      ) {
        continue;
      }

      // Calculate new distance (weighted nodes cost more)
      const edgeWeight = neighborCell.isWeight ? 10 : 1;
      const potentialDistance = distance[currentNodeKey] + edgeWeight;

      if (potentialDistance < distance[neighborKey]) {
        distance[neighborKey] = potentialDistance;
        path[neighborKey] = currentNode;

        // Add to priority queue if not already processed
        if (
          !visited.some((node) => searchHelpers.arraysMatch(node, neighbor))
        ) {
          priorityQueue.push(neighbor, potentialDistance);
        }
      }
    }
  }

  const finalGrid = searchHelpers.updateGrid(
    searchHelpers.updateGrid(grid, visited, false),
    pathArray || [],
    true
  );

  return { newGrid: finalGrid, gridWithPath: finalGrid, visited, pathArray };
}
