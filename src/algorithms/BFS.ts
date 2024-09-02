import { searchHelpers } from "../helpers/searchHelpers";
import { CellState } from "../context/GridContext";

export function BFS(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
) {
  const { visited, pathArray } = bfs(grid, start, end);

  let newGrid = searchHelpers.updateGrid(grid, visited, false);
  let gridWithPath = newGrid.map((arr) => arr.slice());

  if (pathArray !== null) {
    gridWithPath = searchHelpers.updateGrid(gridWithPath, pathArray, true);
  }

  return { newGrid, gridWithPath, visited, pathArray };
}

function bfs(
  grid: CellState[][],
  vertex: [number, number],
  end: [number, number]
) {
  let stack: [number, number][] = [];
  let visited: [number, number][] = [];
  let path: { [key: string]: [number, number] } = {};
  let pathArray: [number, number][] = [];

  stack.unshift(vertex);
  visited.push(vertex);

  while (stack.length > 0) {
    let cur = stack.pop();
    if (!cur) break;

    // Target found
    if (searchHelpers.arraysMatch(cur, end)) {
      let tempCur = end;
      while (!searchHelpers.arraysMatch(tempCur, vertex)) {
        pathArray.unshift(tempCur);
        tempCur = path[tempCur.toString()];
      }
      return { visited, pathArray };
    }

    const neighbors = searchHelpers.getNeighbours(
      cur,
      grid,
      grid.length,
      grid[0].length
    );
    if (neighbors) {
      for (let neighbor of neighbors) {
        if (!searchHelpers.hasVertex(neighbor, visited)) {
          visited.push(neighbor);
          path[neighbor.toString()] = cur;
          stack.unshift(neighbor);
        }
      }
    }
  }
  return { visited, pathArray };
}
