import { CellState } from "../context/GridContext";
import { searchHelpers } from "../helpers/searchHelpers";

export interface AlgorithmResult {
  newGrid: CellState[][];
  gridWithPath: CellState[][];
  visited: [number, number][];
  pathArray: [number, number][] | null;
}

export abstract class BaseAlgorithm {
  protected visited: [number, number][] = [];
  protected pathArray: [number, number][] | null = [];

  /**
   * Abstract method that each algorithm must implement
   * @param grid The grid of cells
   * @param start Starting position [row, col]
   * @param end Target position [row, col]
   * @returns Algorithm execution result
   */
  abstract execute(
    grid: CellState[][],
    start: [number, number],
    end: [number, number]
  ): AlgorithmResult;

  /**
   * Common path reconstruction logic using Map for better performance
   * @param pathMap Map containing parent relationships
   * @param end Target position
   * @param start Starting position
   * @returns Array of coordinates representing the path
   */
  protected reconstructPath(
    pathMap: Map<string, [number, number]>,
    end: [number, number],
    start: [number, number]
  ): [number, number][] {
    const pathArray: [number, number][] = [];
    let currentNode = end;
    const startKey = start.toString();

    while (currentNode && currentNode.toString() !== startKey) {
      pathArray.push(currentNode);
      const parentNode = pathMap.get(currentNode.toString());
      if (!parentNode) break;
      currentNode = parentNode;
    }

    return pathArray.reverse();
  }

  /**
   * Alternative reconstruction method for algorithms using object-based paths
   * @param pathObj Object containing parent relationships
   * @param end Target position
   * @returns Array of coordinates representing the path
   */
  protected reconstructPathFromObject(
    pathObj: { [key: string]: [number, number] | null },
    end: [number, number]
  ): [number, number][] {
    return searchHelpers.getPath(pathObj, end);
  }

  /**
   * Creates a coordinate key for Map/Object indexing
   * @param coord Coordinate tuple [row, col]
   * @returns String key representation
   */
  protected createKey(coord: [number, number]): string {
    return coord.toString();
  }

  /**
   * Checks if target has been reached
   * @param current Current position
   * @param target Target position
   * @returns Boolean indicating if target is reached
   */
  protected isTargetReached(
    current: [number, number],
    target: [number, number]
  ): boolean {
    return searchHelpers.arraysMatch(current, target);
  }

  /**
   * Checks if a node has been visited
   * @param node Node to check
   * @param visitedList List of visited nodes
   * @returns Boolean indicating if node was visited
   */
  protected isVisited(
    node: [number, number],
    visitedList: [number, number][]
  ): boolean {
    return searchHelpers.hasVertex(node, visitedList);
  }

  /**
   * Gets valid neighbors for a given position
   * @param position Current position
   * @param grid The grid
   * @returns Array of valid neighbor coordinates
   */
  protected getValidNeighbors(
    position: [number, number],
    grid: CellState[][]
  ): [number, number][] {
    return searchHelpers.getNeighbours(
      position,
      grid,
      grid.length,
      grid[0]?.length || 0
    );
  }

  /**
   * Calculates Manhattan distance between two points
   * @param start Starting position
   * @param end Ending position
   * @returns Manhattan distance
   */
  protected calculateManhattanDistance(
    start: [number, number],
    end: [number, number]
  ): number {
    return searchHelpers.manhattanDistance(start, end);
  }

  /**
   * Gets the weight/cost of moving to a cell
   * @param cell The cell to move to
   * @returns Movement cost (1 for normal, 10 for weighted)
   */
  protected getCellWeight(cell: CellState): number {
    return cell.isWeight ? 10 : 1;
  }

  /**
   * Finalizes the algorithm result by updating the grid with visited nodes and path
   * @param grid Original grid
   * @param visited Array of visited nodes
   * @param pathArray Array of path nodes (or null if no path found)
   * @returns Final algorithm result
   */
  protected createResult(
    grid: CellState[][],
    visited: [number, number][],
    pathArray: [number, number][] | null
  ): AlgorithmResult {
    // Update grid with visited nodes
    const gridWithVisited = searchHelpers.updateGrid(grid, visited, false);

    // Update grid with path if found
    const finalGrid = pathArray
      ? searchHelpers.updateGrid(gridWithVisited, pathArray, true)
      : gridWithVisited;

    return {
      newGrid: finalGrid,
      gridWithPath: finalGrid,
      visited,
      pathArray,
    };
  }

  /**
   * Resets the algorithm state for a fresh execution
   */
  protected resetState(): void {
    this.visited = [];
    this.pathArray = [];
  }

  /**
   * Validates input parameters
   * @param grid The grid to validate
   * @param start Starting position
   * @param end Ending position
   * @throws Error if parameters are invalid
   */
  protected validateInputs(
    grid: CellState[][],
    start: [number, number],
    end: [number, number]
  ): void {
    if (!grid || grid.length === 0 || !grid[0] || grid[0].length === 0) {
      throw new Error("Invalid grid: Grid must be non-empty");
    }

    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const rows = grid.length;
    const cols = grid[0].length;

    if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols) {
      throw new Error("Invalid start position: Out of grid bounds");
    }

    if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
      throw new Error("Invalid end position: Out of grid bounds");
    }

    if (grid[startRow]?.[startCol]?.isWall) {
      throw new Error("Invalid start position: Cannot start on a wall");
    }

    if (grid[endRow]?.[endCol]?.isWall) {
      throw new Error("Invalid end position: Cannot end on a wall");
    }
  }
}
