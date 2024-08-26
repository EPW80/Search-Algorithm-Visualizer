import { searchHelpers } from "../helpers/searchHelpers";
import PriorityQueue from "../helpers/PriorityQueue";

export function AStar(
  grid: any[][],
  start: [number, number],
  end: [number, number]
) {
  const visited: [number, number][] = [];
  let pathArray: [number, number][] | null = [];

  const path: { [key: string]: [number, number] | null } = {};
  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};

  const open = new PriorityQueue();
  gScore[start.toString()] = 0;
  fScore[start.toString()] = searchHelpers.manhattanDistance(start, end);
  open.push(start, fScore[start.toString()]);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const thisCell = [i, j];
      if (!grid[i][j].includes("wall")) {
        if (!grid[i][j].includes("start")) {
          gScore[thisCell.toString()] = Infinity;
          fScore[thisCell.toString()] = Infinity;
        }
        path[thisCell.toString()] = null;
      }
    }
  }

  while (open.size() > 0) {
    const minCell = open.pop();
    if (!minCell) break; // Handle the case where pop() returns undefined
    const currentNode = minCell.value;

    if (searchHelpers.arraysMatch(currentNode, end)) {
      pathArray = searchHelpers.getPath(path, end);
      break;
    }

    if (!visited.some((node) => searchHelpers.arraysMatch(node, currentNode))) {
      visited.push(currentNode);
    }

    const neighbors = searchHelpers.getNeighbours(
      currentNode,
      grid,
      grid.length,
      grid[0].length
    );

    for (const neighbor of neighbors) {
      const neighborKey = neighbor.toString();
      const currentNodeKey = currentNode.toString();
      let potentialScore =
        gScore[currentNodeKey] +
        (grid[neighbor[0]][neighbor[1]].includes("weight") ? 10 : 1);

      if (potentialScore < gScore[neighborKey]) {
        path[neighborKey] = currentNode;
        gScore[neighborKey] = potentialScore;
        fScore[neighborKey] =
          potentialScore + searchHelpers.manhattanDistance(neighbor, end);
        if (
          !open.hasElement((element) =>
            searchHelpers.arraysMatch(element.value, neighbor)
          )
        ) {
          open.push(neighbor, fScore[neighborKey]);
        }
      }
    }
  }

  const newGrid = searchHelpers.updateGrid(grid, visited, false);
  let gridWithPath = searchHelpers.updateGrid(newGrid, pathArray || [], true);

  return { newGrid, gridWithPath, visited, pathArray };
}
