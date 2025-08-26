import { searchHelpers } from "../helpers/searchHelpers";
import PriorityQueue from "../helpers/PriorityQueue";
import { CellState } from "../context/GridContext";

export function GBFS(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
) {
  const visited: [number, number][] = [];
  let pathArray: [number, number][] | null = [];

  const path: { [key: string]: [number, number] | null } = {};
  const priorityQueue = new PriorityQueue<[number, number]>();

  // Initialize the algorithm
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const thisCell = grid[i][j];
      const thisCellKey = [i, j].toString();

      if (!thisCell.isWall) {
        path[thisCellKey] = null;
      }
    }
  }

  // Start with the initial node
  const startHeuristic = searchHelpers.manhattanDistance(start, end);
  priorityQueue.push(start, startHeuristic);

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

      // Skip walls and already visited nodes
      if (
        neighborCell.isWall ||
        visited.some((node) => searchHelpers.arraysMatch(node, neighbor))
      ) {
        continue;
      }

      // Only add to queue if not already processed
      if (!path[neighborKey] && !searchHelpers.arraysMatch(neighbor, start)) {
        path[neighborKey] = currentNode;

        // Calculate heuristic (Manhattan distance to goal)
        const heuristic = searchHelpers.manhattanDistance(neighbor, end);

        // Add to priority queue if not already there
        if (
          !priorityQueue.hasElement((element) =>
            searchHelpers.arraysMatch(element.value, neighbor)
          )
        ) {
          priorityQueue.push(neighbor, heuristic);
        }
      }
    }
  }

  const finalGrid = searchHelpers.updateGrid(
    searchHelpers.updateGrid(grid, visited, false),
    pathArray || [],
    true
  );

  return { newGrid: finalGrid, gridWithPath: finalGrid, visited, pathArray: pathArray || [] };
}
