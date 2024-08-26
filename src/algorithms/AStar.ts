import { searchHelpers } from "../helpers/searchHelpers";
import PriorityQueue from "../helpers/PriorityQueue";
import { CellState } from "../context/GridContext";

export function AStar(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
) {
  const visited: [number, number][] = [];
  let pathArray: [number, number][] | null = [];

  const path: { [key: string]: [number, number] | null } = {};
  const gScore: { [key: string]: number } = {};
  const fScore: { [key: string]: number } = {};

  const open = new PriorityQueue<[number, number]>();
  gScore[start.toString()] = 0;
  fScore[start.toString()] = searchHelpers.manhattanDistance(start, end);
  open.push(start, fScore[start.toString()]);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const thisCell = grid[i][j];
      const thisCellKey = [i, j].toString();

      if (!thisCell.isWall) {
        if (!thisCell.isStart) {
          gScore[thisCellKey] = Infinity;
          fScore[thisCellKey] = Infinity;
        }
        path[thisCellKey] = null;
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
      const neighborCell = grid[neighbor[0]][neighbor[1]];
      const neighborKey = neighbor.toString();
      const currentNodeKey = currentNode.toString();
      const potentialScore =
        gScore[currentNodeKey] + (neighborCell.isWeight ? 10 : 1);

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

  const finalGrid = searchHelpers.updateGrid(
    searchHelpers.updateGrid(grid, visited, false),
    pathArray || [],
    true
  );

  return { newGrid: finalGrid, gridWithPath: finalGrid, visited, pathArray };
}
