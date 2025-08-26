import { CellState } from "../context/GridContext";

export const searchHelpers = {
  manhattanDistance: (
    start: [number, number],
    end: [number, number]
  ): number => {
    return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
  },

  getNeighbours: (
    node: [number, number],
    grid: CellState[][],
    rows: number,
    cols: number
  ): [number, number][] => {
    const [row, col] = node;
    const neighbours: [number, number][] = [];

    if (row > 0) neighbours.push([row - 1, col]);
    if (row < rows - 1) neighbours.push([row + 1, col]);
    if (col > 0) neighbours.push([row, col - 1]);
    if (col < cols - 1) neighbours.push([row, col + 1]);

    return neighbours;
  },

  arraysMatch: (arr1: number[], arr2: number[]): boolean => {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
  },

  getPath: (
    path: { [key: string]: [number, number] | null },
    end: [number, number]
  ): [number, number][] => {
    const pathArray: [number, number][] = [];
    let currentNode = end;

    while (path[currentNode.toString()] !== null) {
      pathArray.push(currentNode);
      currentNode = path[currentNode.toString()]!;
    }

    return pathArray.reverse();
  },

  updateGrid: (
    grid: CellState[][],
    nodes: [number, number][],
    isPath: boolean
  ): CellState[][] => {
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    for (const [x, y] of nodes) {
      if (isPath) {
        newGrid[x][y].isPath = true;
      } else {
        newGrid[x][y].isVisited = true;
      }
    }

    return newGrid;
  },

  hasVertex: (array: [number, number], array2D: [number, number][]) => {
    return array2D.some(
      (vertex) => vertex[0] === array[0] && vertex[1] === array[1]
    );
  },
};
